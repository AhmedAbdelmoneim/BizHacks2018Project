var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var cognitiveServices = require('botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

//Setting up QnA maker
var qnarecognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: '81484fa8-104e-417b-9ded-92952ae8d65d',
    subscriptionKey: '873988af65bd498285a485f557f8e9d8'});

// Setting up LUIS Recognizer
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/3ef1158b-3f7b-4960-98f6-94d62531b0f4?subscription-key=98b6d6a72718470c98e1a91f2a29dc67&verbose=true&timezoneOffset=-480&q=';
var recognizer = new builder.LuisRecognizer(model);

// Receive messages from the user and start the first dialogue
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hello, how can I help you");
	session.beginDialog('/startD')
});

// Manually set storage
bot.set('storage', new builder.MemoryBotStorage());

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Start first dialogue
bot.dialog('/startD', intents, function (session, args, next) {
	session.send('Hello! How can I help you?')
})

// Add QnA and LUIS recognizers
var intents = new builder.IntentDialog({ recognizers: [recognizer, qnarecognizer] });
bot.dialog('/startD', intents);

var qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [qnarecognizer],
    defaultMessage: 'Sorry, no match found!',
    qnaThreshold: 0.3
});

// Response to the Return Item Intent
intents.matches('Return Item', [
	function (session, args) {
		session.replaceDialog('returnItem');
	}
]);

// Answering Questions in the QnA maker knowledge base
intents.matches('qna', [
    function (session, args, next) {
        var answerEntity = builder.EntityRecognizer.findEntity(args.entities, 'answer');
        session.send(answerEntity.entity);
    }
]);

// Dialog for returning an item
bot.dialog('returnItem', [
    // Ask for ID number
    function (session) {
        builder.Prompts.text(session, "Please insert product ID number?");
    },

    // Ask for Date
    function(session, args) {
      var id = session.message.text;
      //  if (id) {
      //      var url = 'http://localhost:8000/21372';
      //      request(url,function(error,response,body){
      //          body = JSON.parse(body);
      //          temp = body;
      //          session.send(temp);
      //      });
      //      builder.Prompts.time(session, "Please provide purchase date)");
      // }
      builder.Prompts.time(session, "Please provide purchase date");
    },

    // Ask if item has been opened
    function(session) {
      builder.Prompts.confirm(session, "Have you opened this item? Please respond with yes or no");
    },

    // Confirmation
    function(session, results) {
      if (!results.response) {
        builder.Prompts.confirm(session, "Are you sure you want to return the item?");
      } else {
        session.endDialog('Sorry, this item can not be returned because the item has been opened');
      }
    },

    // Feedback
    function(session, results) {
      session.send("Looks like your item does qualify for a return, please follow through this link to submit an online form for your return request: www.bestbuy.ca/returnForm");
      var reply = new builder.Message()
                             .addAttachment({ fallbacktext: 'couldn', contentType: 'image/jpeg', contentUrl: "https://smallbiztrends.com/wp-content/uploads/2014/06/endicia.jpg"});
      session.endDialog(reply);
    },

    // End Dialog
    function (session, results) {
        session.endDialog('Sorry, this item does not seem to qualify for return as per our return policy');
    }
]);


// Answer if none of the intents match or no answer in QnA knowledge base
intents.onDefault([
  function(session){
      session.send('Sorry, but we can not seem to find an answer to your question at the present moment. For further assistance with this question please call 1-866-237-8289. When prompted by the operator, you can enter this code: "1728"');
	}
]);
