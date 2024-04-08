const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    picture:String,
    caption: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
      ]
  });
  
module.exports = mongoose.model('tweet', tweetSchema);

