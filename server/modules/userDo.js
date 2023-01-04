const mongoose = require('mongoose');
const asyncWrapper = require('../middleware/async');
const CustomError = require('../errors/customError');
const Commerce = require('../models/commerce');
const ObjectId =  mongoose.Types.ObjectId;
const { google } = require('googleapis');
const stream = require('stream');

const getDocCommerce = asyncWrapper(async(req, res, next)=>{
    const {commerce_id} = req.query;
    
    const docCommerce = await Commerce.findOne({_id: ObjectId(commerce_id)});
    
    if (docCommerce === null)return next(new CustomError("The commerce doesn't exist", 500));
    
    req.body.docCommerce = docCommerce;
    
    next();  
})

const getCommerceData = asyncWrapper(async(req, res, next)=>{
    const {commerce_id} = req.params;
    console.log('getCommerceData wtf');
    Commerce.findOne({_id: ObjectId(commerce_id)}, (err, commerce)=>{
        if (err) return next(new CustomError("The commerccec doesn't exist", 500));
        console.log(commerce);
        res.status(200).json(commerce);
    });
    

})


const getSingleProduct = asyncWrapper(async(req,res,next)=>{
    const {commerce_id, prd_id} = req.query;
    console.log("commerce_id: "+commerce_id);
    console.log("prd_id: "+prd_id);
    Commerce.findOne({_id: ObjectId(commerce_id)}, (err,commerce)=>{
        if (err) return next(new CustomError("The commerce doesn't exist", 500));
        console.log("Inside findOne getSingelPRoduct");
        const prd = commerce.products.id( ObjectId(prd_id));
        console.log(prd);
        if (prd) return res.status(201).json(prd)
        else return next(new CustomError("The product doesn't exist", 500));
    })
})


const createProduct = asyncWrapper(async(req, res, next)=>{
    const {product, docCommerce} = req.body;
    console.log(req.body);
    
    let existCatg = false;
    let existBrand = false;
   
    const categories = docCommerce.categories;
    const brands = docCommerce.brands
    for (let i=0;i<categories.length;i++){
        if (categories[i] === product.category) {existCatg = true
            break;}
    }
    for (let i=0;i<brands.length; i++){
        if (brands[i] === product.brand) {existBrand = true 
            break;}
    }
    docCommerce.products.push(product);
    if (!existCatg)docCommerce.categories.push(product.category);
    if (!existBrand)docCommerce.brands.push(product.brand);
    docCommerce.save((err)=>{
        if(err) return console.log(err);
        else{
            console.log("success doccc");
            return res.json({commerce: docCommerce});
        }
    });
  
})

 
const editProduct = asyncWrapper(async (req, res, next)=>{
    const {docCommerce, product} = req.body;
    const {prd_id} = req.query;
   console.log("editProduct");
    const product_doc = docCommerce.products.id(ObjectId(prd_id));    
    for (const field in product){
        if (field in product_doc){
            if (product_doc[field] !== product[field]) product_doc[field] = product[field];
        }
        else{
            console.log(field);
            return  next(new CustomError('Non-existing field of the product', 500));
        }
    }
    docCommerce.save((err)=>{
        if(err) return next(new CustomError('Error on trying to save the changes', 500));
        else{
            return res.status(200).json({commerce:docCommerce});
        }
    }); 
    
})

const deleteProduct = asyncWrapper(async (req,res,next) => {
    const {docCommerce} = req.body;
    console.log("passing deleteProduct");
    const {prd_id} = req.query;
    docCommerce.products.id(Object(prd_id)).remove((err)=>{
        if (err) return next(new CustomError('Error on trying to delete the product', 500));
        else return res.status(200).json({commerce:docCommerce});
    });

})

const deleteCatg = asyncWrapper(async(req,res,next)=>{
    const {docCommerce} = req.body;
    const {catgName} = req.params;
    docCommerce.categories = docCommerce.categories.filter(catg=>catg!==catgName);
    docCommerce.save((err)=>{
        if (err)return next(new CustomError("Error on trying to delete the category"));
        res.sendStatus(200);
    })

})

const deleteBrand = asyncWrapper(async(req,res,next)=>{
    const {docCommerce} = req.body;
    const {brandName} = req.params;
    docCommerce.brands = docCommerce.brands.filter(brand=>brand!==brandName);
    docCommerce.save((err)=>{
        if (err)return next(new CustomError("Error on trying to delete the brand"));
        res.sendStatus(200);
    })

})
const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: 'v3' }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ['DRIVE_FOLDER_ID'],
      },
      fields: 'id,name',
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
  };
const uploadImage = asyncWrapper(async(req,res,next)=>{
    const {files} = req;
    hold = req.body.document;
    body = JSON.parse(hold);
    console.log(req.body);
    console.log(body);
    console.log(files);
    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    const credentials = {
        "type": process.env.type,
        "project_id": process.env.project_id,
        "private_key_id": process.env.private_key_id,
        "private_key": `-----BEGIN PRIVATE KEY-----${process.env.private_key.replace(/\\n/g, '\n')}-----END PRIVATE KEY-----\n`,
        "client_email": process.env.client_email,
        "client_id": process.env.client_id,
        "auth_uri": process.env.auth_uri,
        "token_uri": process.env.token_uri,
        "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.client_x509_cert_url
      };
    const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES,
      });
    if(files.length>0){
        const fileObject = files[0];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);
        const folderId = process.env.folderId;
        console.log("before cos bufferstream")
        console.log(bufferStream);
        const { data } = await google.drive({ version: 'v3', auth }).files.create({
            media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
            },
            requestBody: {
            name: fileObject.originalname,
            parents: [folderId],
            },
            fields: 'id,name',
        });
        body.product.img = `https://drive.google.com/uc?id=${data.id}`;
        
    }
    req.body = body;
    next()
})

module.exports = {getDocCommerce, getCommerceData, createProduct, getSingleProduct, 
    editProduct, deleteProduct, deleteCatg, deleteBrand, uploadImage};


