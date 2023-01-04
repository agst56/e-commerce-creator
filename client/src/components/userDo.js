import React from 'react';
import axios from 'axios';

class CreateProduct extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            product: '',
            category: '',
            brand: '',
            description: '',
            img: '',
            price: '',
            imgtoshow: '',
            options_brands: '',
            options_categories: '',
            continue: false,
            newOptions: [],
            creating: false
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.putImage = this.putImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.continueCreation= this.continueCreation.bind(this);
        this.newCatgBrand = this.newCatgBrand.bind(this);
    }
    handleChange(feature, event){
        
        const target = event.target;
        this.setState({
            [feature]: target.value
        })
    }
    handleSubmit(event){
        const item = {
            name: this.state.product,
            category: this.state.category,
            brand: this.state.brand,
            description: this.state.description,
            img: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png',
            price: Number(this.state.price),
        };
        
        const send = {
            product: item}
        const information = this.state.img ? this.state.img : new FormData();
        information.append("document", JSON.stringify(send));
        this.setState({creation: true});
        axios.post(`/api/commerce/?commerce_id=${this.props.UniqueId}`, information)
        .then((res)=>{
            this.props.actualiceData(res.data.commerce);
        }).catch(err=>{
            this.setState({creation:false});
            alert("Creation went wrong")
    })
        }
    putImage(event){
        const src = URL.createObjectURL(event.target.files[0]); 
        const img = new FormData();
        const fieldname = this.props.UniqueId==="localstorage" ? 'demo':'image-file';
        img.append(fieldname, event.target.files[0], event.target.files[0].name);
        
        this.setState({img: img, imgtoshow:src});
    }        

    removeImage(){
        this.setState({imgtoshow: '', img: ''});
    }
    

    componentDidMount(){
        let categories = this.props.catgs;
        let brands = this.props.brands;
        const options_categories = categories.map((catg,index)=>{
            return <option value={catg} key={index}>{catg}</option>
        });
        let options_brands = brands.map((brand, index)=>{
            return <option value={brand} key={index} >{brand}</option>
        });

        this.setState({
            options_categories: options_categories,
            options_brands: options_brands
        }) 
        
    }

    continueCreation(){
        const please_catg = document.getElementsByClassName("please")[0];
        const please_brand = document.getElementsByClassName("please")[1];

        let newOptions = [];
        let willcontinue = true;

        if (!this.state.category){
            please_catg.style.display = "block";
            willcontinue = false;
        }
        else if (this.state.category === "new"){
            newOptions.push('category');
            willcontinue = true;
            this.setState({category:""})
        };

        if (!this.state.brand){
            please_brand.style.display = "block";
            willcontinue=false;
        }
        else if (this.state.brand === 'new'){
            willcontinue = true;
            newOptions.push('brand');
            this.setState({brand:""});
        };
        if (newOptions.length>0){
            willcontinue=false;
        }
        this.setState({continue: willcontinue, newOptions: newOptions});
    }

    newCatgBrand(will){
        let newOptions = [];
        for (let i=0; i<will.length; i++){
            newOptions.push(<input key={i} className={`options_${will[i]}`} onChange={this.handleChange.bind(this, will[i])}
            type="text" value={this.state[will[i]]} placeholder={`The new ${will[i]} is...`}/>)
        }
        return newOptions;
    }

    

    render() {
        if (this.state.creation){
            return <h3>Creating...</h3>
        }
        if(this.state.continue && this.state.category && this.state.brand){

            return (
                <div className="form-create-product">
                    <div className="inside-form">
    
                        <input className="title-create-product input-create"type="text" value={this.state.product} onChange={this.handleChange.bind(this, 'product')}
                        placeholder="Title"/>
    
                        <div className="box-image-create"> 
    
                            {this.state.imgtoshow ? <img className="image_selected" src={this.state.imgtoshow} alt="It should be here"/>:
                            
                            <div className="cross">
                                <input className="selectImage-create-product input-create" type="file" value = {this.state.imgtoshow} onChange={this.putImage}
                                placeholder="" accept=".jpg, .jpeg, .png"/> 
                                <div className="cross-vertical">
                                </div>
                                <div className="cross-horizontal"></div>
                            </div>
                            }
    
                        
                        </div>
                        {!this.state.img?'':<button className="removeImg redButton" onClick={this.removeImage}>Remove</button>}
    
                        <input className="price-create-product input-create" type="number" value={this.state.price} onChange={this.handleChange.bind(this, 'price')}
                        placeholder="price"/>
    
                        {/* <input className="input-create" type="text" value={this.state.brand} onChange={this.handleChange.bind(this, 'brand')}
                        placeholder="brand"/> */}
            
                        <textarea className="description-create-product input-create" value={this.state.description} onChange={this.handleChange.bind(this, 'description')}
                        placeholder="description"/>
    
                        <button className= "saveChange_button greenButton" onClick={this.handleSubmit}>Create</button>
                        <button className = "cancelChange_button redButton" onClick={()=> window.location.assign("/")}>Cancel</button>
    
                    </div>
                </div>
            )
        }
        else{
            if (!this.state.newOptions.length){
                
                return(
                    <div className="catg_brand">
                        <p>Category:</p>
                        <select className="options_category" onChange={this.handleChange.bind(this, 'category')} defaultValue={'DEFAULT'}>
                            <option value="DEFAULT" disabled>Select category</option>
                            {this.state.options_categories}
                            <option value="new">New Category</option>
                        </select>
                       <span className="please">Please, select a category</span>
                        <p>Brand:</p>
                        <select className="options_brand" onChange={this.handleChange.bind(this, 'brand')} defaultValue={'DEFAULT'}>
                            <option value="DEFAULT" disabled>Select brand</option>
                            {this.state.options_brands}
                            <option value="new">New brand</option>
                        </select>
                       <span className="please">Please, select a brand</span>
                        <button className="cancel_catg redButton" onClick={()=> window.location.assign('/')}>Cancel</button>
                        <button className="continue_creation" onClick={this.continueCreation}>Continue</button>
                    </div>
                )
            }

            else{
                return (
                    <div className="catg_brand">
                        {this.newCatgBrand(this.state.newOptions)}
                        <button className="cancel_catg redButton" onClick={()=> window.location.assign('/')}>Cancel</button>
                        <button className="continue_creation" onClick={this.continueCreation}>Continue</button>
                    </div>
                )
            }
        }
    }
}



const DeleteProduct = (commerce_id, prd_id, actualiceData, data) => {
    if (commerce_id === "localstorage"){
        data.splice(prd_id, 1);
        actualiceData(data);
        return;
    }
    axios.delete(`/api/commerce/product/?commerce_id=${commerce_id}&prd_id=${prd_id}`)
    .then(res=>{
        actualiceData(res.data.commerce);
    })
    .catch(err=>console.log(err));
}

export {
    CreateProduct,
    DeleteProduct
}

