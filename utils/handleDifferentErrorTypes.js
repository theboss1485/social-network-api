function handleDifferentErrorTypes(res, error){

    let errorMessage = undefined;

    if(error.message === "Invalid user ID" ){

        errorMessage = "The user ID you provided doesn't match any records."
        res.status(404).json({clearMessage: errorMessage}, error);
    
    } else if(error.code === 11000){

        errorMessage = "The username or email address you provided is already in use."
        res.status(404).json({clearMessage: errorMessage});
    
    } else if(error.message === "Missing Info - Email or Username"){

        errorMessage = "You must provide an email or username in the request body."
        res.status(404).json({clearMessage: errorMessage})

    } else {

        errorMessage = "Internal Server Error"
        res.status(500).json({clearMessage: errorMessage}, error);
    }

    console.log(errorMessage);
}

module.exports = handleDifferentErrorTypes;