var words = require( './command.json' );

exports.init = function() {
	console.log('\x1b[96mCommand plugin is initializing ... \x1b[0m');
};

exports.dispose  = function() {
	console.log('\x1b[96mCommand plugin is disposed ... \x1b[0m');
};

exports.action = function(data, next) {
	if ( data.mode && (data.mode == "COMMAND") )
		return actionCommand(data, next);

	commandError(next);
};

var commandError = function(next) {
	var toSpeak = '';
	var availableTTS = words["command_error"];
	if (Object.keys(availableTTS).length > 0) {
		var choice = Math.floor(Math.random() * Object.keys(availableTTS).length); 
		toSpeak = availableTTS[choice];
	}

	next({'tts': toSpeak});
};

var actionCommand = function(data, next) {
	console.log('\x1b[91mmode=COMMAND \x1b[0m');

	var pluginProps = Config.modules.command;

	var textTTS = new Array;
	var toExecute = null;

	switch (data.cmd)
	{
		case "runKodi":
		{
			toExecute = '%CD%/plugins/command/bin/runKodi.bat';
			textTTS = words["kodi_on"];
			break;
		}
		case "closeKodi":
		{
			toExecute = '%CD%/plugins/command/bin/closeKodi.bat';
			textTTS = words["kodi_off"];
			break;
		}
	}

	var exec = require('child_process').exec;

	var child = exec(toExecute, function (error, stdout, stder) {
		console.log(toExecute);
	});

	if (Object.keys(textTTS).length > 0) {
		var choice = Math.floor(Math.random() * Object.keys(textTTS).length);
		next({'tts': textTTS[choice]});
	}
	else
		next({});
};
