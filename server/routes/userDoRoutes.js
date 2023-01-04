const express = require('express')
const router = express.Router();
const multer = require('multer');
const {getDocCommerce, getCommerceData, createProduct, editProduct, 
    deleteProduct, deleteCatg, deleteBrand, getSingleProduct, uploadImage} = require('../modules/userDo');
router.route('/product').get(getSingleProduct).put(multer().any(),uploadImage, getDocCommerce, editProduct).delete(getDocCommerce, deleteProduct);
router.route('/:commerce_id').get(getCommerceData);
router.route('/demoProducts').post(getDocCommerce, createProduct);
router.route('/').post(multer().any(),uploadImage ,getDocCommerce, createProduct);
router.route('/:catgName').delete(getDocCommerce, deleteCatg);
router.route('/:brandName').delete(getDocCommerce, deleteBrand);

module.exports = router;