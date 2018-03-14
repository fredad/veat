import React, { Component } from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Logout from './Logout';

export default class Thanks extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	user:{},
        	myInvites:[]
        };
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
                if(results.message == "signed-in"){
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
  	render() {

  		 let appendMyInvitesName
        if(this.state.myInvites.length>0){
            appendMyInvitesName = this.state.myInvites.map((invite,index) => {
              return (
                <li  key={index}><a href={`/response/${invite.id}`}>{invite.title}</a></li>
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
                    {this.state.user && <li className="dropdown">
                     <a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage invites <b className="caret"></b></a>
                      <span className="dropdown-arrow"></span>
                      <ul className="dropdown-menu">
                          {appendMyInvitesName}
                      </ul>
                    </li>}
                    </ul>
                    <div className="nav navbar-nav navbar-right">
                    {this.state.user && <div><p className="navbar-text">Hi, {this.state.user.name}</p>
                      <button className="btn btn-default navbar-btn btn-xs" type="button"><Logout/></button></div>}
                    {!this.state.user && <div><p className="navbar-text"><a href="/signup"><u>Sign up</u></a> to create your own invites!</p><Link to="/" ><button className="btn btn-default navbar-btn btn-xs" type="button">Log In</button></Link></div>}
                    </div> 
                    </div>
                  </nav>

                  <div className='container'>
		            <Paper zDepth={1}>
		             <div className="container2">
		           <br/>
		            <br/>
		             <br/>
		              <br/>
                  <center><font size="20" color="green"><span className="fui-checkbox-checked"></span>  Yay!<br/></font>
                   <h4>You successfully submitted your response!</h4>
                   <br/>
                   <br/>
                   <span>Thanks for using Veat <span className="fui-star"> </span></span></center>
                  <br/>
		            <br/>
		             <br/>
		              <br/>
                  </div>
                  </Paper>
                  </div>
	        </div>
	    );
  	}
};