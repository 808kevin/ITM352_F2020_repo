var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require('fs');
const user_data_filename = 'user_data.json';

// check if file exists before reading 
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`)

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
    // if user exists, get their password
    if (typeof users_reg_data['itm352'] != 'undefined') {
        console.log(users_reg_data['itm352']['password'] == 'xxx');
    }
} else {
    console.log(`ERR: ${user_data_filename} does not exist!!!`)
};

app.use(myParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<h1>Login</h1>
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
        //if user exits, get their password
        if(typeof users_reg_data[request.body.username] != 'undefined'){
            if(request.body.password == users_reg_data[request.body.username].password){
                response.send(`Thank you ${request.body.username} for logging in.`);
            } else {
                response.send(`Hey! ${request.body.username} does not match what we have for you!`);
            }
        } else {
            response.send(`Hey! ${request.body.username} does not exist!`);
        }
    });
        app.listen(8080, () => console.log(`listening on port 8080`));

    