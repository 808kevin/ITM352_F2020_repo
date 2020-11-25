var express = require('express');
var app = express();
var myParser = require("body-parser");

var cookieParser = require('cookie-parser');
app.use(cookieParser());

const fs = require('fs');
const { static } = require('express');
const user_data_filename = 'user_data.json';

// check if file exists before reading
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`)

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    user_reg_data = JSON.parse(data);

}


// console.log(user_reg_data, typeof user_reg_data, typeof data);
// console.log(user_reg_data['dport']['password'], typeof user_reg_data['dport']['password']);

// output login form
app.use(myParser.urlencoded({ extended: true }));

app.get("/set_cookie", function (request, response) {
response.cookie('myname', 'Dan');
response.send('cookie sent!');
});

app.get("/use_cookie", function (request, response) {
    console.log(request.cookies);
    if(typeof request.cookies["myname"] != 'undefined')
    response.send('Welcome to the Use Cookie Page <your name>');
    //('myname', 'Dan')
    });


app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="process_register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/process_register", function (request, response) {
    // process a simple register form
    // response.send(request.body);
    // assignment2 needs validation
    // if all daata is valud, write ot the user_data_filename and send to invoice
    
    // add example new user reg info
    username = request.body.username;
    user_reg_data[username] = {};
    user_reg_data[username].password = request.body.password;
    user_reg_data[username].email = request.body.email;
    
    // write updated object to user_data_filename :: needed for assignment2
    reg_info_str = JSON.stringify(user_reg_data);
    fs.writeFileSync(user_data_filename, reg_info_str);

    if (request.body.password == request.body.repeat_password) {
        response.send(`Thank you for registering`)
    }
    
});


app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // checks if the user exists; if they exist, get the password
    if (typeof user_reg_data[request.body['username']] != 'undefined') {
        userdata = user_reg_data[request.body['username']];
        console.log(userdata)
        if (request.body['password'] == userdata.password) {
            response.send(`thank you for ${request.body['username']} for loggin in`);
        } else {
            response.send(` ${request.body['username']} password is incorrect.`);
        }
    } else {
        response.send(` ${request.body['username']} does not exist.`);
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));
    