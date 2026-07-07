const sql = require("mssql");

const config = {
    user: "sa",                
    password: "123456",
    server: "LAPTOP-5NAP8HSV\SQLEXPRESS02",
    database: "FreshKeep",

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

sql.connect(config)
.then(() => {
    console.log("Đã kết nối SQL Server");
})
.catch(err => {
    console.log(err);
});

module.exports = sql;