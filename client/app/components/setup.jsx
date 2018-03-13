import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router';
import axios from 'axios';
import Logout from './Logout';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Zipcodes from 'zipcodes';
import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

require('dotenv').config({path:'../../../../.env'})

export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	biz:[],
          selectedBiz:[],
          yelpBizName:[],
          displaySelectedBiz:[],
          eventID:'',
          isOpen:false,
          user:{},
          myInvite:{
            id:0
          },
          myInvites:[],
          zipcode:'10010'

        };
        this.addBiz = this.addBiz.bind(this);
        this.deleteBiz = this.deleteBiz.bind(this);
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
                myInvites:results
            });

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
            yelpBiz:this.state.selectedBiz,
            yelpBizName:this.state.yelpBizName,
        }
        fetch('/api/post-submission', {
            method: 'post',
            body: JSON.stringify(newSubmission),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
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
            });

        } else {
          this.setState({
            myInvite:{
              id:1
            }
          })
        }}).then(this.setState({
          isOpen:true
        }));
        console.log(this.state.myInvite)



    }

    zipcode(e){
      if(e.target.value.length==5){
        this.setState({
          zipcode:e.target.value
        })
    }
    }

    yelpSearch(e){
        e.preventDefault();
        const url = 'https://api.yelp.com/v3/businesses/search?term='+e.target.value+'&latitude='+Zipcodes.lookup(this.state.zipcode).latitude+'&longitude='+Zipcodes.lookup(this.state.zipcode).longitude;
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

    deleteBiz(selectedBusiness){
        var arr = this.state.displaySelectedBiz;
        var index = arr.indexOf(selectedBusiness);
        arr.splice(index,1);
        this.setState({
            displaySelectedBiz: arr
        })

        var arr2 = this.state.selectedBiz;
        arr2.splice(index,1)
        this.setState({
            selectedBiz:arr2
        })

        var arr3 = this.state.yelpBizName;
        arr3.splice(index,1)
        this.setState({
            yelpBizName:arr3
        })
    }

        addBiz(business){
        var newStuff = this.state.selectedBiz.slice()
        newStuff.push(business.id)
        this.setState({ selectedBiz: newStuff })

        var arrayvar = this.state.displaySelectedBiz.slice()
        arrayvar.push(business)
        this.setState({ displaySelectedBiz: arrayvar })

        var arrayvar2 = this.state.yelpBizName.slice()
        arrayvar2.push(business.name)
        this.setState({ yelpBizName: arrayvar2 })

        console.log(this.state)
    }

      hideModal(){
        this.setState({
          isOpen: false
        });
      };


      checkDates(){
            if(this.refs.start.value > this.refs.end.value){
                  alert("Start date cannot exceed end date")
                  this.refs.end.value = this.refs.start.value
            }
      }

    render() {
        // if(this.state.biz){
        const appendYelpResults = this.state.biz.map((business,index) => {
              return (
                <div>
                <Paper style={cardstyle} zDepth={2}>
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
                </Paper>
                <br/>
                </div>
              )
            
          })
        // }
        const appendSelectedBiz = this.state.displaySelectedBiz.map((selectedBusiness,index) => {
              return (

                 <Chip
                  key={index}
                  onRequestDelete={()=>this.deleteBiz(selectedBusiness)}
                  style={{margin:4}}
                >
                   {selectedBusiness.name}
                </Chip>
              )
            
          })

        const cardstyle = {
          borderRadius: '5px'

        };

        let appendMyInvitesName;
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
          <p className="navbar-text">Group dinner made easy </p>
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
            <h2>Create Your Invite</h2>

		        <form onSubmit={this.handleSubmit.bind(this)}>
                    <label htmlFor="title">Event Title:</label>
                    <input type="text" name="title" ref='title' id="title" className="form-control" placeholder="Event Title"/>   
                    <div className="form-group">
                      <label htmlFor="desc">Description:</label>
                      <textarea className="form-control" rows="5" id="desc" name="desc" ref="desc"></textarea>
                    </div>
                    <label>Date Range:</label>
                    <br/>
                    <span><input type="date" name="start" ref="start" />
                    <span> to </span><input type="date" name="end" ref="end" onChange={this.checkDates.bind(this)}/></span>
                    <div>
                    <br/>
                    <label>Search Restaurants:</label>
                    <br/>
                    <div className="row">
                    <div className="col-lg-9">
                    <input type="text" name="search" ref='search' className="form-control" placeholder="Search Restaurants" onChange={this.yelpSearch.bind(this)}/> 
                    </div>
                    <label for="zipcode" className="col-lg-1">Near:</label>
                    <div className="col-lg-2">
                    <input type="text" ref='zipcode' id='zipcode' className="form-control" placeholder={this.state.zipcode} onChange={this.zipcode.bind(this)}/>  
                    </div>
                    </div>
                    </div>
                    <br/>
            <label><b>You selected: </b></label>
            <div style={{display: 'flex',flexWrap: 'wrap',}}>
            {appendSelectedBiz}
            </div>
            <br/>
            <input className="btn btn-primary" id="submit-this" type="submit"/>
            </form>
            <hr/>
            {appendYelpResults}
            </div>
            </Paper>

              <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal.bind(this)}>
                <ModalHeader>
                  <ModalClose onClick={this.hideModal}/>
                  <ModalTitle>Nice!</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <p>You've successfully created a new invite</p>
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