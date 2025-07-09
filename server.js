const express = require('express');
const path = require('path');
require('dotenv').config();

const morgan = require('morgan')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const postRouters = require('./routes/post-routes');
const contactRouters = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');
const postApiRoutes = require('./routes/api-post-routes');

const chalk = require('chalk');
const errorMsg = chalk.bgWhite.redBright;
const successMsg = chalk.bgGreen.white;

const app = express();



app.set('view engine', 'ejs');

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log(successMsg('Connected to DB')))
  .catch((error) => console.log(errorMsg(error)));



app.listen(process.env.PORT, (error) => {
  error ? console.log(errorMsg(error)) : console.log(successMsg(`listening port ${process.env.PORT}`));
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.urlencoded({extended: false}));

app.use(express.static('styles'));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.use(postRouters);
app.use(contactRouters);
app.use(postApiRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});
