var path = require('path');

var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var models = require('../models');

module.exports = (app, passport) => {

	app.get('/', function(req,res){
		res.sendFile(path.join(__dirname, './../../client/public/index.html'));
	});

	app.get('/api/sign-up', function(req,res){
		if(req.user){
			res.json({message: 'signed-in', user_id: req.user.id});
		}
	});

	app.get('/api/sign-in', function(req,res){
		if(req.user){
			res.json({message: 'signed-in', user_id: req.user.id});
		}
	});

	app.post('/api/sign-up', function(req,res,next){
		passport.authenticate('local-signup', function(err, user, info){
			if (err) {
				return next(err);
			} else {
				res.json({user: user, info: info})
			}
		})(req, res, next);
	});

	app.post('/api/sign-in', function(req,res,next){
		passport.authenticate('local-signin', function(err, user, info){
		    if (err) {
		      	return next(err);
		    }
		    if (!user) {
		    	return res.json({ success : false, message : 'authentication failed', info: info });
		    }
		    req.login(user, function(err){
				if(err){
					return next(err);
				}
		      	return res.status(200).json({ success : true, message : 'authentication succeeded', object : user });        
			});
	  	})(req, res, next);
	});

	app.get('/api/signed-in', (req,res) => {
		if(req.user){
			res.json({message: 'signed-in', user: req.user});
		} else {
			res.json({message: 'no req.user'})
		}
	})

	app.delete('/api/logout', function (req, res) {
		req.session.destroy(function(){
			res.status(204).send();
		});
	});

	app.post('/api/post-submission', (req,res) => {
		if(req.body.title !== ''){
			models.Invite.create({
				userID:req.body.userID,
				host:req.body.host,
				title: req.body.title,
	            desc: req.body.desc,
	            dateStart: req.body.dateStart,
	            dateEnd:req.body.dateEnd,
	            yelpBiz:req.body.yelpBiz,
	            yelpBizName:req.body.yelpBizName,
			}).then(function(message){
				models.Invite.findAll({order: [
			            ['id', 'ASC']
			        ]}).then(function(res){
						res.json(res);
				});
			});
		} else {
			res.json({message: "null task"})
		}
	});


	app.post('/api/post-response', (req,res) => {
		if(req.body.name !== ''){
			models.Response.create({
			inviteId:req.body.inviteId,
            name: req.body.name,
            email:req.body.email,
            attend: req.body.attend,
            chosenBiz:req.body.chosenBiz,
            availableDate: req.body.availableDate,
            note:req.body.note
			}).then(function(message){
				models.Invite.findAll({order: [
			            ['id', 'ASC']
			        ]}).then(function(res){
						res.json(res);
				});
			});
		} else {
			res.json({message: "null task"})
		}
	});


	app.get('/api/get-invite/:id', (req,res) => {
		models.Invite.findAll(
			{
		    	where: 
		    	{
		    		id: req.params.id
		    	}
		    }
		).then(function(titles){
			console.log(titles)
			res.json(titles);
		});
	});

	app.get('/api/get-attend-response-yes/:id', (req,res) => {
		models.Response.findAndCountAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id,
		    		attend:true
		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});

	app.get('/api/get-attend-response-no/:id', (req,res) => {
		models.Response.findAndCountAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id,
		    		attend:false
		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});


	app.get('/api/get-response/:id', (req,res) => {
		models.Response.findAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id
		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});

	app.get('/api/get-date-response/:id/:date', (req,res) => {
		models.Response.findAndCountAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id,
		    		availableDate:req.params.date

		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});

	app.get('/api/get-all-response/:id', (req,res) => {
		models.Response.findAndCountAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id,


		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});

	app.get('/api/get-food-response/:id/:biz', (req,res) => {
		models.Response.findAndCountAll(
			{
		    	where: 
		    	{
		    		inviteId: req.params.id,
		    		attend:true,
		    		chosenBiz: { $contains: [req.params.biz] }

		    	}
		    }
		).then(function(names){
			console.log(names)
			res.json(names);
		});
	});


	app.get('/api/get-myInvite/:userID', (req,res) => {
		models.Invite.findAll(
			{
		    	where: 
		    	{
		    		userID: req.params.userID
		    	}
		    }
		).then(function(titles){
			console.log(titles)
			res.json(titles);
		});
	});

	app.get('*', function(req,res){
		res.sendFile(path.join(__dirname, './../../client/public/index.html'));
	});

}