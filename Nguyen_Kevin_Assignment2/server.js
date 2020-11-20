//Code from Lab13 Ex4
var express = require('express'); //uses express
var app = express();//gets express
var myParser = require("body-parser");
var fs = require('fs');
var products = require('./products.json'); //gets stuff from products.json
var filename = 'user_data.json'

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

//Borrowed code for processing login/registration is from Alyssa, with assistance from Daphne and Professor Port (big thanks to these people)
//Checking filename user_data.json
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    var data = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
} else {
    console.log(`ERR: ${filename} does not exist!`);
}

//User Login code (Borrowed from Alyssa)
app.post("/login_form", function (req, res) {
    var LogError = [];
    console.log(req.body);
    the_username = req.body.username.toLowerCase();// making username lowercase
    if (typeof users_reg_data[the_username] != 'undefined'){
        if (req.body.password == users_reg_data[req.body.username].password){ //redirects user to invoice after login
            res.redirect('./invoice.html?' + purchase_qs);

        } else { //notifies user of invalid password (Borrowed from Alyssa)
            LogError.psuh = ('Invalid Password');
            console.log(LogError);
            req.query.username = the_username;
            req.query.name = users_reg_data[the_username].name;
            req.query.LogError = LogError.join(';');
        }
        } else { //notifies user of invalid username (Borrowed from Alyssa)
            LogError.push = ('Invalid Username');
            console.log(LogError);
            req.query.username = the_username;
            req.query.LogError = LogError.join(';')
        }
        res.redirect('./login.html?' + purchase_qs);
});

//Making Account / validatting account code 
app.post ("/process_register", function (req, res) {
    var errors = [];
    var reguser = req.body.username.toLowerCase();
    
    if (typeof users_reg_data[reguser] != 'undefined') {
        errors.push('Username Taken')
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
  //Saves user's registration in user_data.json (Referenced from lab 14)
  if (errors.length == 0) {
    POST = req.body
    console.log('no errors')
    var username = POST['username'];
    users_reg_data[username] = {}; //make it 'users'
    users_reg_data[username].name = username;
    users_reg_data[username].password= POST['password'];
    users_reg_data[username].email = POST['email'];
    data = JSON.stringify(users_reg_data); //change to users 
    fs.writeFileSync(filename, data, "utf-8");
    res.redirect('./invoice.html?' + purchase_qs);
  }
  //Keeping user at register page due to error/Logging it in console
  if (errors.length > 0) {
      console.log(errors)
      req.query.name = req.body.name;
      req.query.username = req.body.username;
      req.query.password = req.body.password;
      req.query.repeat_password = req.body.repeat_password;
      req.query.email = req.body.email;

      req.query.errors = errors.join(';');
      res.redirect('register.html?' + purchase_qs);
  }
});

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

    // Create query string of quantity data for invoice. 
    purchase_qs = qs.stringify(request.body);
    //If data is valid, then send to login. 
    if (validqty == true && totlpurchases == true) {
        response.redirect('./login.html?' + purchase_qs);
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


