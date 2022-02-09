// Initial Code
var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql')
var app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const { Http2ServerRequest } = require('http2');
const { get } = require('http');
const { waitForDebugger } = require('inspector');
const e = require('express');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",saveUninitialized:true, resave: false}));


app.use(express.static(path.join(__dirname, '/public')));
// Initial Code end

// Database Start
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project_portfolio'
});

db.connect((err)=>{
 
    console.log("Connected to db")
})
// Database End

//Routing
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
                res.redirect("/user_homepage")
            }
        })
      

    }
   
});
app.get("/user_homepage",(req,res)=>{
    if(req.session.userid!=null){
        var session=req.session
        const sql= `SELECT * FROM projects`
        db.query(sql,(err,results)=>{
            if (err) throw err;
        
            if (results.length!=0){
                res.render("user_homepage",{user_data:session,projects:results})
 
            }else{
                res.render("user_homepage",{user_data:session,projects:null})
            }
        })
    }else{
        res.redirect("/")
    }


   
});


app.all("/addproject",(req,res)=>{
    if(req.session.userid!=null){
        if(req.method=="POST"){
        var params=req.body;
       
        console.log(params)
        const sql="INSERT INTO projects SET ?";
        
        db.query(sql,params,(err1,results1)=>{
            if (err1) throw err1;
           res.redirect("/user_homepage")
          
        })
                
                //run code
        }else{
            var session=req.session
            res.render("addproject",{user_data:session})
        }

    }else{
        res.redirect("/")
    }
});
app.get("/signout",(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

app.get("/projects",(req,res)=>{
    
        const sql= `SELECT * FROM projects`;
        var session=req.session;
      
        db.query(sql,(err,results)=>{
            if (err) throw err;
            if(results.length==0){
                results=null
            }
            if(req.session.userid!=null){  
                res.render("projects_page",{user_data:session,data:results})
             }else{ 
                res.render("projects_page",{user_data:null,data:results})
             }
        })

        
   
});
app.get("/main",(req,res)=>{
    if(req.session.userid!=null){
        res.render("landing",{user_data:req.session});
    }else{
        res.render("landing");
    }
    
});
app.get("/deleteproject/:id",(req,res)=>{
    if(req.session.userid!=null){
    id_params=req.params.id;

    const sql=`DELETE FROM projects WHERE id='${id_params}'`;
        db.query(sql,(err1,results1)=>{
            console.log(sql)
            if (err1) throw err1;
           res.redirect("/user_homepage")
          
        })
    }else{
        res.redirect("/user_homepage");
    }
   
});
app.all("/editproject/:id",(req,res)=>{
    if(req.session.userid!=null){
        var session= req.session;
    if(req.method=="POST"){
        var form_params=req.body;
        var id_param=req.params.id;
        console.log(require('util').inspect(form_params, {showHidden: false, depth: null}))
        const sql=`UPDATE projects SET project_name='${form_params.project_name}',project_description='${form_params.project_description}',project_status='${form_params.project_status}',project_progress='${form_params.project_progress}',project_dp='${form_params.project_dp}',project_link='${form_params.project_link}',project_date=NOW() WHERE id= '${id_param}'`;
        db.query(sql,(err1,results1)=>{
            console.log(sql)
            if (err1) throw err1;
           res.redirect("/user_homepage")
          
        })
        
    }else{
        var id_param=req.params.id;
        const sql=`SELECT * FROM projects WHERE id= '${id_param}'`;
        db.query(sql,(err1,results1)=>{
            console.log(sql)
            if (err1) throw err1;
           res.render("editproject",{user_data:session,projects:results1})
          
        })
        
        
        
    }
}else{
    res.redirect("/")
}
   
});
app.get("/",(req,res)=>{
    res.redirect("/main")
});


//Routing End

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));