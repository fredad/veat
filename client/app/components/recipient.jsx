import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Info from 'material-ui/svg-icons/action/info';
import Toggle from 'material-ui/Toggle';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
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
            availableDates:[],
            attend:false,
            showDetailsBiz:{
                photos:[],
                categories:[],
                location:{}
            },
            selectedBizReviews:[],
            anotherdateNum:1
             
        };
        this.chooseBiz = this.chooseBiz.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);  
        this.deleteBiz = this.deleteBiz.bind(this);
        this.showDetails = this.showDetails.bind(this);
    

    }
    handleSubmit(){

        let newSubmission
        if(this.state.attend){
            if (!this.refs.name.value || this.state.availableDates.length==0 || this.state.chosenBiz.length==0){
            alert('Please fill in all the required cells')
            return;
        }
        newSubmission = {
            inviteId:this.state.invite.id,
            name: this.refs.name.value,
            email:this.refs.email.value,
            attend: this.state.attend,
            availableDate: this.state.availableDates,
            chosenBiz:this.state.chosenBiz,
            chosenBizName:this.state.chosenBizName,
            note:this.refs.note.value
        }} else {
            newSubmission = {
            inviteId:this.state.invite.id,
            name: this.refs.name.value,
            email:this.refs.email.value,
            attend: this.state.attend,
            availableDate: ['NA'],
            chosenBiz:['NA'],
            chosenBizName:['NA'],
            note:this.refs.note.value
        }

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

        })
        .then(() => {

            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            const auth = {
            headers: {
              Authorization:'Bearer NG16oFnP6DvIeTC-X4S6Y1KPkIdw4V_UU8nBHPik0r734ZClThmDSMXQThvEuhiCW65I_LGFSINGNH5T1ugHbRoBTCI1Hup63LBRj0Q-tduyx7v7XCGrx8IZQSqGWnYx'} 
            }
        for (var i = 0; i < this.state.invite.yelpBiz.length; i++) {

            const url = `https://api.yelp.com/v3/businesses/${this.state.invite.yelpBiz[i]}`
            const url2 = `https://api.yelp.com/v3/businesses/${this.state.invite.yelpBiz[i]}/reviews`
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
        })}

     })

      
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

showlog(){
       console.log(this.state)
}
handleDateChange(e){
    var dates = this.state.availableDates.slice();
    if(dates.indexOf(e.target.value)==-1){dates.push(e.target.value)};
    this.setState({
        availableDates:dates
    });

}

