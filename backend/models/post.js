const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "I have set default!!!" },
})

module.exports = mongoose.model('Post', postSchema);