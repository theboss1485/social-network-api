const express = require('express');
const routes = require('./routes');

// Here, I import the Sequelize database connection.
const sequelize = require('./config/connection.js')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);



/* The Xpert Learning Assistant AI chatbot told me how to use the sequelize.sync() method. */

// Here, I sync the Sequelize models to the database, and then turn on the server.
sequelize.sync().then(() => {

    console.log("sequelize synchronization successful");

    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}!`);
    });

}).catch((error) =>{

    console.log(error)
});