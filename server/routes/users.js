const mongoose = require('mongoose');
const db_link = "mongodb+srv://admin:54irWm7tfuGQtwW9@cluster0.b2kayuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const plm = require("passport-local-mongoose");

mongoose.connect(db_link)
.then(() => console.log("Connected to MongoDB"));

const userSchema = mongoose.Schema({
  username: String,
  name:String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    
  },
  profileImage:String,
  bio:String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  posts:[{type:mongoose.Schema.Types.ObjectId, ref:"post"}]
  
})

userSchema.plugin(plm); 
module.exports = mongoose.model('user', userSchema);
