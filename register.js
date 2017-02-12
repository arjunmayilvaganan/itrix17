var express = require('express')
var bodyParser = require('body-parser')
var mongojs = require('mongojs')
var path = require('path');

var app = express()
var port = process.env.PORT || 8080

var db = mongojs('mongodb://localhost:27017/itrix');
var registrations = db.collection('registrations');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('static'))

app.get('/', function(req, res) {
	res.send(index.html)
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
	db.registrations.insert({"fname": fname, "lname": lname, "gender": gender, "mobile": mobile, "clg": clg, "dept": dept, "year": year}, function(err) {
		if(err) console.log(err)
		else console.log("Student data loaded successfully!")
	});
	res.send('thanks for registration.')
})


app.listen(port)
console.log('Server started! At http://localhost:' + port)