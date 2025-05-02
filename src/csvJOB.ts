import fs from 'fs';
import path from 'path';
import { scheduleJob } from 'node-schedule';
import { processCSV } from '../csv_helper/csvhelper';

const PENDING_DIR = path.join(__dirname, '../schecular-uploads/uploads/pending');
const PROCESSED_DIR = path.join(__dirname, '../schecular-uploads/uploads/processed');
const FAILED_DIR = path.join(__dirname, '../schecular-uploads/uploads/failed');

const movefile = (src: string, destdir: string) => {
    const dest = path.join(destdir, path.basename(src));
    fs.renameSync(src, dest);
}


export const scheduleCSV_JOB = () => {
    scheduleJob(`*/1 * * * *`, async () => {
        console.log(`Checking for Pending CSV files...`);

        const exclude_nonCSV_files = fs.readdirSync(PENDING_DIR)
        for (const file of exclude_nonCSV_files) {
            const filepath = path.join(PENDING_DIR, file);
            if (!file.endsWith('.csv')) {
                console.log(`[!] Skipping unsupported file: ${file}`);
                movefile(filepath, FAILED_DIR);
                continue;
            }
        }
        const files = fs.readdirSync(PENDING_DIR).filter(item => item.endsWith('.csv'));

        for (const file of files) {
            const filepath = path.join(PENDING_DIR, file);
            try {
                const { inserted, failed } = await processCSV(filepath);

                console.log(`[✔] Processed ${file}`);
                console.log(`    Inserted: ${inserted.length}`);
                console.log(`    Failed: ${failed.length}`);

                const destdir = inserted.length > 0 ? PROCESSED_DIR : FAILED_DIR;
                movefile(filepath, destdir);
            } catch (error: any) {
                console.error(`[✘] Error processing ${file}:`, error);
                movefile(filepath, FAILED_DIR);
            }
        }
    })
}