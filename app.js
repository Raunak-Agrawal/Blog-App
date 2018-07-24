var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var methodOverride=require('method-override');
var expressSanitizer = require('express-sanitizer');
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//RESTful Routes

//Index Route
app.get("/blogs",function(req,res){
	Blog.find({},function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});

//New Route

app.get("/blogs/new",function(req,res){
	res.render("new");
});

//create route

app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
	
});

//Edit Route

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
	
});

//Update route

app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){ //New data to be encoded as second argument
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
	});

//Destroy route

app.delete("/blogs/:id",function(req,res){

	//destroy

	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/");
		}
	});
	//redirect somewhere
	//res.send("Destroy route");
});


app.listen(port, function(){
	console.log('Server Started');
})