import React, { Component } from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import {BarChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Bar} from 'recharts';
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
            showCharts:true,


        };
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
            console.log(this.state.response)

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
            // console.log(results);
        });


    }




showCharts(){
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
                return obj;
                console.log(obj);
         
            });
    }
    

    for (var i = 0; i < this.state.invite.yelpBiz.length; i++) { 
        if(this.state.resultCount.length<this.state.invite.yelpBiz.length){
        getCount(this.props.params.id, this.state.invite.yelpBiz[i]).then((obj) => {
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
    if(this.state.resultCount.length != 0){
    this.setState({
        showCharts:!this.state.showCharts
    })}
}

    render() {
        let appendResponse;
        if(this.state.response){

         appendResponse = this.state.response.map((res,index) => {
            if(res.attend==true){
              return (
                <div>
                    <p>{res.name} is available on {res.availableDate} and says {res.note}</p>
                </div>
              )
            
          } else {
              return (
                <div>
                    <p>{res.name} will not attend </p>
                </div>
              )
            
            
            }
        })
     }

            // const { active } = this.props;

            // if (active) {
            //   const { payload, label } = this.props;
            //   return (
            //     <div className="custom-tooltip">
            //       <p className="label">{`${label} : ${payload[0].value}`}</p>
            //       <p className="intro">{this.getIntroOfPage(label)}</p>
            //       <p className="desc">Anything you want can be displayed here.</p>
            //     </div>
            //   );
            // }


	    return (

	    	<div className="container">
            <p>Hi</p>
            <button onClick={this.showlog.bind(this)}>yo</button>
            {appendResponse}
            <p>{this.state.allresponse} people are available</p>
            <button onClick={this.showCharts.bind(this)}>Show Charts</button>
            {!this.state.showCharts && <BarChart width={730} height={250} data={this.state.resultCount} barGap={1}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                   <Bar dataKey="people" fill="#8884d8" />
                </BarChart>}
 			</div>
	    );
  	}
}