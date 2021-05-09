/* Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const router = require('express').Router();
const Blog = require('../utils/models/Blog');
var dayjs = require('dayjs');

var xss = require("xss");

//npm imports
const marked = require('marked');
var md = require('markdown-it')();
const DOMPurify = require('dompurify');

router.get('/', (req,res) => {
  res.render('../views/pages/blogGeneric.ejs');
});

router.get('/post/:postId', (req, res) => {

 /* async function addBlog() {
    const newBlog = new Blog({_id: 1, postContent: "testing blogs", postImage: "sample image url"});
    await newBlog.save();
  };

  addBlog();*/

  let requestedPostId = req.params.postId.toString();
  
  async function getBlogInfo() {
   
    Blog.findOne({ _id: requestedPostId }, function (err, result) {
      //check for error
      if (err) {
        console.log(err);
        res.send(500);
      } 
      
      if (result===null) {
        res.send(404);
      } else {
        //console.log(result.postContent);
        let mdPostContent = marked(result.postContent);
        let markeditcontent = md.render(result.postContent);
        
        //console.log(mdPostContent);
        let sanitizedContent = xss(result.mdPostContent);
        let sanitizedTitle = xss(result.postTitle)
        //console.log("sanitized" + sanitizedContent);
        
        let htmlPostImage = "<img src='" + result.postImage + "' alt='" + result.postImageAlt + "'>";

        /*let clientPostInfo = {
          postContent: sanitizedContent,
          postImage: result.postImage,
          postTitle: sanitizedTitle
        }*/
      
        res.render('../views/pages/blog.ejs', {
          postTitle: sanitizedTitle,
          postContent: mdPostContent,
          postImage: htmlPostImage,
          postAuthor: result.postAuthorName,
          postDate: dayjs(result.postDate).format('MMM D, YYYY')
        });
      }     

    });
  }

  getBlogInfo();


});


module.exports = router;