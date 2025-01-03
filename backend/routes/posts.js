const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  })
  post.save().then((createdPost) => {
  //! The spread operator works directly on Mongoose objects to extract properties.
  // We don't necessarily need to call `createdPost.toObject()` unless we want to 
  // convert the Mongoose object into a plain JavaScript object.
    res.status(201).json({
      message: "Post added Successfully",
      post: {
        ...createdPost.toObject(), // Explicitly convert to a plain object
        id: createdPost._id,
      },
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