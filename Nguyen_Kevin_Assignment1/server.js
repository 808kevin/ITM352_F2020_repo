//Code from Lab13 Ex4
var express = require('express'); //uses express
var app = express();//gets express
var myParser = require("body-parser");
var fs = require('fs');
var products = require('./products.json'); //gets stuff from products.json

// Code from Professors Port :)
var qs = require('querystring'); //allows the query string to become the info for the invoice 


app.all('*', function (request, response, next) 
{
    console.log(request.method + ' to ' + request.path);
    next();
});

app.get("/get_products", function (request, response) {
    // process_quantity_form(request.body, response);
    // Code from Professor Port :)
    response.type('.js');
    console.log(" var products = " + JSON.stringify(products) + ";"); //gets the json string from url
    response.send(" var products = " + JSON.stringify(products) + ";");//sends the json string thru
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response, next) {
    //console.log(request.body);  
    
// Code from Lab13 along with assistance from Daphne Oh 
    //Validate purchase data. Check each quantity is non negative integer or blank.
    var validqty = true; //Check for valid input. 
    var totlpurchases = false; //Check if there were any inputs and blank.
    for (i = 0; i < products.length; i++) {
        aqty = request.body[`quantity${i}`];
        if (isNonNegIntString(aqty) == false) {
            validqty &= false; //Invalid data 

        }
        if (aqty > 0) { //No input or was left blank.
            totlpurchases = true;
        }
    }
    // ADD COMMENT here about rediriected on valid/invalid quanity data
    // Create query string of quantity data for invoice. 
    purchase_qs = qs.stringify(request.body);
    //If data is valid, then send to invoice. 
    if (validqty == true && totlpurchases == true) {
        response.redirect('./invoice.html?' + purchase_qs);
    }
    //If data isn't valid reload main page. 
    else {
        response.redirect("./index.html?");
    }

});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Code from by Lab13 and Assignment1 Example
function isNonNegIntString(string_to_check, returnErrors = false) {
    /* This function returns true if string_to_check is a non-negative integer.*/
    errors = []; // assume no errors at first
    if(string_to_check == '') string_to_check = 0;
    if (Number(string_to_check) != string_to_check) { errors.push('Not a number!'); } // Check if string is a number value
    else {
        if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    }

    return returnErrors ? errors : ((errors.length > 0) ? false : true);
}


