const request = require('request-promise')
const util = require('util')
const { landingPage } = require('./jobs')
const { buildBaseUrl } = require('./helper')

const PRODUCTION = "production"
const STAGING = "production"
const DEPLOY = "deploy"
const LP = "landingPage"

var verified = false

exports.LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to Deployment Manager - the coolest deployer out there. period.'

		return handlerInput.responseBuilder
		  .speak(speechText)
		  .getResponse();
	}
};  

exports.DeployIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& handlerInput.requestEnvelope.request.intent.name === 'DeployIntent';
	},
	async handle(handlerInput) {
		// console.log(util.inspect(handlerInput, {showHidden: false, depth: null}))
		const deployEnv = handlerInput.requestEnvelope.request.intent.slots.environment.value
		const fullUrl = buildBaseUrl(landingPage.deploy.jobName, deployEnv)
		let speechText

		const response = await triggerJenkins(fullUrl);
		console.log(response)

		if (response === 201) {
			speechText = `I was able to successfully trigger Jenkins to deploy the landing page to ${deployEnv}. I hope the build succeeds. It would be funny if it failed. haha.`
		} else {
			speechText = 'Unfortunately there was an error when triggering Jenkins. Go to the Jenkins console to check what happened.'
		}

		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

exports.HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const speechText = 'You can ask me to deploy the landing page to staging or production';

		return handlerInput.responseBuilder
		.speak(speechText)
		.getResponse();
	}
};
  
exports.CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
		&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
			|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = 'It was great serving you. Goodbye!';

		return handlerInput.responseBuilder
		.speak(speechText)
		.withShouldEndSession(true)
		.getResponse();
	}
};

async function triggerJenkins(uri) {
	const options = {
		uri: uri,
		resolveWithFullResponse: true
	};

	try {
		const response = await request(options);
		return response.statusCode;
	}
	catch (error) {
		return error;
	}
}

// module.exports = {
// 	'LaunchRequest': function() {
// 		this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_FULL_NAME"))
// 		this.emit(':tell', this.attributes['speechOutput'])
// 	},
// 	'DeployIntent': function() {
// 		if (!verified) {
// 			this.attributes['name'] = "DeployLandingPageProdIntent"
// 			this.emit(":ask", this.t("DOUBLE_CHECK_DEPLOY", jobs[LP].spokenName, PRODUCTION))
// 		} else {
// 			verified = false
// 			fullUrl = buildBaseUrl(LP, jobs[LP].deploy.jobName, PRODUCTION)

// 			self = this

// 			request(fullUrl, function(err, res, body) {
// 				if (err != null) {
// 					console.log("Error: ")
// 					console.log(err)

// 					context.fail(err)
// 				}

// 				self.emit(':tell', self.t("JUST_BEEN_DEPLOYED", jobs[LP].spokenName, PRODUCTION))
// 			})
// 		}
// 	},
// 	'AMAZON.YesIntent': function() {
// 		verified = true

// 		this.emit(this.attributes['name'])
// 	},
// 	'AMAZON.NoIntent': function() {
// 		verified = false

// 		this.emit(":tell", "That's fine. Your request has been cancelled.")
// 	}
// }