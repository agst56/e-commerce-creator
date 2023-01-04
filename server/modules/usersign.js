const mongoose = require('mongoose');
const asyncWrapper = require('../middleware/async');
const CustomError = require('../errors/customError');
const {User} = require('../models/user'); 
const Commerce = require('../models/commerce');
const ObjectId =  mongoose.Types.ObjectId;

mongoose.ObjectId.get(v => v.toString());
const demoProducts = require('./demoProducts');
const postDemoProducts = async(docCommerce)=>
{   
    const categories = docCommerce.categories;
    const brands = docCommerce.brands
    for (let i=0;i<demoProducts.length;i++){
        const product = demoProducts[i];
        if (!categories.includes(product.category)){
            categories.push(product.category);
        }
        if (!brands.includes(product.brand)){
            brands.push(product.brand);
        }
        docCommerce.products.push(product);
    }

    docCommerce.save((err)=>{
        if(err) return console.log(err);
        else{
            return true;
        }
    });
    
}

const usersignUp = asyncWrapper(async (req, res, next) =>{
    const {username, commerce_name, password, demoUser} = req.body;
        const exist = await User.findOne({name:username});
        if (!(exist ===null)){
            return new CustomError("That aliasname already exist", 500);
            
        }
        const commerce = await Commerce.create({products:[], categories:[], brands: []});
        if (demoUser === 'demoUser'){
           await postDemoProducts(commerce);
        }

        const user = {
            name: username,
            password: password,
            commerce_name: commerce_name,
            commerce_id: commerce._id
        }

        User.create(user, (err)=>{
            if (err){
                console.log(err);
                return new CustomError('Something went wrong', 500);
                
            }
            res.status(200).json({commerce_id: commerce._id});
        });  
})

 
const usersingIn = asyncWrapper(async (req, res) => {
    const {username, password} = req.body;
    console.log('here');
    const user = await User.findOne({name: username});
    if (user === null){
        return new CustomError("The AliasUser doesn't exist", 500);
    }
    if (user.password === password){
        return res.status(200).json({commerce_id: user.commerce_id});
    }else{

        return new CustomError('Wrong password', 500);
    }
    
 
})

module.exports = {usersignUp, usersingIn};