import React from "react";

class ToDoProduct extends React.Component{
    constructor(props){
        super(props);
        console.log("hi");
        if (props.product){
            this.state = {
                product: props.product.product,
                category: props.product.category,
                brand: props.product.brand,
                description: props.product.description,
                img: '',
                price: props.product.img
            }
        }
        else{
            this.state = {
                product: '',
                category: '',
                brand: '',
                description: '',
                img: '',
                price: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.putImage = this.putImage.bind(this);
    }
    handleChange(feature, event){
        
        const target = event.target;
        this.setState({
            [feature]: target.value
        })
    }
    handleSubmit(event){
        const item = this.state;
        
        const send = {
            UniqueId: this.props.UniqueId,
            item: item}
        fetch("/api/categories/products/create", {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(send),
        }).then(()=>{
            console.log('new item has been created');
            this.props.fetchData();
        })
        }
    putImage(event){
        alert("pasa");
        const image = document.getElementsByClassName('image_selected')[0];
        const cross = document.getElementsByClassName("cross")[0];
        image.src = URL.createObjectURL(event.target.files[0]);
        cross.style.display = 'none';
        image.style.display = 'block';
    }        
    render() {
        return (
            <div className="form-create-product">
                <div className="inside-form">

                    <input className="title-create-product input-create"type="text" value={this.state.product} onChange={this.handleChange.bind(this, 'product')}
                    placeholder="Title"/>

                    <div className="box-image-create"> 
                        <div className="cross">
                            <input className="selectImage-create-product input-create" type="file" value = {this.state.img} onChange={this.putImage}
                            placeholder=""/> 
                            <div className="cross-vertical">
                            </div>
                            <div className="cross-horizontal"></div>
                        </div>
                    
                        <img className="image_selected"/>
                    </div>

                    <input className="price-create-product input-create" type="number" value={this.state.price} onChange={this.handleChange.bind(this, 'price')}
                    placeholder="price"/>

                    {/* <input className="input-create" type="text" value={this.state.brand} onChange={this.handleChange.bind(this, 'brand')}
                    placeholder="brand"/> */}
        
                    <input className="description-create-product input-create" type="textarea" value={this.state.description} onChange={this.handleChange.bind(this, 'description')}
                    placeholder="description"/>

                    <button onClick={this.handleSubmit}>Create</button>


                </div>
            </div>
        )
    }
}

export default ToDoProduct;