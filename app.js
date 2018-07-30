var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var methodOverride=require('method-override');
var expressSanitizer = require('express-sanitizer');
var Blog=require('./models/blog');
var Comment= require('./models/comment');
var seedDB= require('./seeds');
var passport=require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var commentRoutes = require('./routes/comments');
var blogRoutes = require('./routes/blogs');
var authenticationRoutes = require('./routes/authentication');
var flash = require('connect-flash');


const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/yelp_camp");

//seedDB(); //seed database

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret:"Football is the beautiful game",
	resave:false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);
app.use(authenticationRoutes);

app.get("/",function(req,res){
	res.render("landing");
})



app.listen(port, function(){
	console.log('Server Started');
})