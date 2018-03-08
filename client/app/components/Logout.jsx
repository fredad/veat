import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
  	render() {
	    return (
				<li id="logoutli" onClick={this.logoutUser.bind(this)}>Log out</li>

	    );
  	}
};