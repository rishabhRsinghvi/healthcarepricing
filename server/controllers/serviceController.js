const Service = require('../models/Service');
const multer = require('multer');

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

// Get all services with optional filters
exports.getAllServices = async (req, res) => {
    const query = req.query.query || '';
    const location = req.query.location || '';
    const price = req.query.price || '';

    const services = await Service.find({
        name: { $regex: query, $options: 'i' },
        location: { $regex: location, $options: 'i' },
        price: { $lte: price || 9999999 },
    });
    res.json(services);
};

// Add healthcare service with file upload handling
exports.addService = (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error uploading image' });
        }

        try {
            const { name, doctorName, price, location } = req.body;
            const billImage = req.file ? `/uploads/${req.file.filename}` : null;  // Store the file path

            const newService = new Service({
                name,
                doctorName,
                price,
                location,
                billImage
            });

            await newService.save();
            res.status(201).json({ message: 'Service added successfully', service: newService });
        } catch (error) {
            res.status(500).json({ message: 'Error adding service', error });
        }
    });
};

// Upvote a healthcare service
exports.upvoteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        service.upvotes += 1;
        await service.save();
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting service', error });
    }
};

// Downvote a healthcare service
exports.downvoteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        service.downvotes += 1;
        await service.save();
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error downvoting service', error });
    }
};