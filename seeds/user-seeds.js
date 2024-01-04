const User = require('../models/User.js');

// This function seeds the database with users.
async function seedUsers(){
    
    try{

        await createUser("GMorrow1234", "gabriel.morrow@morrow.com");
        await createUser("JMorrow5678", "josiah.morrow@morrow.com");
        await createUser("NMorrow5378", "naomi.morrow@morrow.com");
        await createUser("BMorrow5228", "brent.morrow@morrow.com");
        await createUser("HMorrow5118", "heidi.morrow@morrow.com");
    
        console.log("Users Seeded!!")
    
    } catch (error) {
    
        console.log("Error", error)
    }
}

/* This function creates a thought for the purpose of seeding the database*/
async function createUser(username, email){

    let newUser = await User.create({

        username: username,
        email: email
    });

    await newUser.save();
}

module.exports = {seedUsers};
