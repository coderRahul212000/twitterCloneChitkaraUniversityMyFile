var express = require('express');
var router = express.Router();
const userModel = require("./users")
const tweetModel = require("./tweet")
const passport = require('passport')
const localStrategy = require("passport-local"); 

passport.use(new localStrategy(userModel.authenticate()));


router.get('/tweets',async function(req, res) {
  // const user = await userModel.findOne({username: req.session.passport.user});
  //ab saare posts layenge pehle
  // const posts = await postModel.find(); //ab sirf users ki id ayi hai data ni toh data laane k liye krna hoga
  const tweets = await tweetModel.find().populate("user"); // jo bhi field ka name hai yahan user tha posts.js mai isliye user kia
  // and remember populate wohi field hoti hai jismai id store krai hai apne
  console.log(tweets)
  res.json({
    message:"your tweets were",
    tweets: tweets,
    // user: user
  })
});

//timeline
router.get('/timeline', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  //ab saare posts layenge pehle
  // const posts = await postModel.find(); //ab sirf users ki id ayi hai data ni toh data laane k liye krna hoga
  const posts = await tweetModel.find().populate("user"); // jo bhi field ka name hai yahan user tha posts.js mai isliye user kia
  // and remember populate wohi field hoti hai jismai id store krai hai apne
  console.log(posts)
  // res.render('feed', {footer: true, posts, user});
  res.json({
    posts
  });
});


//posting post
router.post("/upload", isLoggedIn,async (req,res)=>{
  // upload.single("image")  issai image upload hojayegi ab mai upload hone
  // k baad ka kaam kr ra hu

  //ye line mujhe logged in bnda degi and woh user k andr hai
  const user = await userModel.findOne({username: req.session.passport.user})  
  const tweet = await tweetModel.create({
    // picture: req.file.filename,
    user: user._id, //  ye loggedin user ki id bhej dega 
    //post ko ye pta lg gya ye kiske dwara likha hua hai
    caption: req.body.caption,
    


  })

  //ab data and likes default hai mujhe ni pass krna 
    
    //abhi tk post ko  pta hai user kon hai jisne
    // post kia hai but user ko ni pta ki usnai post kia hai
    // isliye ab woh kaam krenge
   // toh humne usersSchema k posts wale array mai bola hua hai
   // save krne ko user ki id
   // isliye ab ye krenge

   user.posts.push(tweet._id); // user k post array mai is post ki id store krdenge
   await user.save(); // ab hath sai kia hai user mai change toh user.save()
   res.redirect("/timeline");

})



// register
router.post("/register", function(req,res,next){
  const userData = new userModel({
    username : req.body.username,
    name:req.body.name,
    email:req.body.email
  });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      // res.redirect("/profile");
        res.send("you are now registered");
    })
  })
})

//login
router.post("/login", passport.authenticate("local", {
  // successRedirect:"/profile" ,
  // failureRedirect: "/login"
}),function(req,res){
    console.log(req.user);
    res.json({
      message:"Logged in successfully",
      user:req.user
    })
})


// logout
router.get("/logout", function(req,res,next){
  req.logout(function(err){
    if(err) {return next(err);}
    // res.redirect("/");
    res.send("You are now logged out");
  })
})



// protected route
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
}

module.exports = router;
