import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import DatePicker from 'material-ui/DatePicker';
import Logout from './Logout';


require('dotenv').config({path:'../../../../.env'})


export default class Recipient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invite:{},
            selectedBiz:[],
            hover:false,
            chosenBiz:[],
            displaySelectedBiz:[],
            optionsState:{},
            myInvites:[],
            attend:true
             
        };
        this.chooseBiz = this.chooseBiz.bind(this);  
    }
    handleSubmit(){

        var newSubmission = {
            inviteId:this.state.invite.id,
            name: this.refs.name.value,
            attend: this.state.attend,
            availableDate: this.refs.date.value,
            chosenBiz:this.state.chosenBiz,
            note:this.refs.note.value
        }
        fetch('/api/post-response', {
            method: 'post',
            body: JSON.stringify(newSubmission),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
        }).then(alert('done'));
        console.log(newSubmission)
    }

    componentWillMount(){
        fetch(`/api/get-invite/${this.props.params.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => response.json())
        .then((results) => {
            
            this.setState({
                invite: results[0]
            });

        });

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

    componentDidUpdate(){
        
        if(!this.state.selectedBiz.length){
    for (var i = 0; i < this.state.invite.yelpBiz.length; i++) {
        const url = `https://api.yelp.com/v3/businesses/${this.state.invite.yelpBiz[i]}`
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

    chooseBiz(option){
        var arrayvar = this.state.chosenBiz.slice()
        arrayvar.push(option.id)
        this.setState({ chosenBiz: arrayvar })

    }

    yes(){
        this.setState({
                attend:!this.state.attend
            })
        console.log(this.state.attend)
    }


    render() {

        let appendSelectedBiz;
        if(this.state.invite.yelpBiz){
           appendSelectedBiz = this.state.displaySelectedBiz.map((selectedBusiness,index) => {
              return (
                <div className="selectedbizcard">
                <a href={selectedBusiness.url}>
                <li  key={index}>{selectedBusiness.name}</li>
                </a>
                </div>
              )
            
          })}

        const styles = {
          root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          },
          gridList: {
            width: 800,
            height: 450,
            overflowY: 'auto',
          },
        };

        let appendMyInvitesName
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
	    	<div className="container">
            <div id="sameline">
            <p><font size="100"><b>{this.state.invite.title}</b></font> <i>by: {this.state.invite.host}</i></p></div>
            <p className="lead">{this.state.invite.desc}</p>
              <div className="form-group mx-sm-3 mb-2">
                <label for="name" className="sr-only">Name</label>
                <input type="text" name="name" ref='name' className="form-control" placeholder="Name"/>
              </div>
            <p>Attend?</p>
        <div className="col-md-2">
          <div className="bootstrap-switch-square">
            <input type="checkbox" checked data-toggle="switch" onChange={this.yes.bind(this)} id="custom-switch-03" data-on-text="<span class='fui-check'></span>" data-off-text="<span class='fui-cross'></span>" />
          </div>
        </div><br/>

            <span>I am available on</span>

            <input type="date" min={this.state.invite.dateStart} max={this.state.invite.dateEnd} name="date"  ref='date'/>


            <br/>
            <br/>
            
            <div style={styles.root}>
                <GridList
                  cellHeight={180}
                  style={styles.gridList}
                >
                  <Subheader>Options</Subheader>
                  {this.state.selectedBiz.map((option, index) => (
                    
                    <GridTile
                      key={option.index}
                      title={option.name}
                      subtitle={<span>🏚: <b>{option.location.address1}, {option.location.city}</b></span>}
                      a href={option.url}
                      actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                    >
                      <img src={option.image_url} onClick={()=>{this.chooseBiz(option)}}/>

                    </GridTile>
                  ))}
                </GridList>
              </div>

            <button onClick={this.showlog.bind(this)}>Show</button>
            {appendSelectedBiz}
            <br/>
            <br/>
            <input type="text" ref="note" name="note" placeholder="Comment?"/>
            <br/>
            <input className="btn btn-default" id="submit-this" type="submit" onClick={this.handleSubmit.bind(this)}/>

            </div>
            </div>
	    );
  	}
}