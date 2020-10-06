const Alexa = require('ask-sdk');

const {
	LaunchRequestHandler,
	DeployIntentHandler,
	HelpIntentHandler,
	CancelAndStopIntentHandler
} = require('./handlers')

let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        DeployIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
      )
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};
