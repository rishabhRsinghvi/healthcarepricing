const express = require('express');
const { getAllServices, addService, upvoteService, downvoteService } = require('../controllers/serviceController');
const multer = require('multer');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');  // Set the uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);  // Set a unique filename
    }
});

const upload = multer({ storage: storage }).single('billImage');

// Modify the addService route to handle file uploads
router.get('/', getAllServices);
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading image' });
        }
        addService(req, res);  // Call the controller's addService function after successful upload
    });
});
router.post('/:id/upvote', upvoteService);
router.post('/:id/downvote', downvoteService);

module.exports = router;