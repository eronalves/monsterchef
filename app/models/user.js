var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', userSchema);
module.exports = User;



