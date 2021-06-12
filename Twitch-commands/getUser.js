require('dotenv').config();
const request = require('request');




const getToken2 = (url) => {
    const myPromise = new Promise((resolve, reject) => {
        const options = {
            url: process.env.GET_TOKEN,
            json: true,
            body:{
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        };
    
        console.log(options)
    
        request.post(options, (err,res,body) => {
            if(err) {
                return reject(error);
            }
            resolve(res.body.access_token)
            console.log(`Statis:' ${res.statusCode}`);
            console.log(body)
            // callback(res);
        });
    });
    return myPromise;
};

const getUser = (channelName, accessToken) => {
    const gameOptions = {
        url: `https://api.twitch.tv/helix/users?login=${channelName}`,
        method: 'GET',
        headers: {
            'client-id':process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
        }
    };

    const promise = new Promise((resolve, reject) => { 

        request.get(gameOptions, (err, res, body) => {
            if(err){
                return reject(err)
            }
            console.log(`status: ${res.statusCode}`);
            resolve(body)
        });
    })
    return promise;
};






var getUsers = async function getStreamData(TwitchName) {
    const AT = await getToken2(process.env.GET_TOKEN).then(user => {return user}).catch(() => {return false});
    var streamData =  JSON.parse(await getUser(TwitchName, AT).then(info => {return info}).catch(()=> {return false}));
    console.log(streamData);
    return streamData;

    // if(streamData.data === undefined){
    //     console.log("doesn't exist")
    // }else {
    // console.log(streamData.data[0].id)
    // }


    // var streamInfo = JSON.parse(streamData)
    // console.log(stream.data[0].id)
    // return streamInfo
    // console.log(JSON.parse(a));

    // getusers('Shadowgiri');
}


module.exports=getUsers