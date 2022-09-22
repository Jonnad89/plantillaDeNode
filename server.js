const dotenv = require('dotenv')

const { app } = require('./app')


//Utils
const { initModels } = require('./models/init.models')
const { db } = require('./utils/database.util')
//postgres ->STRING ->varchar
//mysql    ->STRING ->text
//mssql    ->STRING ->char
dotenv.config({ path: './config.env' })
const startServer = async () => {
  try {
    await db.authenticate();

    //Establish the relations between models
    initModels();

    await db.sync();


    // Express server to listen
    const PORT = 4000

    app.listen(PORT, () => {
      console.log('Express app running');

    });

  } catch (error) {
    console.log(error);
  };
};

startServer();

