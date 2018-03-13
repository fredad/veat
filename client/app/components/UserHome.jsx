import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardTitle, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

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
                <div>
                <Card style={{textAlign:'left'}}>
                 <CardTitle title={myInvite.title} subtitle={myInvite.desc} />
                <CardActions>
                    <FlatButton onClick={()=>{this.showlink(myInvite.id)}} label="Share Link" />
                    <Link to={`/response/${myInvite.id}`} > <FlatButton label="See Responses" /></Link>
                </CardActions>
                </Card>
                <br/>
                </div>
              )
        
          })}

        let appendMyInvitesName;
        if(this.state.myInvites.length>0){
        appendMyInvitesName = this.state.myInvites.map((invite,index) => {
              return (
                <li  key={index}><a href={`/response/${invite.id}`}>{invite.title}</a></li>
              )
            
          })}

        const actions = [
              <FlatButton
                label="Gotcha"
                primary={true}
                onClick={this.hideModal.bind(this)}
              />,
        ];
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
         <Paper zDepth={1}>
         <div className="container2">

				<div className="text-center">
		        	<h4>Welcome back, {this.state.user.name}!</h4>
                    {this.state.myInvites.length==0 && <p>You don't have any invites yet! </p>}
                   <Link to="/setup">
                    <button className="btn btn-primary">Create A New Invite</button>
                    </Link>
                    <br/>
                     <br/>

                    {appendMyInvites}

		        </div>
            </div>
                </Paper>
	        </div>

      <div>
        <Dialog
          title="Share the invite with your friends!"
          actions={actions}
          modal={true}
          open={this.state.isOpen}
        >

        <div className="col-sm-18">
          <div className="form-group">
            <div className="input-group">
          <input type="text" className="form-control" id="slink" value={`https://veat-app.herokuapp.com/invite/${this.state.modal}`}/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">Copy!</button>
          </span>  
          </div>                  
        </div>
        </div>
          <br/>
          <span className="fui-facebook"></span>
          <span>    </span>
          <span className="fui-twitter"></span> 
          <span>    </span> 
          <span className="fui-google-plus"></span>
        </Dialog>
      </div>

            </div>

);

}};