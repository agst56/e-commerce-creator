import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import './App.css';
import {CreateProduct} from './components/userDo.js';
import EditProduct from './components/EditProduct.js';
import EmergeInfo from './components/emergeInfo.js';
import {UserSignIn, UserSignUp} from './components/UserSign';
import axios from 'axios';
import createDemoUser from './components/Demo.js';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      UniqueId: '',
      data: '',
      error: null,
      isLoaded: false,
      showDefault: false
      
    };
    this.fetchData = this.fetchData.bind(this);
    this.didsign = this.didsign.bind(this)
    this.logOut = this.logOut.bind(this);
    this.actualiceData = this.actualiceData.bind(this);

  }

  
  fetchData(){
    axios.get(`/api/commerce/${this.state.UniqueId}`)
    .then(res=>{
        const data = res.data;
        window.localStorage.setItem("UniqueId", this.state.UniqueId);
        window.localStorage.setItem("products", JSON.stringify(data.products));
        window.localStorage.setItem("catgs", JSON.stringify(data.categories));
        window.localStorage.setItem("brands", JSON.stringify(data.brands));
        window.location.assign('/');
    })
    .catch(err=>{
      
      
    })
  }

  actualiceData(newData){
    window.localStorage.setItem("products", JSON.stringify(newData.products));
    window.localStorage.setItem("catgs", JSON.stringify(newData.categories));
    window.localStorage.setItem("brands", JSON.stringify(newData.brands));
    window.location.assign('/');
  }

  didsign(UniqueId){
    this.setState({
      UniqueId: UniqueId
    })
    this.fetchData();
  }

  componentDidMount() {
      const UniqueId = window.localStorage.getItem("UniqueId");
      const products = window.localStorage.getItem("products");
      
      if (!(products==="undefined")){
        const catgs = JSON.parse(window.localStorage.getItem("catgs"));
        const brands = JSON.parse(window.localStorage.getItem("brands"));
        this.setState({
          UniqueId: UniqueId,
          products: JSON.parse(products),
          catgs: catgs,
          brands: brands
          
        })
      } 
    
  }
    
  logOut(){      
    window.localStorage.removeItem("UniqueId");
    window.localStorage.removeItem("products");
    window.localStorage.removeItem("catgs");
    window.localStorage.removeItem("brands");
  }      
           
  render(){
    const loading = this.state.products ? false : true;
    const havesign = this.state.UniqueId ? true : false;
    if (!loading && havesign){
    
      return (
        <>
        <Router>
        <div className="App">
         <div className="shadow-full-screen"></div>
         <div className="div-logout">
           <a href="/signin" className="text-logout" onClick={this.logOut}>Log out</a>
         </div>
        <Route path='/' exact>
          <HomePage products={this.state.products} header={true} actualiceData={this.actualiceData} UniqueId={this.state.UniqueId}/>
  
        </Route>
        <Switch>
            <Route path="/product/create" exact>
                <CreateProduct UniqueId = {this.state.UniqueId}actualiceData={this.actualiceData} 
                products={this.state.products} catgs={this.state.catgs} brands={this.state.brands}/> 
            </Route>

            <Route path="/product/edit/" exact>    
              <EditProduct data={this.state.data} commerce_id = {this.state.UniqueId}actualiceData={this.actualiceData}
              />
            </Route>
            <Route path="/product/:productId" exact={true}>
              <EmergeInfo commerce_id={this.state.UniqueId}/>
            </Route>
        </Switch>
          
      </div>
      </Router>
      </>
      );
  
    }
    else if (!havesign){
      return(
        <Router>
          <Route path="/signin" exact>
            <UserSignIn didsign={this.didsign}/>
          </Route>

          <Route path="/signup" exact>
            <UserSignUp didsign={this.didsign}/>
          </Route>

          <Route path='/' exact>
          <h1 className="sign-title">E-commerce</h1>
            <div className="div_sing_home">
              <button  classname="sing_home"onClick={()=>window.location.assign('/signin')}>Sign in</button>
              <button classname="sing_home" onClick={()=>window.location.assign('/signup')}>Sign up</button>

            </div>
          </Route>
          <div className="div_demo"> 
            <p className="text_demo">Would you like to see a demo first?</p>
            <button className="button_demo" onClick={()=> createDemoUser(this.didsign)}>Show Demo</button>
          </div>
        </Router>
      )
    }

    else{
      return <p>Sign in...</p>;
    }
  
  
  }
}

export default App;

