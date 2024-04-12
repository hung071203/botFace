// tag.js

module.exports.config = {
    name: 'xoa',
    version: '1.0.0',
    credit: 'TênCủaBạn',
    description: 'Thu hồi tin nhắn bot',
    tag: 'system',
    usage: '!xoa'
};

module.exports.run = async function (api, event, args, client) {
    if(event.type != 'message_reply') return api.sendMessage('Đính kèm tin nhắn đã!', event.threadID, event.messageID)
    if(event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage('Chỉ thu hồi tin nhắn bot!', event.threadID, event.messageID)
    let find = client.handleReply.find(item => item.messageID == event.messageReply.messageID)
    let find2 = client.umessage.find(item => item.messageID == event.messageReply.messageID)
    if(find || find2) return api.sendMessage('Không thể xóa tin nhắn này!', event.threadID, event.messageID)
    api.unsendMessage(event.messageReply.messageID);
};


