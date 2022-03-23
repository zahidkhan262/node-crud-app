var url = "mongodb://localhost:27017/";

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const monk = require('monk');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

