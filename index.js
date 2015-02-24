var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	session = require('express-session'),
	cors = require('cors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('./server-assets/users/userModel'),
	gameController = require('./server-assets/game/gameController'),
	userController = require('./server-assets/users/userController'),
	port = 9011,
	databaseReference = "mongodb://localhost:27017/truthOrTruth2",
	connection = mongoose.connection;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'Quando omni flunkus moritati'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: '626195034163705',
	clientSecret: '49d3d82ad4dba3545189e631458e55d0',
	callbackURL: process.env.CALLBACK_URL || 'http://localhost:9011/auth/facebook/callback'
}, function(token, refreshToken, profile, done){
	User.findOne({'facebookId': profile.id}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			var user = newUser({
				name: profile.displayName,
				// emails: profile.emails,
				username: profile.username,
				provider: 'facebook',
				facebook: profile._json,
				facebookId: profile.id
			});
			user.save(function(err){
				if (err) console.log (err);
				return done(err, user);
			});
		} else {
			return done(err, user);
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user)
})

passport.deserializeUser(function(obj, done){
	done(null, obj)
})

var requireAuth = function(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.status(401).end();
	}
	next();
}

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/'}), function(req, res){
	res.status(200).end();
})
app.post('/api/create', gameController.addGame);
app.get('/api/player', function(req, res) {
	res.json(req.user)
})

connection.once('open', function(){
	app.listen(port, function() {
		console.log('listening at ' + port);
	});
	console.log('Connected at ' + databaseReference)
})