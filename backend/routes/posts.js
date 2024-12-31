const express = require('express');
//Todo: Importing Multer package
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

//Todo: We need to tell where the store the files in the Incoming Request = multer.diskStorage({})
const storage = multer.diskStorage({
  //* Two keys: destination, filename
  // Function will execute, whenever it save a files
  destination: (req, file, cb) => {
    //Todo: An extra security layer for checking eventhough we are doing in the FrontEnd
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images"); //Relative to the server.js file (Tells where to store the file)
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    //Todo: Getting the File Type of the file
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

//Todo: Passing it as an extra Middleware, it will work from left-->right
router.post("", multer(storage).single('image'), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  post.save().then((createdPost) => {
    const id = createdPost._id;
    res.status(201).json({
      message: "Post added Successfully",
      postId: id,
    })
  })
})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({
      message: "Updated Successfully!!"
    })
  })
})

router.get("",(req, res, next) => {
  Post.find()
  .then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      Posts: documents,
    });
  })
})

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if(post) {
      res.status(200).json(post);
    } else{
      res.status(404).json({
        message: "Post not found!"
      })
    }
  })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted"
    })
  })

})

module.exports = router;