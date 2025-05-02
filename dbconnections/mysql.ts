// import mysql2 from 'mysql2';
// let mysqlConnection = {
//   connectionLimit: 100,
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "UPLOADS",
//   multipleStatements:true,
// };
// export let dbPool = mysql2.createPool(mysqlConnection);
// dbPool.getConnection((err, conn) => {
//   if (err) {
//     console.log("MySql not connected", err.message);
//   } else {
//     console.log("MySql Connected");
    
//   }
// });

// export async function dbconnections() {
//     try {
//         const connection = await dbPool;
//         console.log('MySQL connected successfully.');
//     } catch (err: any) {
//         console.log("MySql not connected", err.message);
//     }
// }