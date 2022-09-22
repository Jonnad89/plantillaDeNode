const express = require('express');
//Models

const { usersRouter } = require('./routes/users.routes')

const { globalErrorHandler } = require('./controllers/error.controller')

//* init our Express
const app = express();
//* Enable express app to receive JSON data
app.use(express.json()); //* Middleware 
//Define endpoints
app.use('/api/v1/users', usersRouter);//exportado de users.routes

//Global error handler
app.use(globalErrorHandler)

//Catch non-existing endpoinst
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `${req.method} ${res.url} does not exists in our server`,
  });
});

module.exports = { app }