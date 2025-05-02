import fs from 'fs';
import csv from 'csv-parser';


export interface csvrow {
    username: string;
    recovery_code: string;
    password: number;
}

export interface csvcountresult {
    inserted: csvrow[];
    failed: { row: any; reason: string }[]
}

export const processCSV = (filepath: string): Promise<csvcountresult> => {
    return new Promise((resolve, reject) => {
        const inserted: csvrow[] = [];
        const failed: { row: any; reason: string }[] = [];

        fs.createReadStream(filepath).pipe(csv()).on('data', (rowdata) => {
            const row = {
                username: rowdata.username?.trim(),
                password: rowdata.password?.trim(),
                recovery_code: rowdata.recovery_code?.trim(),
            };
            if (!row.username || !row.password || !row.recovery_code) {
                failed.push({ row, reason: 'Missing required fields' });
            } else {
                inserted.push(row as csvrow)
            }
        }).on('end', () => {
            resolve({ inserted, failed });
        }).on('error', (error) => reject(error));
    })
}