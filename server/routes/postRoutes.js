const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const path = require('path');

router.post('/', async (req, res) => {
    const { title, content, authorId } = req.body;
    let imageUrl = '';

    if (req.files && req.files.image) {
        const image = req.files.image;
        const uploadPath = path.join(__dirname, '../uploads/images', `${Date.now()}_${image.name}`);
        await image.mv(uploadPath);
        imageUrl = `/uploads/images/${Date.now()}_${image.name}`;
    }

    try {
        const newPost = new Post({ title, content, authorId, imageUrl });
        await newPost.save();
        res.status(201).json({ message: 'Post created', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Post creation failed', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('authorId');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
});

module.exports = router;