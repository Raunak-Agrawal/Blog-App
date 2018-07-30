var express = require('express');
var router = express.Router();
var Blog=require('../models/blog');
var middleware = require('../middleware');
//RESTful Routes

//Index Route
router.get("/",function(req,res){
	Blog.find({},function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("blogs/index",{blogs:blogs});
		}
	});
});

//New Route

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
});

//create route

router.post("/",middleware.isLoggedIn,function(req,res){
	//req.body.blog.body = req.sanitize(req.body.blog.body);
	var title = req.body.title;
	var price = req.body.price;
	var image = req.body.image;
	var body = req.body.body;
	var author ={
		id:req.user._id,
		username:req.user.username
	}



	var tempBlog = {title:title,price:price,image:image,body:body,author:author};
	

	Blog.create(tempBlog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//show route
router.get("/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			console.log(foundBlog);
			res.render("blogs/show",{blog:foundBlog});
		}
	});
	
});

//Edit Route

router.get("/:id/edit",middleware.checkBlogOwnership,function(req,res){
	
		Blog.findById(req.params.id,function(err,foundBlog){
			res.render("blogs/edit",{blog:foundBlog});
		});
});

//Update route

router.put("/:id",middleware.checkBlogOwnership,function(req,res){
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

router.delete("/:id",middleware.checkBlogOwnership,function(req,res){

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

//middleware


module.exports= router;
