const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./Database');
require('dotenv').config();

const Api = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// initialize database tables in sequelize
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


// initialize api routes
app.use('/api/v1', Api);

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at port http://localhost:${PORT}`);
});