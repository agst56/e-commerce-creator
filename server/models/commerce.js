const mongoose = require('mongoose');
mongoose.pluralize(function(name) {
    return name;
});

const product = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name must be provided'],
    },
    category: {
        type: String,
        required: [true, 'category of the product must be provided'],
    },
    brand: {
        type: String,
        required: [true, "product's brand must be provided"],
    },
    description: {
        type: String,
        required: [true, "product's description must be provided"],
    },
    img:{
        type: String,
        required: [true, "image of the product must be provided"],
    },
    price:{
        type: Number,
        required: [true, "price is required"]
    }
});

const commerceSchema = new mongoose.Schema({
    products: [product],
    categories: [String],
    brands: [String]
});



module.exports = mongoose.model('Commerces', commerceSchema);
