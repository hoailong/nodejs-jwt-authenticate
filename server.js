const express = require('express');
const path = require('path');
const app = express();

const router = require('./routes/index');

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}.`);
});