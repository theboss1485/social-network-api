const connection = require('../config/connection');
const {seedUsers} = require('../seeds/user-seeds.js')
const {seedThoughts} = require('../seeds/thought-seeds.js')

connection.once('open', async () => {

    // Delete the collections if they exist
    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();

    if (userCheck.length) {

      await connection.dropCollection('users');
      

    }
  
    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();

    if (thoughtCheck.length) {

      await connection.dropCollection('thoughts');
    }

    await seedThoughts();
    await seedUsers();

    console.log("seeding complete!!");
    process.exit();
});


