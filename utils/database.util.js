const { Sequelize, DataTypes } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

// Establish db connection
const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  port: process.env.DB_PORT,
  logging: false
});


//*export conts db (como haciamos en react para exportar)

module.exports = { db, DataTypes }