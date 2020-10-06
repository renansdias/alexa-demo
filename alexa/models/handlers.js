const request = require('request')
const util = require('util')
const jobs = require('./jobs')
const { landingPage } = require('./jobs')

const PRODUCTION = "production"
const STAGING = "production"
const DEPLOY = "deploy"
const LP = "landingPage"

var verified = false

module.exports = {
	'LaunchRequest': function() {
		this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_FULL_NAME"))
		this.emit(':tell', this.attributes['speechOutput'])
	},
	'DeployLandingPageProdIntent': function() {
		if (!verified) {
			this.attributes['name'] = "DeployLandingPageProdIntent"
			this.emit(":ask", this.t("DOUBLE_CHECK_DEPLOY", jobs[LP].spokenName, PRODUCTION))
		} else {
			verified = false
			fullUrl = buildBaseUrl(LP, jobs[LP].deploy.jobName, PRODUCTION)

			self = this

			request(fullUrl, function(err, res, body) {
				if (err != null) {
					console.log("Error: ")
					console.log(err)

					context.fail(err)
				}

				self.emit(':tell', self.t("JUST_BEEN_DEPLOYED", jobs[LP].spokenName, PRODUCTION))
			})
		}
	},
	'AMAZON.YesIntent': function() {
		verified = true

		this.emit(this.attributes['name'])
	},
	'AMAZON.NoIntent': function() {
		verified = false

		this.emit(":tell", "That's fine. Your request has been cancelled.")
	}
}