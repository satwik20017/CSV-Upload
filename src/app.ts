import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processCSV } from '../csv_helper/csvhelper';
import { scheduleCSV_JOB } from './csvJOB';
// import { dbconnections } from '../dbconnections/mysql';
const app = express();

app.use(express.json());

// dbconnections()
app.listen(3000, () => {
    console.log(`Connected to Server: PORT 3000`);
})

const uploaddir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploaddir)) {
    fs.mkdirSync(uploaddir, { recursive: true });
}

['pending', 'processed', 'failed'].forEach(dir => {
    const folderPath = path.join(__dirname, `../schecular-uploads/uploads/${dir}`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });
  
const upload = multer({
    dest: path.join(__dirname, '../uploads'),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === `text/csv`) {
            cb(null, true)
        } else {
            cb(new Error('Only CSV files are allowed!'))
        }
    }
})

app.post('/csv', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: `No file Uploaded` })
    }
    try {
        const { inserted, failed } = await processCSV(req.file.path);
        return res.status(200).json({ message: `Upload Successfully`, Inserted_records: inserted.length, Failed_records: failed.length, Failed_data: failed, Inserted_data: inserted })

    } catch (error: any) {
        console.log('Error processing file');
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
})


scheduleCSV_JOB();