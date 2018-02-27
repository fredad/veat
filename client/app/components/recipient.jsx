import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';
require('dotenv').config({path:'../../../../.env'})


export default class Recipient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invite:{},
            options:[],
            selectedBiz:[]
        };
    }
    // handleSubmit(e){
    //     e.preventDefault();
    //     var newSubmission = {
    //         title: this.refs.title.value,
    //         desc: this.refs.desc.value,
    //         dateStart: this.refs.start.value,
    //         dateEnd:this.refs.end.value,
    //         foodType:this.refs.foodType.value,
    //         yelpBiz:this.state.selectedBiz
    //     }
    //     fetch('/api/post-submission', {
    //         method: 'post',
    //         body: JSON.stringify(newSubmission),
    //         headers: {
    //             'content-type': 'application/json',
    //             'accept': 'application/json'
    //         },
    //     }).then(alert('done'));
    // }

    componentWillMount(){
        fetch(`/api/get-invite/${this.props.params.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => response.json())
        .then((results) => {
            
            this.setState({
                invite: results[0],
                options:results[0].yelpBiz.split(",")
            });

        });
    }

    componentDidUpdate(){
        
        if(!this.state.selectedBiz.length){
    for (var i = 0; i < this.state.options.length; i++) {
        const url = `https://api.yelp.com/v3/businesses/${this.state.options[i]}`
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const auth = {
        headers: {
          Authorization:'Bearer NG16oFnP6DvIeTC-X4S6Y1KPkIdw4V_UU8nBHPik0r734ZClThmDSMXQThvEuhiCW65I_LGFSINGNH5T1ugHbRoBTCI1Hup63LBRj0Q-tduyx7v7XCGrx8IZQSqGWnYx'} 
    }

    axios.get(proxyurl+url, auth)
      .then((res) => {
        if(res.data.Error){
          this.setState({
            error: res.data.Error
          })
      }
        var newArr = this.state.selectedBiz.slice();
        newArr.push(res.data);
        this.setState({
            selectedBiz:newArr
        })
    })

  .catch(err => {
    console.log(err)
  });

}


}}

 showlog(){
    console.log(this.state)
 }


    render() {
        let appendOptions;
        if(this.state.selectedBiz){
                appendOptions = this.state.selectedBiz.map((option,index) => {
              return (
                <div className="bizCard">
                <a href={option.url}>
                <li  key={index}>{option.name}</li>
                </a>
                <span>{option.price}</span>
                <img width="300" src={option.image_url} alt='img'/>
                </div>
              )
            
          })
    
  }

	    return (

	    	<div className="container">
            <h1>{this.state.invite.title}</h1>
            <p>Description: {this.state.invite.desc}</p>
            <input type="text" placeholder="name"/>
            <br/>
            <span>I am available on</span>
            <input type="date"/>

            {appendOptions}
			</div>
	    );
  	}
}