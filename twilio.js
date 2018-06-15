'use strict';

const mongoose = require('mongoose');
const cfg = require ('../javascripts/app');


var accountSid = TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

const MessageSchema = new mongoose.Schema({
	loc: String,
	ppphone: Number,
	child: String,
});

// MessageSchema.statics.sendMessagess = function(callback) {
//   // now
//   const searchDate = new Date();
//   Message
//     .find()
//     .then(function(messages) {
//       messages = messages.filter(function(message) {
//               return message.requiresNotification(searchDate);
//       });
//       if (messages.length > 0) {
//         sendNotifications(messages);
//       }
//     });

function sendMessages(messages) {
    const client = new Twilio(accountSid, authToken);
    $("#arrived").on("submit", function(e){
    e.preventDefault();
            // Create options to send the message
            const options = {
                to: `+ ${message.ppphone}`,
                from: +17197223736,
                /* eslint-disable max-len */
                body: ${child}' has arrived at '${loc},
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phoneNumber.substr(0,
                        appointment.phoneNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        };

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
};


const Appointment = mongoose.model('appointment', AppointmentSchema);
module.exports = Appointment;

$("#arrived").on("submit", function(e){
    e.preventDefault();
    //twilio send message
      let msgData = {
        body: ${child}' has arrived at '${loc}
      }
    $.ajax({
      method: 'POST',
      url: '/msg',
      data: msgData,
      success: msgSuccess,
      error: msgError
    });
  });



client.messages
  .create({
     body: ${child}' has arrived at '${loc},
     from: '+17197223736',
     to: '++17193298921'
   })
  .then(message => console.log(message.sid))
  .done();



















