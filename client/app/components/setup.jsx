import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

require('dotenv').config({path:'../../../../.env'})

export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	biz:[],
          selectedBiz:'',
          displaySelectedBiz:[],
          eventID:'',
          isOpen:false
        };
        this.addBiz = this.addBiz.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        var newSubmission = {
            title: this.refs.title.value,
            desc: this.refs.desc.value,
            dateStart: this.refs.start.value,
            dateEnd:this.refs.end.value,
            foodType:this.refs.foodType.value,
            yelpBiz:this.state.selectedBiz
        }
        fetch('/api/post-submission', {
            method: 'post',
            body: JSON.stringify(newSubmission),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
        }).then(this.setState({
          isOpen:true
        }));
    }

    yelpSearch(e){
        e.preventDefault();
        const url = 'https://api.yelp.com/v3/businesses/search?term='+e.target.value+'&latitude=40.758896&longitude=-73.985130';
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const auth = {
        headers: {
          Authorization:'Bearer NG16oFnP6DvIeTC-X4S6Y1KPkIdw4V_UU8nBHPik0r734ZClThmDSMXQThvEuhiCW65I_LGFSINGNH5T1ugHbRoBTCI1Hup63LBRj0Q-tduyx7v7XCGrx8IZQSqGWnYx'} 
    }
      this.setState({
       error: ''
      })
    axios.get(proxyurl+url, auth)
      .then((res) => {
        if(res.data.Error){
          this.setState({
            error: res.data.Error
          })
      }
      // console.log(res.data.businesses)
      this.setState({
        biz:res.data.businesses
    });
    })

  .catch(err => {
    console.log(err)
  });



    }

    addBiz(business){
        var newStuff = this.state.selectedBiz;    
        if (newStuff!= ''){
            newStuff = newStuff.concat(",",business.id)   
        }
            else newStuff = business.id
        this.setState({selectedBiz:newStuff})

        var arrayvar = this.state.displaySelectedBiz.slice()
        arrayvar.push(business)
        this.setState({ displaySelectedBiz: arrayvar })
    }

      hideModal(){
        this.setState({
          isOpen: false
        });
      };

    render() {
        // if(this.state.biz){
        const appendYelpResults = this.state.biz.map((business,index) => {
              return (
                <div className="bizcard clearfix" >
                <img src={business.image_url} alt="img"/>
                <div className="descArea">
                <a href={business.url}>
                <h5>{business.name}</h5>
                </a>
                <br/>
                <p>Address: {business.location.address1}, {business.location.city} {business.location.state}</p>
                <br/>
                <button className="btn btn-success" onClick={()=>{this.addBiz(business)}}>Add</button>
                </div>
                </div>
              )
            
          })
        // }
        const appendSelectedBiz = this.state.displaySelectedBiz.map((selectedBusiness,index) => {
              return (
                <div className="selectedbizcard">
                <a href={selectedBusiness.url}>
                <li  key={index}>{selectedBusiness.name}</li>
                </a>
                </div>
              )
            
          })
	    return (

	    	<div className="container">
            <h2>Create Your Invite</h2>
		        <form onSubmit={this.handleSubmit.bind(this)}>
                    <input placeholder="event title" type="textarea" name="title" ref="title"/>
                    <p>Description</p> <br/>
                    <div class="form-group">
                      <label htmlFor="desc">Description:</label>
                      <textarea className="form-control" rows="5" id="desc" name="desc" ref="desc"></textarea>
                    </div>
                    <p>Date Range</p> <br/>
                    <p>Between</p> <input type="date" name="start" ref="start" />
                    <p> and </p><input type="date" name="end" ref="end" />
                    <span>
                    <button className="btn primary">Choose Food Types</button>
                    <span>      or      </span>
                    <button className="btn primary">Choose Restaurants</button></span>
                    <div className="foodtypeoptions" >
                    <p>Food Type?</p>
                    <div className="form-check form-check-inline">
                    <input type="checkbox" name="foodType" ref="foodType" value="Italian"/>
                    <label htmlFor="Italian">Italian</label>
                    </div>
                     <div className="form-check form-check-inline">
                    <input type="checkbox" name="foodType" ref="foodType" value="Japanese"/>
                    <label htmlFor="Japanese">Japanese</label>
                    </div>
                    </div>
                    <div>
                    <br/>
                    <p>Search ur Restaurants</p>
                    <input type="search" onChange={this.yelpSearch.bind(this)}/>
                    </div>
                    <input className="btn btn-default" id="submit-this" type="submit"/>
            </form>
            <div className='selected'>
            <h5>You selected:</h5>
            </div>
            <br/>
            {appendSelectedBiz}
            {appendYelpResults}

              <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                <ModalHeader>
                  <ModalClose onClick={this.hideModal}/>
                  <ModalTitle>Now share the invite with your friends!</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>http://xxxxxxx</p>
                </ModalBody>
                <ModalFooter>
                  <button className='btn btn-default' onClick={this.hideModal.bind(this)}>
                    Close
                  </button>
                </ModalFooter>
              </Modal>
			</div>
	    );
  	}
}