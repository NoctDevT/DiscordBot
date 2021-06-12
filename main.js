const Discord = require('discord.js')
const client = new Discord.Client();
const sendEmbed = require('./bot-commands/sendEmbed')
const config = require('./config.json')
require('dotenv').config();

const mongoose = require('./database/mongoose')


const fetch = require("node-fetch");
const FiveStar = require('./data/5star')
const getTwitchStream = require('./Twitch-commands/getStream')
const getTwitchUser = require('./Twitch-commands/getUser')



client.login(process.env.TOKEN)



client.on('ready',() => {
    mongoose.init()
    // console.log(mongoose)
    // client.channels.cache.get('general').send('Hello here!')
    // console.log(GetRandom());
    // console.log(data[0])
})





client.on('message', message => {
    var prefix = 'xv'
    var user = message.member.user;
    commandHandler(prefix, user, message)
});


const commandHandler = async(prefix, user, message) => {
    const SpltString = message.content.toLowerCase().split(' ') 

    // const cmdWord = firstWord.slice(0, prefix.length)

    switch(SpltString[0]) {
        case `${prefix}roll`:
             if( await userExists(user) !== true) { 
                 RollGatcha({user: user, message: message});
                 } 
             else {message.channel.send('Please Register Using `XVregister`')}
        break;
        case `${prefix}trivia`:
            NumberFact({user: user, message: message});
        break;
        case `${prefix}help` || `${prefix}Help`:
             Commands({user: user, message: message});
        break;
        case `${prefix}status`:
            DBStatus(message);
        break;
        case `${prefix}register`:
            Register({user: user, message: message});
        break;
        case `${prefix}test`: 
             testerFunction({user: user, mesage: message});
        case `${prefix}inv`: 
        break;
        case `${prefix}alert`:
              addTwitch(message, SpltString[1]);
        break;
        case `${prefix}twitch`: 
        default:                 
        break;
    }
}



/// HANDLE ERROR HANDLING
const addTwitch = async(message,username) => {
    var streamData = await getTwitchStream(username).catch((error) => console.log(error));
    var userData = await getTwitchUser(username).catch((error)=> console.log(error));

    console.log(streamData);
    console.log(streamData.data[0]);

    if (streamData.data[0] === undefined){
        message.channel.send(` ${username} is not currently streaming`);
    } else {
        var streamimgURL = streamData.data[0].thumbnail_url;
        var image = streamimgURL.replace('{width}', 480).replace('{height}', 280);
    
        var embed = new Discord.MessageEmbed()
        .setAuthor(username)
        .setColor('#7D26CD')
        .setTimestamp()
        .setTitle(streamData.data[0].title)
        .setURL(`http://twitch.tv/${username}`)

        .addFields(
            { name: 'Twitch Status ', value: userData.data[0].broadcaster_type, inline: true },
            { name: 'View count ', value: userData.data[0].view_count, inline: true },
        )


        .setThumbnail(userData.data[0].profile_image_url)
        .setImage(image)
        .setFooter(`Playing : ${streamData.data[0].game_name}`)
        message.channel.send(embed)    
    }

    setTimeout(() => {
        addTwitch(message, username);
    }, 650000)
}









const testerFunction = async({user, message}) => {
    // var test = await mongoose.inserUserCard(user);
    let inventory = []; 
        FiveStar.map((data, index) => (
            console.log(data.CardDetails.ID)
        ))
}


const checkInventory = async(user, message) => {

}


const userExists = async(user) => {
    var isRegistered = await mongoose.userExists(user)
    .then(user => {return true})
    .catch(() => {return false});
    return isRegistered;
}


const Register = async({user, message}) => {
     var isRegistered = await mongoose.registerUser2(user)
     .then(user => {return user})
     .catch(() => {return false});


    var embed = new Discord.MessageEmbed()
    .setColor(0xFFFAF0)
    .setTitle(`Register`)
    .setFooter(`Prototype bot built by Xavier`)
    .setImage('https://media.tenor.com/images/fd153ad251600052ddaee51f90aee8de/tenor.gif')
    .setFooter('Prototype bot built by Xavier', 'https://media.tenor.com/images/204011a96ba3ca3648e3ae15ea444212/tenor.gif')
    .setDescription(isRegistered ? `<@${user.id}> is now registered to Atlas` : `You are already registered you sussy baka`);
    message.channel.send(embed)
}


