import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router';
import axios from 'axios';
import {BarChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Bar, PieChart, Pie} from 'recharts';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import FontIcon from 'material-ui/FontIcon';
import Logout from './Logout';
import Paper from 'material-ui/Paper';
import datesBetween from 'dates-between';
import {Card, CardTitle, CardHeader, CardText} from 'material-ui/Card';
import ReactEcharts from 'echarts-for-react';
import TextField from 'material-ui/TextField';
require('dotenv').config({path:'../../../../.env'})


export default class Response extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response:[],
            invite:{
                yelpBiz:[]
            },
            resultCount:[],
            myInvites:[],
            showCharts:false,
            showText:false,
            user:{},
            slideIndex:0,
            attendees:[],
            dateRange:[],
            resultDateCount:[],

        };
    this.handleTabChange = this.handleTabChange.bind(this);
    }

    showlog(){
        console.log(this.state)
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

        }).then(()=>{
                function getCount(id, key){
        return fetch(`/api/get-food-response/${id}/${key}`, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then((response) => response.json())
            .then((results) => {
                var ppl=[];
                for (var i = 0; i < results.rows.length; i++) { 
                    ppl.push(results.rows[i].name)};
                var obj = {
                    name:key,
                    count:results.count,
                    people:ppl,
                }       
                if(results.count!=0){return obj};
         
            });
        }
            for (var i = 0; i < this.state.invite.yelpBizName.length; i++) { 
                if(this.state.resultCount.length<this.state.invite.yelpBizName.length){
                getCount(this.props.params.id, this.state.invite.yelpBizName[i]).then((obj) => {
                    var data = this.state.resultCount;
                    if (data.indexOf(obj) == -1) {
                    data.push(obj);
                    this.setState({
                    resultCount: data
                });
            }

                })
            }

            }
        }).then(()=>{
        fetch(`/api/get-attend-response-yes/${this.props.params.id}`, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then((response) => response.json())
            .then((results) => {

                var obj = {
                    name:'attend',
                    count:results.count,
                }    
                var arr = this.state.attendees.slice()
                arr.push(obj)
                this.setState({
                    attendees:arr
                })
         
            });
        }).then(()=>{
        fetch(`/api/get-attend-response-no/${this.props.params.id}`, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then((response) => response.json())
            .then((results) => {
                var obj = {
                    name:'not',
                    count:results.count,
                }    
                var arr = this.state.attendees.slice()
                arr.push(obj)
                this.setState({
                    attendees:arr
                })
         
            });
        }).then(()=>{
          var datesNewFormat = [];
          const dates = Array.from(datesBetween(new Date(this.state.invite.dateStart), new Date(this.state.invite.dateEnd)));
          for (var i = 0; i < dates.length; i++) { 
                var month = '' + (dates[i].getMonth() + 1),
                    day = '' + dates[i].getDate(),
                    year = dates[i].getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                datesNewFormat.push([year, month, day].join('-'));
          }
          this.setState({
            dateRange:datesNewFormat
          });

        }).then(()=>{
                function getDateCount(id,date){
        return fetch(`/api/get-date-response/${id}/${date}`, {
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then((response) => response.json())
            .then((results) => {
                var ppl=[];
                for (var i = 0; i < results.length; i++) { 
                    ppl.push(results.name)};
                var dateObj = {
                    date:date,
                    count:results.length,
                    people:ppl,
                }       
                if(results.count!=0){return dateObj};
         
            });
        }
            for (var i = 0; i < this.state.dateRange.length; i++) { 
                getDateCount(this.props.params.id,this.state.dateRange[i]).then((dateObj) => {
                    var dataDate = this.state.resultDateCount.slice();
                    if (dataDate.indexOf(dateObj) == -1) {
                    dataDate.push(dateObj);
                    this.setState({
                    resultDateCount: dataDate
                });
            }

                })
            

            }
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
                if(results.message !== "signed-in"){
                    browserHistory.push("/")
                } else {
                    this.setState({
                        user: results.user
                    })
                }
            }
        }).then(()=>{
            if(this.state.user.id !== this.state.invite.userID){
                browserHistory.push('/');
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
        fetch(`/api/get-response/${this.props.params.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => response.json())
        .then((results) => {
            
            this.setState({
                response:results
            });
            // console.log(results);
        });

        fetch(`/api/get-all-response/${this.props.params.id}`, {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then((response) => response.json())
        .then((results) => {
            
            this.setState({
                allresponse:results.count
            });
        });


    }

showCharts(){
    this.setState({
        showCharts:true,
    })
}

showText(){
    this.setState({
        showText:true,
    })
}


handleTabChange(value){
    this.setState({
      slideIndex: value,
    });
}
    render() {
        let appendResponse;
        if(this.state.response){
         appendResponse = this.state.response.map((response,index) => {
            if(response.attend==true){
              return (
                <div>
               <Card>
                <CardHeader
                  title={response.name}
                  subtitle="Attend"
                  avatar="https://t3.ftcdn.net/jpg/00/99/98/24/160_F_99982410_AbK4chh0bTDXinBKn2VPf2JUaHrqjX9j.jpg"
                />
                <CardText>
                <i>
                <span className="fui-calendar"></span><span>  </span> 
                {response.availableDate.map((date, index) => (
                <span>{date}; </span>
                  ))}
                <br/>
                <span className="fui-location"></span><span>  </span> 
                {response.chosenBiz.map((biz, index) => (
                <span>{biz}; </span>
                  ))}
                </i>
                <br/>
                <span className="fui-bubble"></span> <span>  </span> {response.note}
                </CardText>
              </Card>
              <br/>
              </div>
              )
            
          } else {
            return (
                <div>
             <Card >
                <CardHeader
                  title={response.name}
                  subtitle="Not Going"
                  avatar="https://upload.wikimedia.org/wikipedia/en/2/26/Disctemp-x.png"
                />
                <CardText>
                 <span className="fui-bubble"></span> <span>  </span> {response.note}
                </CardText>
              </Card>
              <br/>
              </div>)
          }
        })
     }
             let appendMyInvitesName;
        if(this.state.myInvites.length>0){
        appendMyInvitesName = this.state.myInvites.map((invite,index) => {
              return (
                <li  key={index}><a href={`/response/${invite.id}`}>{invite.title}</a></li>
              )
            
          })}

        const styles = {
          headline: {
            fontSize: 24,
            paddingTop: 16,
            fontWeight: 400,
          },
          slide: {
            padding: 10,
          },
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

            <h2>{this.state.invite.title}</h2>
                <form>
                  <div className="form-group row">
                    <label for="slink" className="col-sm-1">Link: </label>
                    <div className="col-sm-8">
                      <div className="form-group">
                        <div className="input-group">
                      <input type="text" className="form-control" id="slink" ref="link" value={`https://veat-app.herokuapp.com/invite/${this.props.params.id}`}/>
                      <span className="input-group-btn">

                        <button className="btn btn-default" type="button">Copy!</button>

                      </span>  
                      </div>                  
                    </div>
                    </div>
                  </div>
                </form>

                <div>
                <Tabs
                  onChange={this.handleTabChange}
                  value={this.state.slideIndex}
                >
                  <Tab label={`All Responses (${this.state.response.length})`} value={0} />
                  <Tab label="Analysis" value={1} onActive={this.showCharts.bind(this)}/>
                  <Tab label="Generate Final Invite" value={2} onActive={this.showText.bind(this)}/>
                </Tabs>
                <SwipeableViews
                  index={this.state.slideIndex}
                  onChangeIndex={this.handleChange}
                >
                  <div>
                    {appendResponse}
                  </div>
                  <div style={styles.slide}>
                 {this.state.showCharts && <div>
                <label>Attendees: </label>
                    <PieChart width={730} height={250}>
                  <Pie data={this.state.attendees} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#2ecc71" />
                 <Tooltip />
                 <Legend />
                </PieChart>
                <label>Restaurants: </label>
                <BarChart width={730} height={250} data={this.state.resultCount} barGap={1}>
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                   <Bar dataKey="people" fill="#8884d8" />
                </BarChart>
                <br/>
                  <BarChart width={730} height={250} data={this.state.resultDateCount} barGap={1}>
                  <XAxis dataKey="date" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2ecc71" />
                   <Bar dataKey="people" fill="#2ecc71" />
                </BarChart>
                <button onClick={this.showlog.bind(this)}>Click</button>
                </div>}
                              </div>
                  <div style={styles.slide}>
                {this.state.showText && 
                  <div>
                  
                  <TextField
                        fullWidth={true}
                          defaultValue={`Hi there! Please join me for ${this.state.invite.title} on ${this.state.dateRange} in ${this.state.invite.yelpBizName}.  Would love to see you there!`}
                          multiLine={true}
                          floatingLabelText="Invite Template"
                        /></div>}
                  </div>
                </SwipeableViews>
              </div>
             </div>
            </Paper>
 			</div>
            </div>
	    );
  	}
}