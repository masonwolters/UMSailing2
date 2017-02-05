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
// var PythonShell = require('python-shell');

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
	
	var pyOptions = {
		args: uniqnames
	};

	var pyshell = new PythonShell('directory_remove.py', pyOptions);

	var string = "";
	pyshell.on('message', function(message) {
		string += message;
	});

	pyshell.end(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send(string);
		}
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
