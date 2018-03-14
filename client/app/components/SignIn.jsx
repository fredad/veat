import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Logout from './Logout';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    signInForm(e){
        e.preventDefault()
    	var signInUser = {
    		username: this.refs.username.value,
    		password: this.refs.password.value
    	}
        fetch('/api/sign-in', {
            method: 'post',
            body: JSON.stringify(signInUser),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => {
            if(response.status == 401){
                alert("Login Failed for Username and/or Password")
            } else {
                browserHistory.push("/home")
            }
        });
    }
	componentWillMount(){
        fetch('/api/signed-in', {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => response.json())
        .then((results) => {
            if(results.message === "signed-in"){
                browserHistory.push("/home")
            }
        });
	}

    componentDidMount(){
        fetch('/api/signed-in', {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => response.json())
        .then((results) => {
            if(results.message === "signed-in"){
                browserHistory.push("/home")
            }
        });
    }
  	render() {

	    return (
	        <div className="signinpage">   
        <nav role="navigation" className="navbar navbar-inverse navbar-embossed">
        <div className="navbar-header">
          <button data-target="#bs-example-navbar-collapse-7" data-toggle="collapse" className="navbar-toggle" type="button">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a href="/" className="navbar-brand veatlogo">Veat</a>
        </div>
        <div id="bs-example-navbar-collapse-7" className="collapse navbar-collapse">
          <p className="navbar-text">Group dinners made easy </p>
        </div>
      </nav>
 
      <div className="container">

        <div className="lg">

        <form onSubmit={this.signInForm.bind(this)}>
          <div className="login-form">
                  <p className="veatlogo veatlogobcolor"><font size="200">Veat</font></p>
            <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="Enter your username" id="login-name" ref="username"/>
              <label className="login-field-icon fui-user" for="login-name"></label>
            </div>

            <div className="form-group">
              <input type="password" className="form-control login-field" placeholder="Password" id="login-pass" ref="password"/>
              <label className="login-field-icon fui-lock" for="login-pass"></label>
            </div>

            <input className="btn btn-primary btn-lg btn-block"  type="submit" />
            <a className="login-link" href="/signup">Don't have an account? Please sign up</a>
          </div>
          </form>
        </div>
          
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>

	        </div>
	    );
  	}
};
