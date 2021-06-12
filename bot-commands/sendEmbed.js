const addReactions = (message, reactions) => {
    message.react(reactions[0])
    reactions.shift()
    if(reactions.length > 0 ) {
        setTimeout(() => addReactions(message, reactions), 750)
    }
}


module.exports = async (client, id, embed, reactions = []) => {
    const channel = await client.channels.fetch(id);

    channel.messages.fetch().then((messages) => {
        channel.send(embed).then(message => {
            addReactions(message, reactions)
            message.edit()
        })
    })
} 