const DBStatus = (message) => {
    var connectionStatus = mongoose.isConnected() 
    const embed = new Discord.MessageEmbed()
    .setColor(0xFFFAF0)
    .setTitle(`test`)
    .setFooter(`Prototype bot built by Xavier`)
    .setDescription(`${connectionStatus}`)           
    message.channel.send(embed)
}


const Commands = ({user, message}) => {
    const embed = new Discord.MessageEmbed()
    // .setAuthor(`@${user.tag}`, user.avatarURL())
    .setColor(0xFFFAF0)
    .setTitle(`Commands`)
    .setFooter(`Prototype bot built by Xavier`)
    .addFields(
        {
            name: `XVroll`,
            value:`Rolls for a summon`

        },
        {
            name: `XVtrivia`,
            value: `Number based trivia`, 
        }
    )
    .setImage('https://media.tenor.com/images/fd153ad251600052ddaee51f90aee8de/tenor.gif')
    .setFooter('Prototype bot built by Xavier', 'https://media.tenor.com/images/204011a96ba3ca3648e3ae15ea444212/tenor.gif')
    message.channel.send(embed)
    // .then(msg => {
    //     msg.delete({ timeout: 10000 })
    //   })

}



const NumberFact = ({user, message}) => {
     GetTrivia().then(response =>  {
        const embed = createEmbed({
            author: user, 
            color: 0xFFFAF0,
            description: ` ${response}`,
            footer: `Prototype bot built by Xavier`,
            image: 'https://media.tenor.com/images/fd153ad251600052ddaee51f90aee8de/tenor.gif'
        })
        message.channel.send(embed)})
}


const RollGatcha = async({user, message}) => {
    const roll = GenerateRoll();
    var card = roll[GetRandom(roll.length)]
    mongoose.inserUserCard(user, card.CardDetails.ID);

    const embed = createEmbed({
        author: user, 
        color: 0xFFFAF0, 
        description:`Brace yourselves. <@${user.id}> is rolling...`, 
        footer: `Prototype bot built by Xavier`, 
        image: 'https://media.tenor.com/images/fd153ad251600052ddaee51f90aee8de/tenor.gif'
     });


     const embed2 = new Discord.MessageEmbed()
     .setAuthor(`@${user.tag}` ,user.avatarURL())
     .setColor(0xFFFAF0)
     .setDescription(`<@${user.id}> rolled **${card.CardDetails.Name}!**`)
     .setTimestamp()
     .addFields({

        name: `Star Level:`,
        value: `${card.CardDetails.Stars}`,
        inline: true,

     }, 
     {
         name: `Condition:`,
         value: `${card.CardDetails.condition}`,
         inline: true,
     }
     )

     .setFooter(`Prototype bot built by Xavier`, 'https://media.tenor.com/images/204011a96ba3ca3648e3ae15ea444212/tenor.gif')
     .setImage(`${card.CardDetails.image}`);


     message.channel.send({ embed: embed }).then((msg) => {
        setTimeout(function () {
            msg.edit(embed2);
        }, 1000)
    })

}



const createEmbed = ({author, color, description, footer, image}) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(`@${author.tag}` ,author.avatarURL())
    .setColor(color)
    .setDescription(description)
    .setFooter(footer, 'https://media.tenor.com/images/204011a96ba3ca3648e3ae15ea444212/tenor.gif')
    .setImage(image);
    return embed;
}




const GenerateRoll = () => {
    var rollGen = GetRandom(100);
    return FiveStar

    // console.log(FiveStar[0].CardDetails.image)



    // if(rollGen < 10) return FiveStar[0]
    // if(rollGen < 20) return "4 star"
    // if(rollGen < 30) return "3 star"
    // if(rollGen < 40) return "2 star"
    //  return "1 star"


}





const GetRandom = (max) => {
    var random = Math.floor(Math.random() * max); 
    return random;
}

 const GetTrivia = () => { 
    return fetch(`http://numbersapi.com/${GetRandom(1000)}`).then( x => x.text()).then((data) => {return data; })
    .catch(error => console.warn(error))
}








        // const embed = new Discord.MessageEmbed()
        // .setAuthor(`@${user.tag}` ,user.avatarURL())
        // .setColor(0xFFFAF0)
        // .setDescription(`Brace yourselves. <@${user.id}> is rolling...`)
        // .setFooter(`Prototype bot built by Xavier`)
        // .setImage('https://media.tenor.com/images/fd153ad251600052ddaee51f90aee8de/tenor.gif')