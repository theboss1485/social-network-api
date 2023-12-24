
/*This function handles a lot of different scenarios related to errors with thought routes.*/
function handleDifferentThoughtErrorTypes(res, error, reaction = false){

    let errorMessage = undefined;

    if(error.message.includes("Invalid thought ID") || error.name === "CastError"){

        let fragment = "";

        if(reaction = true){

            fragment = "or reaction ID";
        }
        
        if(fragment !== ""){

            errorMessage = `Either the thought ID ${fragment} you provided doesn't match any records,` + 
                           `or the reaction ID you provided isn't in the provided thought's reaction list. `

            res.status(404).json({errorMessage: errorMessage});

        } else {

            errorMessage = `The thought ID you provided doesn't match any records.`
            res.status(404).json({errorMessage: errorMessage});
        }

    } else if(error.message === "Invalid username"){

        errorMessage = "The provided username doesn't match any users"
        res.status(404).json({errorMessage: errorMessage});

    } else if(error.message === "Invalid thought text or username"){

        errorMessage = "You must provide both a username and thought text in the request body."
        res.status(400).json({errorMessage: errorMessage});


    } else if(error.message.includes("thought text")){

        errorMessage = "You must provide thought text in the request body."
        res.status(400).json({errorMessage: errorMessage});

    } else if(error.message.includes("reaction body")){

        errorMessage = "You must provide a reaction body in the request body.";
        res.status(400).json({errorMessage: errorMessage});
    }
    
    /*This is a generic error message for any thought-related scenarios that I didn't implement.*/
    else {

        errorMessage = "Internal Server Error"
        console.log(error);
        res.status(500).json({errorMessage: errorMessage, error});
    }

}

module.exports = handleDifferentThoughtErrorTypes;