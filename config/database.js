const mongoose = require('mongoose')


const dbConnection =  (app) => {
    mongoose
        .connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`connected to mongoDB: ${conn.connection.host}`)
        })
    }

module.exports= dbConnection