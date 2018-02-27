import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

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
        });
	}


    componentDidUpdate(){
        if(!this.state.myInvites.length){
        fetch(`/api/get-myInvite/${this.state.user.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => response.json())
        .then((results) => {
            this.setState({
                myInvites:results
            });

        });
    }
}


  	render() {
        const appendMyInvites = this.state.myInvites.map((myInvite,index) => {
              return (
                <div className="dashboard">
                <p><strong>My invite {index+1}</strong></p>
                <h3>{myInvite.title}</h3>
                <p>{myInvite.desc}</p>
                </div>
              )
            
          })
	    return (
	        <div>
                    <Logout />

				<div className="text-center">
		        	<h3>Welcome {this.state.user.name}</h3>
                   <Link to="/setup">
                    <button className="btn btn-danger">Create Your Own Invite</button>
                    </Link>
                    <br/>
                     <br/>
                    {appendMyInvites}
		        </div>
	        </div>
	    );
  	}
};