
/*This function handles a lot of different scenarios related to errors with thought routes.
If the application comes upon an error that I didn't specifically handle, it displays a generic 
error message in the response to the client.*/
function handleDifferentThoughtErrorTypes(res, error, reaction = false){

    let errorMessage = undefined;

    console.log(error.name);

    if(error.message.includes("Invalid thought ID") || error.name === "CastError"){

        let fragment = "";

        if(reaction === true){

            fragment = "or reaction ID";
        }
        
        if(fragment !== ""){

            errorMessage = `Either the thought ID ${fragment} you provided doesn't match any records,` + 
                           ` or the reaction ID you provided isn't in the provided thought's reaction list. `

            res.status(404).json({errorMessage: errorMessage});

        } else {

            errorMessage = `The thought ID you provided doesn't match any records.`
            res.status(404).json({errorMessage: errorMessage});
        }

    } else if(error.message === "Invalid username"){

        errorMessage = "The provided username doesn't match any users"
        res.status(404).json({errorMessage: errorMessage});

    } else if(error.message === "Invalid thought text or username"){

        errorMessage = "You must provide both a username and at least one character of thought text in the request body."
        res.status(400).json({errorMessage: errorMessage});

    } else if(error.message.includes("thought text")){

        errorMessage = "You must provide at least one character of thought text in the request body."
        res.status(400).json({errorMessage: errorMessage});

    } else if (error.name === "ValidationError") {

        errorMessage = "The entered thought text must be between 1 and 280 characters.";
        res.status(422).json({errorMessage: errorMessage});
        console.log(error);

    /*This is a generic error message for any thought-related scenarios that I didn't implement.*/    
    } else if(error.message === "Mismatched username"){

        errorMessage = "The username you provided doesn't match any usernames on file.";
        res.status(400).json({errorMessage: errorMessage});

    } else if(error.message === "Missing username or reaction body"){

        errorMessage = "You must provide both a reaction body of at least one character and a username.";
        res.status(400).json({errorMessage: errorMessage});

    } else {

        errorMessage = "Internal Server Error - Something went wrong.  Please wait a few minutes and try again."
        console.log(error);
        res.status(500).json({errorMessage: errorMessage, error});
    }
}

module.exports = handleDifferentThoughtErrorTypes;