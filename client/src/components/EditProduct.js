import React from "react";
import axios from "axios";

class EditProduct extends React.Component{
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            _id : params.get('prd_id'),
            name: '',
            category: '',
            brand: '',
            description: '',
            imgtoshow: '',
            img: '',
            price: '',
            editing: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.putImage = this.putImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.cancelChange = this.cancelChange.bind(this);
    }

    componentDidMount(){
        
        if (this.state.name!=='')return;
        axios.get(`/api/commerce/product/?commerce_id=${this.props.commerce_id}&prd_id=${this.state._id}`)
        .then(res=>{
            const prd = res.data;
            this.setState({
                name: prd.name,
                category: prd.category,
                brand: prd.brand,
                imgtoshow: prd.img,
                img: '',
                description: prd.description,
                price: prd.price
            });
        })
        .catch(err=>{console.log(err.msg)});
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
            img: this.state.imgtoshow,
            price: this.state.price,
        };
        
        const send = {
            product: item}
        const information = this.state.img ? this.state.img : new FormData();
        information.append("document", JSON.stringify(send));

        this.setState({editing: true});
        axios.put(`/api/commerce/product/?commerce_id=${this.props.commerce_id}&prd_id=${this.state._id}`, information)
        .then(res=>{
            this.props.actualiceData(res.data.commerce);
        })
        .catch(err=>{
            this.setState({editing: false})
            console.log(err.msg)
        });
        }
        putImage(event){
            const src = URL.createObjectURL(event.target.files[0]);
            const img = new FormData();
            img.append("image-file", event.target.files[0], event.target.files[0].name);
        
            this.setState({img: img, imgtoshow:src});
            
            
        }     
        
        removeImage(event){
            this.setState({imgtoshow: '', img: ''});
        }

        cancelChange(){
            window.location.assign("/");
        }

    render(){
        
        if (this.state.editing){
            return <h3>Editing...</h3>
        }

        return (
            <>
            <div className="form-create-product">
                <div className="inside-form">

                    <input className="title-create-product input-create"type="text" value={this.state.name} onChange={this.handleChange.bind(this, 'product')}
                    placeholder="Title"/>

                    <div className="box-image-create"> 
                        {this.state.imgtoshow ? <img className="image_selected" src={this.state.imgtoshow} alt="Should be appearing the product"/>:                         
                        <div className="cross">
                            <input className="selectImage-create-product input-create" type="file" value = {this.state.imgtoshow} onChange={this.putImage}
                            placeholder="" accept=".jpg, .jpeg, .png"/> 
                            <div className="cross-vertical">
                            </div>
                            <div className="cross-horizontal"></div>
                        </div>
                        }
                    
                        
                    </div>
                    {!this.state.imgtoshow ? '': <button className="removeImg redButton" onClick={this.removeImage}>Remove</button>}

                    <input className="price-create-product input-create" type="text" value={this.state.price} onChange={this.handleChange.bind(this, 'price')}
                    placeholder="price"/>
        
                    <textarea className="description-create-product input-create" value={this.state.description} onChange={this.handleChange.bind(this, 'description')}
                    placeholder="description"/>

                    <button className= "saveChange_button greenButton" onClick={this.handleSubmit}>Save Changes</button>
                    <button className = "cancelChange_button redButton" onClick={this.cancelChange}>Cancel</button>

                </div>
            </div>

            </>
        )
    }
}

export default EditProduct;