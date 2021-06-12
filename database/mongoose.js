const mongoose = require('mongoose');
const userModel = require('../models/userInventory')

var connected = false; 
var connectionErr  = ''

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5, 
            connectTimeoutMS: 10000,
            family: 4
        };


        mongoose.connect(`mongodb+srv://discord-bot-xv:${process.env.PASS}@cluster0.guhjd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            connected = true;
        });

        mongoose.connection.on('disconnected', () => {
            connection = false;
        });

        mongoose.connection.on('err', (err) => {
            console.log('Following error occurred with the connection with the dataabase: ' + err);
            connectionErr = err;
        });
    },


    isConnected: () => {
        // return connected;
        if(connected === true) {
            return'The bot is current connected to the database'
        } else {
            return 'connection error: ' + connectionErr;
        }
    },




    // Reigsters users to the database
    //Needs to first check if a user exists and return a true or false
    // registerUser: (userID) => {
    //     let output = false;

    //     userModel.countDocuments({discordID: userID.id}, function (err, count){ 
    //         if(count>0){
    //             console.log('false triggered')
    //         } else {
    //             const newUser = new userModel({
    //                 discordID: userID.id
    //             })
    //             newUser.save();
    //             output = true;
    //         } 
    //        return output
    //     }); 

 
    //     return output;

    //    },



    /// Fix this function and remove the repeating code tomorrow
       registerUser2: (user) => {  
        const myPromise = new Promise((resolve, reject) => {
            userModel.countDocuments({discordID: user.id}, function (err, count) {
                if(count > 0){
                    reject(false)
                }
                else{
                    const newUser = new userModel({
                        discordID: user.id
                    
                    })
                    newUser.save();
                    resolve(true);
                }
            })
          });
          return myPromise
       },

       

       userExists: (user)=> {
        const myPromise = new Promise((resolve, reject) => {
            userModel.countDocuments({discordID: user.id}, function (err, count) {
                if(count > 0){
                    reject(false)
                }
                else{
                    resolve(true);
                }
            })
          });
          return myPromise
       } ,




       // Introduce update method that finds a user and then updates the field based on the user
       // Will incoperate better user roll interaction which will require the promise return.
       inserUserCard: (user, cardID) => {
            const myPromise = new Promise((resolve, reject) => {
           
                userModel.findOneAndUpdate({discordID: user.id}, 
                    {$push: {'CardID': cardID}},
                    {new: true}, (err, result) => {
                        console.log(result)
                    })
            })
        
       },

       getInventory: (user) => {
        const myPromise = new Promise((resolve, reject) => {
            userModel.findOne({discordID: user.id}, function (err, user) {
                console.log(error);
                resolve()
            })
        })
       }


       //Introduce a way to delete cards from a user's database. 
       //Find user and then update field based on the card they want to delete. 

}