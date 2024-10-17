const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    doctorName: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    billImage: { type: String },  // Path to the uploaded image
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Service', ServiceSchema);