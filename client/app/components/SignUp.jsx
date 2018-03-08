import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    signUpForm(e){
    	e.preventDefault();
    	var newUser = {
    		name: this.refs.name.value,
    		username: this.refs.username.value,
    		password: this.refs.password.value
    	}
        fetch('/api/sign-up', {
            method: 'post',
            body: JSON.stringify(newUser),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => response.json())
        .then((results) => {
            alert('done');
        	browserHistory.push("/");
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
            if(results.message){
                if(results.message !== "no req.user"){
                    browserHistory.push("/home")
                }
            }
        });
	}
  	render() {
	    return (
	        <div>

            <div >   
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
 
      <div>
      
        <div className="login">
        <p className="veatlogo veatlogobcolor"><font size="200">Veat</font></p>
        <form onSubmit={this.signUpForm.bind(this)}>
          <div className="login-form">
            <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="name" id="login-name" ref="name"/>
              <label className="login-field-icon fui-user" for="login-name"></label>
            </div>

          <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="Username" id="login-uname" ref="username"/>
              <label className="login-field-icon fui-user" for="login-uname"></label>
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

      </div>
            </div>
	        </div>
	    );
  	}
};
