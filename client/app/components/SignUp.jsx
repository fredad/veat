import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:false,
        };
    }
    signUpForm(e){
    	e.preventDefault();
        if(!this.refs.name.value  || !this.refs.username.value || !this.refs.password.value || !this.refs.zipcode.value){
            alert('Please fill in all fields');
            return;
        }
        if (this.refs.password.value.length<8){
          alert('Password must be 8 digit or longer');
            return;
        }
    	var newUser = {
    		name: this.refs.name.value,
    		username: this.refs.username.value,
    		password: this.refs.password.value,
            zipcode:this.refs.zipcode.value
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
            this.setState({
                isOpen:true,
            });
        });
    }
    hideModal(){
    this.setState({
        isOpen:false,
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
	        <div className='signinpage'> 
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
        
        <form onSubmit={this.signUpForm.bind(this)}>
          <div className="login-form">
          <p className="veatlogo veatlogobcolor"><font size="200">Veat</font></p>
            <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="Name" id="login-name" ref="name"/>
              <label className="login-field-icon fui-document" for="login-name"></label>
            </div>

          <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="Username" id="login-uname" ref="username"/>
              <label className="login-field-icon fui-user" for="login-uname"></label>
            </div>

            <div className="form-group">
              <input type="password" className="form-control login-field" placeholder="Password" id="login-pass" ref="password"/>
              <label className="login-field-icon fui-lock" for="login-pass"></label>
            </div>

            <div className="form-group">
              <input type="text" className="form-control login-field" placeholder="Zipcode" id="login-zipcode" ref="zipcode"/>
              <label className="login-field-icon fui-location" for="login-pass"></label>
            </div>

            <input className="btn btn-primary btn-lg btn-block"  type="submit" />
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
            <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                <ModalHeader>
                  <ModalClose onClick={this.hideModal}/>
                  <ModalTitle>Success!</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>Welcome to Veat :)</p>
                </ModalBody>
                <ModalFooter>
                <Link to="/home">
                  <button className='btn btn-default' onClick={this.hideModal.bind(this)}>
                    Close
                  </button>
                  </Link>
                </ModalFooter>
              </Modal>

      </div>
	        </div>
	    );
  	}
};