addAnotherDate(){
     this.setState({
      anotherdateNum: this.state.anotherdateNum + 1
    });
}

    chooseBiz(option){
        var arrayvar = this.state.chosenBiz.slice()
        arrayvar.push(option.name)
        this.setState({ chosenBiz: arrayvar })

        var arrayvar2 = this.state.displaySelectedBiz.slice()
        arrayvar2.push(option)
        this.setState({ displaySelectedBiz: arrayvar2 })

    }

    yes(){
        this.setState({
                attend:!this.state.attend
            })
    }

    deleteBiz(selectedBusiness){
        var arr = this.state.displaySelectedBiz;
        var index = arr.indexOf(selectedBusiness);
        arr.splice(index,1);
        this.setState({
            displaySelectedBiz: arr
        })

        var arr2 = this.state.chosenBiz;
        arr2.splice(index,1)
        this.setState({
            chosenBiz:arr2
        })
    }

    showDetails(option){
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const url2 = `https://api.yelp.com/v3/businesses/${option.id}/reviews`
        const auth = {
            headers: {
              Authorization:'Bearer NG16oFnP6DvIeTC-X4S6Y1KPkIdw4V_UU8nBHPik0r734ZClThmDSMXQThvEuhiCW65I_LGFSINGNH5T1ugHbRoBTCI1Hup63LBRj0Q-tduyx7v7XCGrx8IZQSqGWnYx'} 
            }
        axios.get(proxyurl+url2, auth)
          .then((res) => {
            this.setState({
            selectedBizReviews:res.data.reviews,
            showDetailsBiz: option,
            showDetails:true
            })
        })




    }

    closeDetails(){
        this.setState({
            showDetailsBiz:{
                photos:[],
                categories:[],
                location:{}
            },
            showDetails:false
        })
    }
    render() {

        let appendSelectedBiz;
        if(this.state.invite.yelpBiz){
           appendSelectedBiz = this.state.displaySelectedBiz.map((selectedBusiness,index) => {
              return (
                <Chip
                  key={index}
                  onRequestDelete={()=>this.deleteBiz(selectedBusiness)}
                  style={{margin:4}}
                >
                   {selectedBusiness.name}
                </Chip>

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
            height: 'auto',
            overflowY: 'auto',
          },
        };

        const switchstyles = {
            marginBottom: 16,
        };


        let appendMyInvitesName
        if(this.state.myInvites.length>0){
            appendMyInvitesName = this.state.myInvites.map((invite,index) => {
              return (
                <li  key={index}><a href={`/response/${invite.id}`}>{invite.title}</a></li>
              )
            
          })}

        const anotherdate = [];
        for (var i = 0; i < this.state.anotherdateNum; i++) {
        anotherdate.push(<div style={{marginBottom:3}}><input type="date" min={this.state.invite.dateStart} max={this.state.invite.dateEnd} onChange={this.handleDateChange.bind(this)}/>
            <span style={{marginLeft:8}} className="fui-plus-circle" onClick={this.addAnotherDate.bind(this)}></span>
            </div>);
         };


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
            <Paper zDepth={1}>
            <div className="container2">
            <div id="sameline">
            <p><font size="100"><b>{this.state.invite.title}</b></font> <i>by: {this.state.invite.host}</i></p></div>
            <p className="lead">{this.state.invite.desc}</p>
              <div className="form-group mx-sm-3 mb-2">
                {this.state.user && <input type="text" name="name" ref='name' className="form-control" value={this.state.user.name}/>}
                {!this.state.user && <input type="text" name="name" ref='name' className="form-control" placeholder="Name *"/>}
             <br/>
             <input type="text" name="email" ref='email' className="form-control" placeholder="E-mail"/>   
              </div>
            <div style={{display:'inline'}}>
            <label>Attend?</label>
            <Toggle
              defaultToggled={false}
              style={switchstyles}
              onToggle={this.yes.bind(this)}
            />
            </div>
            {this.state.attend && <div>
            <label>I am available on: <font size="4" color="red">*</font></label>
            <br/>
            {anotherdate}
            <br/>
            <label>I am interested in...<font size="4" color="red">*</font></label>
            <div style={{display: 'flex',flexWrap: 'wrap',}}>
            {appendSelectedBiz}
            </div>
            <br/>
         <div style={styles.root}>
                <GridList
                  cellHeight={230}
                  style={styles.gridList}
                  cols={3}
                >
                  {this.state.selectedBiz.map((option, index) => (
                    
                    <GridTile
                      key={option.index}
                      title={option.name}
                      subtitle={<span>🏚: <b>{option.location.address1}, {option.location.city}</b></span>}
                      a href={option.url}
                      actionIcon={<IconButton><Info color="white" onClick={()=>{this.showDetails(option)}}/></IconButton>}
                    >
                      <img src={option.image_url} onClick={()=>{this.chooseBiz(option)}}/>

                    </GridTile>
                  ))}
                </GridList>
              </div>
            <br/> </div>}
            <textarea className="form-control" rows="5" ref="note" name="note" placeholder="Comment?"></textarea>
            <br/>
            
            <input className="btn btn-primary" id="submit-this" type="submit" onClick={this.handleSubmit.bind(this)}/> 
            </div>
            </Paper>

            <div>
            <Dialog
              modal={false}
              open={this.state.showDetails}
              onRequestClose={this.closeDetails.bind(this)}
              autoScrollBodyContent={true}
            >
            <div className = "modalstyle">
              <a href={this.state.showDetailsBiz.url}><h4><u>{this.state.showDetailsBiz.name}</u></h4></a>
              Price: {this.state.showDetailsBiz.price}
              <br/>
              Rating: {this.state.showDetailsBiz.rating}
              <br/>
              <span>Category: </span>
              {this.state.showDetailsBiz.categories.map((category, index) => (
                <span>{category.title}; </span>
                  ))}
              <br/>
            <span>Address: {this.state.showDetailsBiz.location.address1},{this.state.showDetailsBiz.location.city} {this.state.showDetailsBiz.location.state} {this.state.showDetailsBiz.location.zip_code}</span>
            <br/>
            <div style={styles.root}>
                <GridList
                  cellHeight={180}
                  style={styles.gridList}
                  cols={3}
                >
            {this.state.showDetailsBiz.photos.map((photo, index) => (
                    <GridTile key={photo.index}>
                      <img src={photo} />
                    </GridTile>
                  ))}
                </GridList>
             </div>
             <br/>
             <label>Reviews: </label>
             {this.state.selectedBizReviews.map((review, index) => (
                <div>
                <Card>
                    <CardHeader
                      title={review.user.name}
                      subtitle={`${review.rating} star`}
                      avatar={review.user.image_url}
                    />
                    <CardText>
                      {review.text} <a href={review.url} target="_blank">View More</a>
                    </CardText>
                  </Card>
                  <br/>
                  </div>
                  ))}

            </div>
            </Dialog>


          </div> 
            </div>
            </div>
	    );
  	}
}