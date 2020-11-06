//Code from Lab13 Ex4
var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require ('fs');
var products = require ('./products.json');

// Code from Professors Port :)
var qs = require('querystring'); //allows the query string to become the info for the invoice 


app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.get("/get_products", function (request, response) {
  // process_quantity_form(request.body, response);
  // Code from Professor Port :)
  response.type('.js');
  console.log(" var products = " + JSON.stringify(products) + ";");
  response.send(" var products = " + JSON.stringify(products) + ";");
});

app.use(myParser.urlencoded({extended: true}));
//Handles the post request from the purchase request. Validate data and send to invoice.
app.post("/process_form", function(request, response, next){
 //console.log(request.body);  

//Validate purchase data. Check each quantity is non negative integer or blank.
var validqty = true; //Check for valid input. 
var totlpurchases = false; //Check there were any input and not all 0.
for (i = 0; i < products.length; i++) {
    aqty = request.body[`quantity${i}`];
    //console.log(isNonNegIntString(aqty));
    if(isNonNegIntString(aqty) == false){
        validqty = false; //Invalid data 

    }
    if (aqty > 0){ //No data waas input or was left blank.
        totlpurchases = true;
    }

         // Create query string of quantity data for invoice. 

    purchase_qs = qs.stringify(request.body);
    //console.log(purchase_qs);
//If data is valid, then send to invoice. 
   
    if (validqty == true && totlpurchases == true) { 
        response.redirect('./invoice.html?' + purchase_qs); 
    }
    //If data not valid reload products page. 
    else { 
        response.redirect("./index.html?"); // goes to an error page to inform the person that they have inputted an invalid quantity.
    }
}


});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegIntString(string_to_check, returnErrors = false) {
    /*
    This function returns true if string_to_check is a non-negative integer. 
    If returnErrors = true will return the array of reasons it is not a 
    non-negative integer.
     */
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) { errors.push('Not a number!'); } // Check if string is a number value
    else {
        if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    }

    return returnErrors ? errors : ((errors.length > 0) ? false : true);
}
