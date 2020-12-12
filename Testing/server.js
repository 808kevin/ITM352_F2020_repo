var express = require('express');
var app = express();
var products_data = require('./products.json');

app.use(myParser.urlencoded({ extended: true }));
app.use(session({secret: "ITM352 rocks!"}));

app.all('*', function (request, response, next) {
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
    next();
});

app.get("/get_products_data", function (request, response) {
    response.json(products_data);
});



app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));