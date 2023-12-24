/*This function handles a lot of different scenarios related to errors with user routes.*/
function handleDifferentUserErrorTypes(res, error){

    let errorMessage = undefined;

    if (error.message.includes("Invalid user")){

        let fragment = "";

        if (error.message.includes("friend")){

            fragment = "or friend ID";
        } 

        errorMessage = `The user ID ${fragment} you provided doesn't match any records.`

        res.status(404).json({errorMessage: errorMessage});
    
    } else if (error.code === 11000){

        errorMessage = "The username or email address you provided is already in use."
        console.log(error);
        res.status(409).json({errorMessage: errorMessage});
    
    } else if (error.message.includes("Duplicate")){

        errorMessage = "The friend ID and user ID can't be identical."
        res.status(409).json({errorMessage: errorMessage});

    } else if (error.message.includes("already")){

        errorMessage = "The specified user already has the specified friend on his or her friends list."
        res.status(409).json({errorMessage: errorMessage});
        
    } else if (error.message === "Friend not on user's friend list"){

        errorMessage = "The specified friend is not on the specified user's friend list."
        res.status(404).json({errorMessage: errorMessage})

    } else if (error.message === "Missing Info - Email and Username"){

        errorMessage = "You must provide an email and username in the request body."
        res.status(400).json({errorMessage: errorMessage});

    }else if (error.message === "Missing Info - Email or Username"){

        errorMessage = "You must provide an email or username in the request body."
        res.status(400).json({errorMessage: errorMessage});

    } else if (error.name === "ValidationError") {

        res.status(422).json(error);
        console.log(error);

    /*This is a generic error message for any user-related scenarios that I didn't implement.*/
    } else {

        errorMessage = "Internal Server Error";
        console.log(error);
        res.status(500).json({errorMessage: errorMessage});
    }
}

module.exports = handleDifferentUserErrorTypes;