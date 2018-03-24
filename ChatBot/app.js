var restify = require('restify');
var builder = require('botbuilder');

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

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    //session.send("You said: %s", session.message.text);
     session.beginDialog('returnItem');
});

// Manually set storage
bot.set('storage', new builder.MemoryBotStorage());

// Dialog for returning an item
bot.dialog('returnItem', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! How Can I help you?');
    },
    // Ask for ID number
    function (session) {
        builder.Prompts.text(session, 'Please insert product ID number?');
    },

    // Ask for Date

    // Ask if item has been opened
    function(session) {
      builder.Prompts.confirm(session, "Have you opened this item? Please respond with yes or no");
    },

    // Confirmation
    function(session, results) {
      if (!results.response) {
        builder.Prompts.confirm(session, "Are you sure you want to return the item?");
      } else {
        session.endDialog(`Sorry, this item is not returnable`);
      }
    },

    // Feedback

    // End Dialog
    function (session, results) {
        session.endDialog(`Sorry, this item is not returnable`);
    }
]);
