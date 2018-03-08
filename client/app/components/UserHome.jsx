import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

import Logout from './Logout';

export default class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	user: {},
            myInvites:[]
        };
    }
    logoutUser(){
        fetch('/api/logout', {
            method: 'DELETE',
            credentials: 'same-origin'
        }).then((response) => {
        	if(response.status == 204){
        		browserHistory.push('/');
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
            if(results.message){
                if(results.message !== "signed-in"){
                    browserHistory.push("/")
                } else {
                	this.setState({
                		user: results.user
                	})
                }
            }
        }).then(() => fetch(`/api/get-myInvite/${this.state.user.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        })).then((response) => response.json())
        .then((results) => {
            this.setState({
                myInvites:results,
            });


            }); 


	}

    showlink(id){
        this.setState({
            isOpen:true,
            modal:id,

        })
    }

      hideModal(){
        this.setState({
          isOpen: false
        });
      };


  	render() {
        let appendMyInvites;
        if(this.state.myInvites){
        appendMyInvites = this.state.myInvites.map((myInvite,index) => {
              return (
                <div className="dashboard">

                <p><strong>My invite {index+1}</strong>   <span className="fui-link" onClick={()=>{this.showlink(myInvite.id)}}></span></p>
                <a href={`/response/${myInvite.id}`} >
                <h3>{myInvite.title}</h3>
                </a>
                <p>{myInvite.desc}</p>
                </div>
              )
            
          })}

        let appendMyInvitesName;
        if(this.state.myInvites.length>0){
        appendMyInvitesName = this.state.myInvites.map((invite,index) => {
              return (
                <li  key={index}><a href="#">{invite.title}</a></li>
              )
            
          })}
	    return (
	        <div>


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
                      <ul className="nav navbar-nav navbar-left">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage invites <b className="caret"></b></a>
                      <span className="dropdown-arrow"></span>
                      <ul className="dropdown-menu">
                          {appendMyInvitesName}
                      </ul>
                    </li>
                    </ul>
                    <div className="nav navbar-nav navbar-right">
                    <span><p className="navbar-text">Hi, {this.state.user.name}</p>
                      <button className="btn btn-default navbar-btn btn-xs" type="button"><Logout/></button></span>
                    </div>
                    </div>
                  </nav>

         <div className="container">

				<div className="text-center">
		        	<h3>Welcome {this.state.user.name}</h3>
                    {this.state.myInvites.length==0 && <p>You don't have any invites yet! </p>}
                   <Link to="/setup">
                    <button className="btn btn-primary">Create Your Own Invite</button>
                    </Link>
                    <br/>
                     <br/>
                    {appendMyInvites}
		        </div>
	        </div>
            <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                <ModalHeader>
                  <ModalClose onClick={this.hideModal}/>
                  <ModalTitle>Share the invite with your friends!</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>localhost:8000/invite/{this.state.modal}</p>
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

	    );
  	}
};