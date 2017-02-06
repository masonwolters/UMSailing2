// # Ghost bootloader
// Orchestrates the loading of Ghost
// When run from command line.

var express,
    ghost,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');
var PythonShell = require('python-shell');

const path = require('path');
var Nightmare = require('nightmare');
require("nightmare-xpath");

// Create our parent express app instance.
parentApp = express();

parentApp.get('/test-static', function(req, res) {
	res.send('hi');
});

parentApp.get('/directory-remove', function(req, res) {
	var secret = "ekHyXzbRqzsE3t3Ta3ri";
	if (req.query.secret != secret) {
		res.send('Not Authenticated');
		return;
	}
	
	var uniqnames = req.query.uniqnames.split(',');
	
	var nightmare = Nightmare({
		webPreferences: {
			preload: path.resolve('preload.js')
		}
	});

	nightmare.goto('https://weblogin.umich.edu/?factors=UMICH.EDU&cosign-webdirectory.mc.itd&https://mcommunity.umich.edu/#group/members:Sailing%20Recruits')
	  .wait('#login')
	  .insert('#login', 'woltersm')
	  .insert('#password', 'Dunedain9723')
	  .click('#loginSubmit')
	  .wait('#memberPeopleContent')
	  .select('#memberPeopleContent select', '500')
	  .wait(1)
	  .evaluate(function(uniqs) {
	  	success = [];
	  	error = []

	  	for (var i = 0; i < uniqs.length; i++) {
	  		var uniqname = uniqs[i];
	  		var node;
		  	var xpathResult = document.evaluate("//div[@class='uniqname' and text()='"+uniqname+"']/../../../..//input[@type='checkbox']", document, null, XPathResult.ANY_TYPE, null);
		  	node = xpathResult.iterateNext();
		  	while (node && (node.name == 'owner' || node.name == 'moderator' || node.name == 'member')) {
		  		node = xpathResult.iterateNext();
		  	}
		  	if (node) {
		  		node.click();
		  		success.push(uniqname);
		  	} else {
		  		//Doesn't exist
		  		error.push(uniqname);
		  	}
	  	}

	  	var button = document.getElementsByClassName('removeHolder')[0].childNodes[1].childNodes[0];
	  	button.click();

	  	return {
	  		'success': success,
	  		'error': error
	  	}
	  	
	  }, uniqnames)
	  .end()
	  .then(function(result) {
	  	res.send(JSON.stringify(result));
	  });
});

ghost().then(function (ghostServer) {
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    // Let ghost handle starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});

var myHelpers = require('./myHelpers.js');

myHelpers();
