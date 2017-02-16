var express = require('express')
var bodyParser = require('body-parser')
var mongojs = require('mongojs')
var path = require('path');
var sa = require('superagent')

var app = express()
var port = process.env.PORT || 8080

var dbUrl = 'mongodb://'+ process.env.dbUser +':'+ process.env.dbPass +'@localhost:27017/itrix?authSource=admin'
var db = mongojs(dbUrl)
var registrations = db.collection('registrations')
var otps = db.collection('otps')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('static'))

app.get('/', function(req, res) {
	res.send(index.html)
})

app.get('/checkregistered', function(req, res) {
	var number = req.query.number
	console.log('Entered number:',number);
	registrations.findOne({"mobile": number}, function(err, doc) {
		if(err)
			console.log(err);
		else
		{
			if(doc)
			{
				console.log(doc)
				res.send('registered')
			}
			else
			{
				var appKey = process.env.otpAppKey
				var reqBody = {}
				reqBody.countryCode = '91'
				reqBody.mobileNumber = number
				reqBody.getGeneratedOTP = true
				sa.post('https://sendotp.msg91.com/api/generateOTP').set('application-Key', appKey).send(reqBody).end(function(err, res) {
					if(err) console.log(err)
					else
					{
						otps.update({"mobile": number}, {"mobile": number, "otp": res.body.response.oneTimePassword}, {"upsert": true})
						console.log(res.body.response.oneTimePassword)
					}
				});
				res.send('not registered')
			}
		}
	});
})

app.get('/verifyotp', function(req, res) {
	var number = req.query.number
	var otp = req.query.otp
	console.log('Verify OTP values: ', number, otp)
	otps.findOne({"mobile": number}, function(err, doc) {
		if(err) console.log(err)
		else
		{
			if(doc)
			{
				console.log(doc)
				if(doc.otp == otp)
					res.send('true')
				else
					res.send('false')
			}
		}
	})	
})

app.post('/register', function(req, res) {
	var fname = req.body.fname
	var lname = req.body.lname
	var gender = req.body.gender
	var mobile = req.body.mobile
	var email = req.body.email
	var clg = req.body.clg
	var dept = req.body.dept
	var year = req.body.year
	console.log(req.body)
	registrations.insert({"fname": fname, "lname": lname, "gender": gender, "mobile": mobile, "clg": clg, "dept": dept, "year": year}, function(err) {
		if(err) console.log(err)
		else console.log("Student data loaded successfully!")
	});
	res.send('thanks for registration.')
})


app.listen(port)
console.log('Server started! At http://localhost:' + port)

