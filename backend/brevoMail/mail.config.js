const Brevo = require("@getbrevo/brevo");

const client = new Brevo.TransactionalEmailsApi();

client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

module.exports = client;
