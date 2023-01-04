import React from 'react';

import AppHeader from './AppHeader';
import { DeleteProduct } from './userDo';


// eslint-disable-next-line no-unused-vars
class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            products : this.props.products,
            search: false
        };
        this.putProducts = this.putProducts.bind(this);
        this.noProducts = this.noProducts.bind(this);
        this.createFirst = this.createFirst.bind(this);
        this.showOptions_forProduct = this.showOptions_forProduct.bind(this);
        this.leaveOptions_forProduct = this.leaveOptions_forProduct.bind(this);
        this.searchFunc = this.searchFunc.bind(this);
        this.createOptions_forFilter = this.createOptions_forFilter.bind(this);
        this.filterFunc = this.filterFunc.bind(this);
        this.show_Permission_forDelete = this.show_Permission_forDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }


    showOptions_forProduct(index, event){
        const show = document.getElementsByClassName("options_forProduct")[index];
        show.style.display = "flex";
    }

    leaveOptions_forProduct(index, event){
        const none = document.getElementsByClassName("options_forProduct")[index];
        none.style.display = 'none';
    }

    show_Permission_forDelete(index, event){
        const show = document.getElementsByClassName("permission_for_delete")[index];
        show.style.display = "block";
    }

    cancelDelete(index, event){
        const cancel = document.getElementsByClassName("permission_for_delete")[index];
        cancel.style.display = "none";
    }

    putProducts(products){
       
        let items = products.map((product, index) => {
            let productId = product._id;
            let ahref = "/product/" + String(productId);
            return (
            <div className="div_product" onMouseLeave={this.leaveOptions_forProduct.bind(this,index)} key={index}>
            <a href={ahref} className='product'>
                <div className="divimage_in_box">
                    
                    <img src={product.img} alt="it should be showing" className="imagesProducts"></img>
                    <h3>${product.price}</h3>
                
                </div>
                <div className="divtext_in_box">
                    <h3>{product.name}</h3>
                </div>
            </a>
                    <div className="three-points" onClick={this.showOptions_forProduct.bind(this, index)}>
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                        
                    </div>

                    <div className="options_forProduct">
                        <button className="buttons_options_product"><a href={`product/edit/?prd_id=${product._id}`}>Edit</a></button>
                        <button className="buttons_options_product" 
                        onClick={this.show_Permission_forDelete.bind(this, index)}>Delete</button>
                    </div>
                    <div className="permission_for_delete">
                        <span className="text_permission">Are you sure you want to delete it?</span>
                        <button className="cancelDelete" onClick={this.cancelDelete.bind(this, index)}>Cancel</button>
                        <button onClick={()=>DeleteProduct(this.props.UniqueId, product._id, this.props.actualiceData, this.props.products)}>Yes</button>
                    </div>
            </div>
            )
        })  
        return items;
    }

    createFirst(){
        window.location.assign('/product/create');
    }

    noProducts(){
       
        return (
            
            <div className="div_no_products">
                <h3 className="title_no_products">There's no item yet</h3>
                <button className="add_no_products" onClick={this.createFirst}>
                    <div className="cross-no-products">
                        <div className="cross-vertical"></div>
                        <div className="cross-horizontal"></div>
                    </div>
                </button>
                <p className="descr_add">Add one</p>
            </div>
            
        )
    }

    searchFunc(value){
        if (!value){
            return;
        }
        const regex_value = new RegExp(`\\w*${value.toLowerCase()}\\w*`);
        const search_result = this.props.products.filter(product => regex_value.test(product.name.toLowerCase()))
        this.setState({
            products: search_result,
            search: true
        })
    }

    createOptions_forFilter(option){
        const products = this.props.products;
        let options = [];
        for (const i in products){
            if(!(options.includes(products[i][option]) )){
                options.push(products[i][option]);
            }
        }
        return options;
    }

    filterFunc(options){
        let regex_options = [];
        const products = this.state.search ? this.state.products:this.props.products;
        for (const i in options){
            regex_options.push(new RegExp(`\\w*${options[i]}\\w*`));
        }
        

        const products_filtered = products.filter(product => {
            for (const i in regex_options){
                if(regex_options[i].test(product.category)){
                    return true;
                }
                else if(regex_options[i].test(product.brand)){
                    return true;
                }
            }
            return false;
        })

        this.setState({products: products_filtered});
    }
    render(){
        return (
            <>
            {this.props.header ? <AppHeader searchFunc={this.searchFunc}
             categories={this.createOptions_forFilter('category')}
             brands={this.createOptions_forFilter('brand')}
             filterFunc={this.filterFunc}/>:''}
            
            <div className="try">
                <div className="groupProducts">
                    
                    {this.props.products.length ? this.putProducts(this.state.products) : this.noProducts()}
                </div>
            </div>
            </>
        )
    }
}
export default HomePage;