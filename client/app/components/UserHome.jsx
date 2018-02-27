import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import Logout from './Logout';

export default class UserHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	user: {}
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
                    browserHistory.push("/login")
                } else {
                	this.setState({
                		user: results.user
                	})
                }
            }
        });
	}
  	render() {
	    return (
	        <div>
                    <Logout />

				<div className="text-center">
		        	<h3>Welcome {this.state.user.name}</h3>
                   <Link to="/setup">
                    <button className="btn btn-danger">Create Your Own Invite</button>
                    </Link>
		        </div>
	        </div>
	    );
  	}
};