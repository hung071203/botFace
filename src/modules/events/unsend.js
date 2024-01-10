module.exports.config = {
    name: 'unsends',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'us',
    usage: ''
}



module.exports.run = async function (api, event, client) {
    if(!event) return;
    if (!client.umessage || event.type != 'message_reaction') return;
    const id = client.umessage.find(item => item.type == 'unsend' && item.messageID == event.messageID);
    if(!id) return;
    if (!event.reaction == '❤') return;
    let argsAD = process.env.ADMIN.trim().split(' ');
    let checkAD = argsAD.find(item => item == event.userID)
    if (id.author == event.userID || checkAD) {
        api.unsendMessage(event.messageID);
    }

}