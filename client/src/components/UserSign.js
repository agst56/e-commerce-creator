import React from "react";
import axios from 'axios';

class UserSignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.Submit_SignIn = this.Submit_SignIn.bind(this);
    }
    handleChange(feature, event){
        const target = event.target;
        this.setState({
            [feature]: target.value
        })
    }

    Submit_SignIn(event){
        let regemail = /\w+@\w+/;
        let username = this.state.username
        let email;
        const password = this.state.password;
        if (regemail.test(username)){
            email = username;
            username='';
        }
        const user_information = {
            username: username,
            password: password
        };
        axios.post('/api/commerce/signin', user_information)
        .then((res)=>{
            console.log(res.data.commerce_id);
            const commerce_id = res.data.commerce_id;
            this.props.didsign(commerce_id);
        })
        .catch((err)=>alert(err.msg));

    }

    render(){
        return (
            <div className="sign">

            <h1 className="sign-title">E-commerce</h1>
            <div className="signIn-form">
                <input className="inputs_user_sign" type="text" value={this.state.username} 
                onChange={this.handleChange.bind(this, 'username')}
                placeholder="Insert your user name or email"/>           

                <input className="inputs_user_sign" type="password" value={this.state.password} 
                onChange={this.handleChange.bind(this, 'password')}
                placeholder="Insert your password"/> 

                <button className= "submit_sing"  href="/" onClick={this.Submit_SignIn}>Sign in</button>
            </div>
            </div>
        )
    }
}

class UserSignUp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            commerce_name: '',
            email: '',
            password: '',
            submiting: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.Submit_SignUp = this.Submit_SignUp.bind(this);
    }
    handleChange(feature, event){
        const target = event.target;
        this.setState({
            [feature]: target.value
        })
    }

    Submit_SignUp(event){
        this.setState({
            submiting: true
        })
        const user_information = {
            username: this.state.username,
            commerce_name: this.state.commerce_name,
            password: this.state.password 
        };
        axios.post('/api/commerce/signup', user_information)
        .then(res=>{
            const commerce_id = res.data.commerce_id;
            this.props.didsign(commerce_id);
        }).catch(err=>console.log(err));
        


    }

    render(){
        if (!this.state.submiting){
            return (
                <div className="sign">
                <h1 className="sign-title">E-commerce</h1>
                <div className="signIn-form">
                    <input className="inputs_user_sign" type="text" value={this.state.username} 
                    onChange={this.handleChange.bind(this, 'username')}
                    placeholder="Insert your user name"/>
     
                    <input className="inputs_user_sign" type="text" value={this.state.commerce_name} 
                    onChange={this.handleChange.bind(this, 'commerce_name')}
                    placeholder="Insert your Company Name"/>            
    
                    {/* <input className="inputs_user_sign" type="email" value={this.state.email} 
                    onChange={this.handleChange.bind(this, 'email')}
                    placeholder="Insert your email"/> */}
                    
                    <input className="inputs_user_sign" type="password" value={this.state.password} 
                    onChange={this.handleChange.bind(this, 'password')}
                    placeholder="Insert your password"/> 
    
                    <button className= "submit_sing" onClick={this.Submit_SignUp}>Enter</button>
                </div>
                </div>
            )
        }
        else {

            return <p>The user is creating</p>
        }
    }
}

export{
    UserSignIn,
    UserSignUp
}