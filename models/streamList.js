const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const TwitchSchema = new Schema({
    twitchUsername: String
});


const twitchSubscribe = mongoose.model("twitchSubscription", TwitchSchema );


module.exports = twitchSubscribe;