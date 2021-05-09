/*
 * Copyright (C) 2021 Tanush Yadav <tanushyadav@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 * 
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