const mongoose = require('mongoose');

const partAdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Başlıq daxil edilməlidir'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Marka daxil edilməlidir'],
        index: true
    },
    model: {
        type: String,
        required: [true, 'Model daxil edilməlidir'],
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Qiymət daxil edilməlidir']
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        default: 'used'
    },
    category: {
        type: String,
        required: [true, 'Kateqoriya daxil edilməlidir'],
        enum: ['parts', 'accessories', 'tires', 'oils', 'equipment']
    },
    description: {
        type: String,
        trim: true
    },
    imageURLs: [{
        type: String // We will store multiple images for the new multi-part upload feature
    }],
    phone: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Search index for marking and modeling
partAdSchema.index({ brand: 'text', model: 'text', title: 'text' });

const PartAd = mongoose.model('PartAd', partAdSchema);

module.exports = PartAd;
