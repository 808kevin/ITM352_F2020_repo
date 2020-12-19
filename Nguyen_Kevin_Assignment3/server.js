//Code from Lab13 Ex4
var express = require('express'); //uses express
var app = express();//gets express
var myParser = require("body-parser");
var fs = require('fs');
var products = require('./products.json'); //gets stuff from products.json
var products_data = require('./products.json'); //gets stuff from products.json
var filename = 'user_data.json';
var session = require('express-session');
const nodemailer = require('nodemailer');

app.use(session({ secret: "ITM352 rocks!" }));

//Borrowed code for processing login/registration from Alyssa, with assistance from Daphne and Professor Port 
//Checking filename user_data.json
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    var data = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
} else {
    console.log(`ERR: ${filename} does not exist!`);
}

// Code from Professors Port :)
var qs = require('querystring'); //allows the query string to become the info for the invoice 
const bodyParser = require('body-parser');

var user_datafile = 'user_data.json';
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    
    //initialize shopping cart, if not already there. (Got this code from Class Session with Daphne and Professor Port)
    if (typeof request.session.cart == 'undefined') {

        request.session.cart = {};
        for (pk in products_data) {
            emptyArray = new Array(products_data[pk].length).fill(0)
            request.session.cart[pk] = emptyArray;
        }
        console.log(request.session.cart)
    }
    next();
});

//Got this from Assignment 3 Code Example
app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

//Gets cart data for the shopping cart
app.post("/get_cart_data", function (request, response) {
    response.json(request.session.cart);
});

app.use(myParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//User Login code (Borrowed from Alyssa)
app.post("/login_form", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase();// making username lowercase
    if (typeof users_reg_data[the_username] != 'undefined') {
        if (req.body.password == users_reg_data[req.body.username].password) { //redirects user to invoice after login, got assistance from Professor Port in 1on1 session
            req.session.username = the_username;
            res.redirect('./index.html');
            
        } else { //notifies user of invalid password (Borrowed from Alyssa)
            LogError.push('Invalid Password');
            console.log(LogError);
            req.query.LogError = LogError.join(';');
        }
    } else { //notifies user of invalid username (Borrowed from Alyssa)
        LogError.push('Invalid Username');
        console.log(LogError);
        req.query.LogError = LogError.join(';')
    }

   
});

//Making Account / validatting account code (Borrowed from Alyssa)
app.post("/process_register", function (req, res) {
    var errors = [];
    var reguser = req.body.username.toLowerCase();

    if (typeof users_reg_data[reguser] != 'undefined') {
        //notifes user if a username is taken
        errors.push('Username Taken')
    }
    //Use of only letters for Full Name
    if (/^[A-Za-z]+$/.test(req.body.name)) {
    }
    else {
        errors.push('Use Only Letters for Full Name');
    }
    // validating Full Name
    if (req.body.name == "") {
        errors.push('Invalid Full Name');
    }
    // length of full name is between 0 and 25 
    if ((req.body.fullname.length > 25 && req.body.fullname.length < 0)) {
        errors.push('Full Name Too Long');
    }
    //Makes user use only letters and numbers 
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
        errors.push('Letters And Numbers Only for Username')
    }
    //Password character requirement
    if (req.body.password.length < 6) {
        errors.push('Password Too Short')
    }
    // Making sure passwords are the same 
    if (req.body.password !== req.body.repeat_password) {
        errors.push('Password Not a Match')
    }
    //Saves user's registration in user_data.json (Referenced from lab 14) Got assistance from Professor Port during 1on1
    username = req.body.username;
    req.query.username = username;
    purchase_qs = qs.stringify(req.query);
    if (errors.length == 0) {
        POST = req.body
        console.log('no errors')
        users_reg_data[username] = {};
        users_reg_data[username].name = req.body.username;
        users_reg_data[username].password = req.body['password'];
        users_reg_data[username].email = req.body['email'];
        data = JSON.stringify(users_reg_data);
        fs.writeFileSync(filename, data, "utf-8");
        res.redirect('./index.html?');
    }
    //Keeping user at register page due to error/Logging it in console
    else {

        console.log(errors)
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;
        req.query.errors = errors.join(';');
        res.redirect('./register.html?');

    }
});

