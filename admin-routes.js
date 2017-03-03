module.exports = function(app, db)
{
	app.get('/admin', function(req, res) {
		if(req.cookies.remember)
		{
			res.render('admin-panel')
		}
		else
		{
			res.render('admin-login');
		}
	})

	app.post('/admin', function(req, res) {
		if(req.body.password == process.env.dbPass && req.body.username == process.env.dbUser)
		{
			res.cookie('remember', '1', {maxAge: 3600000*24*30, httpOnly: true, path: '/admin'});
			res.redirect('/admin');
		}
		else
		{
			res.send("Credentials don't match.");
		}
	})
	
	app.get('/admin/:listId', function(req, res) {
		if(req.params.listId == 'logout')
		{
			res.clearCookie('remember', {path: '/admin'});
			return res.redirect('/admin');
		}
		if(!req.cookies.remember) return res.redirect('/admin');
		routes = ['registrations', 'nlp', 'cogser', 'cloud', 'networking', 'robotics', 'allworkshops'];
		var registrations = db.collection('registrations');
		var payments = db.collection('payments');
		if(routes.indexOf(req.params.listId) == -1)
		{
			res.send(req.params.listId+' does not exist!');
		}
		else
		{
			if(req.params.listId == 'registrations')
			{
				registrations.find({}, function(err, docs) {
					if(err)
					{
						console.log(err);
						errorlog.write(err+'\n');
						res.send('Woah! An error occurred while trying to fetch User registrations.');
					}
					else
					{
						if(docs)
						{
							res.render(req.params.listId, {docs: docs});
						}
						else
						{
							res.send('Bummer! No user registrations found.');
						}
					}
				});
			}
			else
			{
				query = {};
				switch(req.params.listId)
				{
					case 'nlp':
						query.offer_title = 'NLP Workshop by IBM';
						break;
					case 'cogser':
						query.offer_title = 'Cognitive Service Workshop By Microsoft';
						break;
					case 'cloud':
						query.offer_title = 'Cloud & IOT Workshop by Oracle';
						break;
					case 'networking':
						query.offer_title = 'CISCO Networking Workshop';
						break;
					case 'robotics':
						query.offer_title = 'Mind-Controlled Robot Workshop';
						break;
					case 'allworkshops':
						break;
					default:
						res.send('Woah! An error occured while trying to fetch ' + req.params.listId + ' registrations.');
				}
				payments.find(query, function(err, docs) {
					if(err)
					{
						console.log(err);
						errorlog.write(err+'\n');
						res.send('Woah! An error occured while trying to fetch ' + req.params.listId + ' registrations.');
					}
					else
					{
						if(docs)
						{
							if(query.offer_title == undefined) query.offer_title = 'All Workshops';
							res.render('workshop', {docs: docs, workshop: query.offer_title});
						}
					}
				});
			}
		}
	})
}
