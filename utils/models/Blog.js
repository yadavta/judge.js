const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  postTitle: { type: String, required: true},
  postContent: { type: String, required: true },
  postImage: { type: String, required: true },
  postImageAlt: { type: String, required: true },
  postAuthorId: {type: String},
  postAuthorName: {type: String},
  postDate: { type: String, required: true, default: new Date().toISOString()}
});

module.exports = mongoose.model('Blog', blogSchema)