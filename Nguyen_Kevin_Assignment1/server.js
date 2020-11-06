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

app.use(myParser.urlencoded({ extended: true}));
app.post("/process_form", function (request, response, next) {
    console.log(request.body)
    //a sad attempt to validate the quantity data, need to fix this later
  
            
        
purchase_qs = qs.stringify(request.body);
    //If data is valid send them to the invoice with the quantities
    response.redirect('./invoice.html?' + purchase_qs);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log (`listening on port 8080`));


