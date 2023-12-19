const User = require('../models/User.js');

async function seedUsers(){

    try{

        await User.create({

            username: "GMorrow1234",
            email: "gabriel.morrow@morrow.com"
        });
        
        await User.create({
        
            username: "JMorrow5678",
            email: "josiah.morrow@morrow.com"
        });
        
        await User.create({
        
            username: "NMorrow5378",
            email: "naomi.morrow@morrow.com"
        });
        
        await User.create({
        
            username: "BMorrow5228",
            email: "brent.morrow@morrow.com"
        });
        
        await User.create({
        
            username: "HMorrow5118",
            email: "heidi.morrow@morrow.com"
        });
        
        console.log("Users Seeded!!")

    } catch (error) {

        console.log("Error", error)
    }
}

module.exports = {seedUsers};
