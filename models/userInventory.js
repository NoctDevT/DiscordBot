const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const userSchema = new Schema({
    discordID: String,
    CardID: []
});


const Users = mongoose.model("users", userSchema );


module.exports = Users;