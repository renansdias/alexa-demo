const Alexa = require('alexa-sdk');

const jobs = require('./models/jobs')
const handlers = require('./models/handlers')
const languageStrings = require('./models/languages')

const APP_ID = process.env.APP_ID;

const jenkinsBaseUrl = process.env.JENKINS_BASE_URL;
const jenkinsJobToken = process.env.JENKINS_JOB_TOKEN;
const jenkinsUser = process.env.JENKINS_USER;
const jenkinsUserApiToken = process.env.JENKINS_USER_API_TOKEN;

exports.handler = (event, context) => {
	const alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.resources = languageStrings;
	alexa.registerHandlers(handlers);
    alexa.execute();
}

const buildBaseUrl = function(jobName, environment) {
	console.log("Building the base URL");

	const fullUrl = `http://${jenkinsUser}:${jenkinsUserApiToken}@${jenkinsBaseUrl}/job/${jobName}/buildWithParameters?token=${jenkinsJobToken}&ENVIRONMENT=${environment}`

	// const fullUrl = 'http://' + jenkinsUser 
	// 		            + ':' 
	// 					+ jenkinsUserApiToken 
	// 					+ '@' 
	// 					+ jenkinsBaseUrl 
	// 					+ '/job/'
	// 					+ jobs[service].folderName
	// 					+ '/job/'
	// 					+ jobs[service].jobType[jobType][environment]
	// 					+ '/'
	// 					+ 'buildWithParameters'
	// 					+ '?token=' 
	// 					+ jenkinsJobToken

	console.log("Full URL: " + fullUrl)

	return fullUrl;
}