//WHERE CART CODE BEGINS
//Changed to update cart since we are now leading it to a cart page instead (Got this code from Class Session Example)
app.post("/update_cart", function (request, response, next) {
    console.log(request.body);


    // Code from Lab13 along with assistance from Daphne Oh 
    //Validate update cart quantity data. Check each quantity is non negative integer or blank.
    if (isNonNegIntString(request.body.quantity) == true) {
        pk = request.body.products_key;
        qty = Number.parseInt(request.body.quantity);
        idx = Number.parseInt(request.body.product_index);
        request.session.cart[pk][idx] = qty;
    }

request.session.save();
console.log(request.session.cart);
});

//Code From Assignment 3 Example Code to get products
app.get("/add_to_cart", function (request, response) {
    var products_key = request.query['products_key']; // get the product key sent from the form post
    var quantities = request.query['quantity'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
    request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html');
});

//Code from Professor Port where clicking purchase leads to login/invoice depending if there is a username
app.post("/checkout", function (request, response) {
    if (!request.session.username){
        response.redirect('./login.html')
    }
    else{
    response.redirect('./invoice.html?username='+request.session.username);
}
    return;
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Code from by Lab13 and Assignment1 Example
function isNonNegIntString(string_to_check, returnErrors = false) {
    /* This function returns true if string_to_check is a non-negative integer.*/
    errors = []; // assume no errors at first
    if (string_to_check == '') string_to_check = 0;
    if (Number(string_to_check) != string_to_check) { errors.push('Not a number!'); } // Check if string is a number value
    else {
        if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    }

    return returnErrors ? errors : ((errors.length > 0) ? false : true);
}

//Code to checkout products and send email (Got this from A3 Example Code)
app.post("/complete_purch", function (request, response) {
    //Check if user logged in , if not send to login
     if(!request.session.username) {
         response.redirect("./login.html");
         return;
     } 
 
     //Combined the code from A3 Example Code along with Code from Invoice to make the thing being sent to email
     user_email = users_reg_data[request.session.username]["email"];
     var output_message = `Thank you ${users_reg_data[request.session.username]["name"]} for your order`;
     var invoice_str = `Thank you for your order!<table border><th>Item</th><th>Quantity</th><th>Price</th><th>Extended Price</th>`;
     var shopping_cart = request.session.cart;
     subtotal = 0;
     for (product_key in products_data) {
         for (product_index in products_data[product_key]) {
             if (typeof shopping_cart[product_key] == 'undefined') continue;
             qty = shopping_cart[product_key][product_index];
             if (qty > 0) {
                 ext_price = qty * products_data[product_key][product_index]["price"];
                 subtotal += ext_price;
                 invoice_str += `<tr><td>${products_data[product_key][product_index].name}</td><td>${qty}</td><td>\$${products_data[product_key][product_index]["price"].toFixed(2)}</td><td>\$${ext_price.toFixed(2)}</td><tr>`;
             }
         }
     }
     //Made this code to make the invoice table in email with Daphe
     // Compute Sales Tax
     var tax = 0.05 * subtotal;

     
 
     var shipping = 0;
     // Compute shipping
     if (subtotal <= 50) {
        shipping = 2;
      }
      if (subtotal <= 100) {
        shipping = 5;
      }
      else {
        shipping = 0.05 * subtotal; // 5% of subtotal

      }
// Compute Grand Total
     var total = subtotal + tax + shipping;

     invoice_str += `<tr>
     <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
     <td width="54%">\$${subtotal.toFixed(2)}</td>
   </tr>`;
     invoice_str += `
       <tr>
         <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @ 5%</span></td>
         <td width="54%">\$${tax.toFixed(2)}</td>
       </tr>
       `;
     invoice_str += `
       <tr>
         <td style = "text-align: center;" colspan = "3" width="67"><span style="font-family: arial;">Shipping</span></td>
         <td width="54%">$${shipping.toFixed(2)}</td>
       `;
       invoice_str += `
       <tr>
         <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
         <td width="54%"><strong>\$${total.toFixed(2)}</strong></td>
       </tr>
       `;
     invoice_str += '</table>';
     //Also got this part from A3 example code
     // Set up mail server. Only will work on UH Network due to security restrictions
     var transporter = nodemailer.createTransport({
         host: "mail.hawaii.edu",
         port: 25,
         secure: false, // use TLS
         tls: {
             // do not fail on invalid certs
             rejectUnauthorized: false
         }
     });
 
     
     var mailOptions = {
         from: 'creativejewelry@bogus.com',
         to: user_email,
         subject: 'Your invoice',
         html: invoice_str
     };
 
     
     transporter.sendMail(mailOptions, function (error, info) {
        
        if (error) {
            output_message += `<br>There was an error and your invoice could not be emailed : to ${user_email}`;
        } else {
            output_message += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(output_message);
    });
 
 });

