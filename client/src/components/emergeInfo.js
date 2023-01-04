import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from 'axios';
const EmergeInfo = (props) => {
    const params = useParams();
    const productId = params.productId;
    const [product, setProduct] = useState({});
    const [charging, setCharging] = useState(false);
    useEffect(()=>{
        console.log("useEffecting");
        setCharging(true);
        axios.get(`/api/commerce/product/?commerce_id=${props.commerce_id}&prd_id=${productId}`)
        .then((res)=>{
            setProduct(res.data);
            setCharging(false);
        }).catch((err)=>{
            console.log(err)
            setCharging(false);
        });
    }, [props.commerce_id, productId]);
    if (JSON.stringify(product)==='{}' && !charging){
        return <p>There is no product</p>
    }
    if (charging){
        return <p>Looking the product</p>
    } 
    
    return (
        <div className="emergeInfo">
            <div className="infoProduct">
                <h1>{product.name}</h1>
                <div className="div_image_emergeInfo"><img className="image_infoProduct" src={product.img} alt="here is the product"/></div>
                
                <h2>${product.price}</h2>
                <p>{product.brand}</p>
                <p> {product.description}</p>

                <button className="close_emergeInfo" onClick={()=>window.location.assign("/")}>Close</button>
            </div>

        </div>
    )
}



export default EmergeInfo;