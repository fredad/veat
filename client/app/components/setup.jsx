import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router';
import axios from 'axios';
import Logout from './Logout';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

require('dotenv').config({path:'../../../../.env'})

export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	biz:[],
          selectedBiz:[],
          displaySelectedBiz:[],
          eventID:'',
          isOpen:false,
          user:{},
          myInvite:{
            id:0
          },
          myAllInvites:[]

        };
        this.addBiz = this.addBiz.bind(this);
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
                    alert("You need to sign in to create invites!")
                    browserHistory.push("/")
                } else {
                  this.setState({
                    user: results.user
                  })
                }
            }
        }).then(()=>fetch(`/api/get-myInvite/${this.state.user.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        })).then((response) => response.json())
        .then((results) => {
          if(results.length>1){
            this.setState({
                myInvite:results.pop(),
                myAllInvites:results
            });

        } else {
          this.setState({
            myInvite:{
              id:1
            }
          })
        }});
  }
    handleSubmit(e){
        e.preventDefault();
        var newSubmission = {
            userID:this.state.user.id,
            host:this.state.user.name,
            title: this.refs.title.value,
            desc: this.refs.desc.value,
            dateStart: this.refs.start.value,
            dateEnd:this.refs.end.value,
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
        console.log(newSubmission)


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

    // addBiz(business){
    //     var newStuff = this.state.selectedBiz;    
    //     if (newStuff!= ''){
    //         newStuff = newStuff.concat(",",business.id)   
    //     }
    //         else newStuff = business.id
    //     this.setState({selectedBiz:newStuff})

    //     var arrayvar = this.state.displaySelectedBiz.slice()
    //     arrayvar.push(business)
    //     this.setState({ displaySelectedBiz: arrayvar })
    // }

        addBiz(business){
        var newStuff = this.state.selectedBiz.slice()
        newStuff.push(business.id)
        this.setState({ selectedBiz: newStuff })

        var arrayvar = this.state.displaySelectedBiz.slice()
        arrayvar.push(business)
        this.setState({ displaySelectedBiz: arrayvar })
    }

      hideModal(){
        this.setState({
          isOpen: false
        });
      };


    componentDidUpdate(){
        if(this.state.myInvite.id == 0){

    }
}

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
                <li  key={index}><a herf="#"> {selectedBusiness.name}</a></li>
                </a>
                </div>
              )
            
          })

        let appendMyInvites;
        if(this.state.myAllInvites.length>0){
        appendMyInvites = this.state.myAllInvites.map((invite,index) => {
              return (

                <li  key={index}>{invite.title}</li>
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
          <p className="navbar-text">Group dinner made easy </p>
          <ul className="nav navbar-nav navbar-left">
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage invites <b className="caret"></b></a>
          <span className="dropdown-arrow"></span>
          <ul className="dropdown-menu">
              {appendMyInvites}
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
            <h2>Create Your Invite</h2>

		        <form onSubmit={this.handleSubmit.bind(this)}>
                    <input placeholder="event title" type="textarea" name="title" ref="title"/>
                    <div className="form-group">
                      <label htmlFor="desc">Description:</label>
                      <textarea className="form-control" rows="5" id="desc" name="desc" ref="desc"></textarea>
                    </div>
                    <p>Date Range</p> <br/>
                    <p>Between</p> <input type="date" name="start" ref="start" />
                    <p> and </p><input type="date" name="end" ref="end" />
                    <div>
                    <br/>
                    <p>Search ur Restaurants</p>
                    <input type="search" onChange={this.yelpSearch.bind(this)}/>
                    </div>
                    <input className="btn btn-primary" id="submit-this" type="submit"/>
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
                  <p>localhost:8000/invite/{this.state.myInvite.id}</p>
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
}