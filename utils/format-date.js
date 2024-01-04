


/* The Xpert Learning Assistant AI gave me the code for this function. 
It formats the date to be more human-readable.*/
function formatDate(date){

    let options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      

      let formattedDate = date.toLocaleString('en-US', options);
      return formattedDate;
}

module.exports = formatDate