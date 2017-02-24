var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var path = require('path');
var sa = require('superagent');
var logger = require('morgan');
var fs = require('fs');
var crypto = require('crypto');

var app = express();
var port = process.env.PORT || 8080;
var errorlogfile = fs.createWriteStream(__dirname + '/error.log', {flags : 'a'});
var errorlog = process.stdout;

var dbUrl = 'mongodb://'+ process.env.dbUser +':'+ process.env.dbPass +'@localhost:27017/itrix?authSource=admin';
var db = mongojs(dbUrl);
var registrations = db.collection('registrations');
var otps = db.collection('otps');
var payments = db.collection('payments');
var miscrecords = db.collection('miscrecords');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));
app.use(logger('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));
app.use(logger('dev'));

app.get('/', function(req, res) {
	res.send(index.html);
})

app.get('/checkregistered', function(req, res) {
	var number = req.query.number;
	console.log('Check if already registered, Mobile:', number);
	registrations.findOne({"mobile": number}, function(err, doc) {
		if(err)
		{
			console.log(err);
			errorlog.write(err+'\n');
		}
		else
		{
			if(doc)
			{
				console.log('Record pertaining to the requested number:\n', doc);
				res.send('registered');
			}
			else
			{
				var appKey = process.env.otpAppKey;
				var reqBody = {'countryCode': '91', 'mobileNumber': number, 'getGeneratedOTP': true};
				sa.post('https://sendotp.msg91.com/api/generateOTP').set('application-Key', appKey).send(reqBody).end(function(err, res) {
					if(err)
					{
						console.log(err);
						errorlog.write(err+'\n');
					}
					else
					{
						miscrecords.findOne({"otpApiCalls": {$exists: true}}, function(err, doc) {
							if(err)
							{
								console.log(err);
								errorlog.write(err+'\n');
							}
							else
							{
								if(doc)
								{
									var otpApiCalls = doc.otpApiCalls;
									miscrecords.update({"otpApiCalls": otpApiCalls}, {"otpApiCalls": otpApiCalls+1});
								}
								else
									miscrecords.insert({"otpApiCalls": 0});
							}
						})
						otps.update({"mobile": number}, {"mobile": number, "otp": res.body.response.oneTimePassword}, {"upsert": true});
						console.log('OTP response from sendOTP endpoint:', res.body.response.oneTimePassword);
					}
				});
				res.send('not registered');
			}
		}
	});
})

app.get('/verifyotp', function(req, res) {
	var number = req.query.number;
	var otp = req.query.otp;
	console.log('OTP Verification -', 'Number:', number, 'OTP:', otp);
	otps.findOne({"mobile": number}, function(err, doc) {
		if(err)
		{
			console.log(err);
			errorlog.write(err+'\n');
		}
		else
		{
			if(doc)
			{
				if(doc.otp == otp)
					res.send('true');
				else
					res.send('false');
			}
		}
	})	
})

app.post('/register', function(req, res) {
	if(!req.body.mobile || req.body.mobile == '')
		res.send('One or more values missing');
	console.log(req.body);
	registrations.insert(req.body, function(err) {
		if(err)
		{
			console.log(err);
			errorlog.write(err+'\n');
			res.send('Error occurred during registration');
		}
		else
		{
			console.log("New Student registration Successful");
			res.send("New Student registration Successful");
		}
	});
})

app.post('/paymentconfirmation', function(req, res) {
	console.log(req.body);
	var webhookobj = req.body;
	var mac_provided = req.body.mac;
	delete webhookobj.mac;
	var message = '';
	Object.keys(webhookobj).sort().forEach(function(v, i) {
		message = message + webhookobj[v] + '|';
	});
	message = message.substring(0, message.length - 1);
	mac_calculated = crypto.createHmac('sha1', process.env.pvtsalt).update(message).digest('hex');
	if(mac_calculated == mac_provided)
	{
		payments.insert(req.body);
		res.status(200).send('Thank You');
	}
	else
	{
		res.status(400).send('You are not authorised to perform this call');
	}
})

app.listen(port);
console.log('Server started!\n Listening now at http://localhost:' + port);
