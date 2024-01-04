const connection = require('../config/connection');
const {seedUsers} = require('../seeds/user-seeds.js')
const {seedThoughts} = require('../seeds/thought-seeds.js')

/* This method deletes the users and thoughts from the database and then
reseeds the database.*/
connection.once('open', async () => {

    
    /* The syntax of the check for the users and the thoughts were taken from some of the activities for
    Module 18.*/ 
    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();

    if (userCheck.length) {

        await connection.dropCollection('users');
    }
  
    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();

    if (thoughtCheck.length) {

      await connection.dropCollection('thoughts');
    }
    
    await seedUsers();

    await seedThoughts();
   

    console.log("seeding complete!!");
    process.exit();
});


