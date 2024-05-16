
module.exports.config = {
    name: 'uid',
    version: '1.0.0',
    credit: 'TênCủaBạn',
    description: 'Lâý UID người dùng',
    usage: '!uid [tên người dùng/ghi đè tin nhắn]'
};
module.exports.run = async function (api, event, args, client) {
    if(event.type == 'message_reply'){
        if(!event.messageReply.senderID) return api.sendMessage('Không thể các định người gửi, thử lại!', event.threadID, event.messageID)
        api.sendMessage(event.messageReply.senderID, event.threadID, event.messageID)
    }else{
        if(Object.keys(event.mentions).length == 0){
            api.sendMessage(event.senderID, event.threadID, event.messageID)
        }else{
            msg = Object.keys(event.mentions).join('\n')
            api.sendMessage(msg, event.threadID, event.messageID)
        }
    }
}