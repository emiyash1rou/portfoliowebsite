# Portfolio Website
## Instructions
### Connecting to Github
1. Run ```git init``` to your terminal
2. Create a repository in github. A link will be generated for you to push. 
3. Add The Link to the terminal by doing this ```git remote add [name] https://github.com/emiyash1rou/portfoliowebsite.git```
4. Check if the link is there by runnning this command ```git remote -v ```
5. Add a .gitignore file.
6. For the commands of updating github reposity, do this:
``` 
git add .
git commit -m "update"
git push [remote_name] master
```
### Set Up the Express Code
1. Create an app.js file.
2. Initialize npm by running this code ``` npm init -y ```
3. In package.json file. Add this code ```  "start": "nodemon app.js" ``` in scripts section.
4. Install the modules needed for the website ``` npm install express ejs body-parser mysql cookie-parser express-session ```
5. Install nodemon 
``` 
npm install -g nodemon
npm install --save-dev nodemon 

```
6. Add dotenv ``` npm install dotenv --save ```
7. Paste initial code to app.js
```
var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql')
var app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",saveUninitialized:true, resave: false}));


app.use(express.static(path.join(__dirname, '/public')));
```
8. Set up database server. 
```
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tutorial2'
});

db.connect((err)=>{
    if(err) throw err
    console.log("Connected to db")
})
```
9. Add a routing code.
```
app.get("/",(req,res)=>{
    res.render("index");
});

```
10. Add this one to listen to the server. Should be put in the end of the code. ``` app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`)); ```

### Set Up the Xampp Database. Mysql.
1. Go to Xampp > Turn on Apache and Mysql. > Click on the admin button in Mysql.
2. Create a database by clicking new in upper left corner and name your database.

### Set Up your html files. 
1. Create a folder located at the root folder. Name it "views".
2. "views" folder is where you keep html files.
3. Create A header page that is separate in the overall html. Header page will contain the navigation bar.
4. Header.ejs contains this code(the navbar and the bootstrap cdn)
```
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <!-- <a class="navbar-brand" href="/"><img style="max-width: 100px;"  src="./images/logo.png" alt="">Portfolio</a> -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-item nav-link " href="/">Home</a>
        <a class="nav-item nav-link" href="/projects">My Projects</a>
        <a class="nav-item nav-link" href="/signin">Sign In</a>
     
      </div>
    </div>
  </nav>
```
5. Make the other html files include the header page in rendering by using this code ``` <%- include('header') -%> ```
### Routing 
1. To create signin page. Create a html file and put it in views folder. 
2. To create the signin route. Go to app.js and do this code.
```
app.all("/signin",(req,res)=>{
    if(req.method=="GET"){
        res.render("signin",{error:null})

    }else if(req.method=="POST"){

        const params=req.body //access post_request values. 
        console.log("Username:"+params.username+" "+"Password:"+params.password)
        const sql= `SELECT * FROM users WHERE username="${params.username}" and password= "${params.password}"`
        db.query(sql,(err,results)=>{
            if (err) throw err;
            console.log(results)
            if (results.length==0){
                res.render("signin",{error:true})
 
            }else{
                var session=req.session
                session.userid={id:results[0].id}
                console.log("Signed In"+session)
                res.send("Hello you are now signed in")
            }
        })
        res.render("signin",{error:"wrongemail"})

    }
   
});
```
3. Create a table in your database called users.
```
CREATE TABLE `users` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `contactno` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


