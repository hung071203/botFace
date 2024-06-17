module.exports.config = {
    name: 'unban',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hủy cấm người dùng dùng bot',
    tag: 'ADMIN',
    usage: '!unban [Người dùng]'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN
    if(event.type!= 'message_reply') return api.sendMessage('Vui lòng đính kèm tin nhắn người muốn hủy ban', event.threadID, event.messageID)

    const userID = event.messageReply.senderID
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)

    let find  = client.Ban.find(item => item.threadID == event.threadID && item.ID == userID)
    if(!find){
        return api.sendMessage('Người dùng này chưa từng bị ban!', event.threadID, event.messageID)
    }
    if (find.timestamp < parseInt(event.timestamp)) {
        return api.sendMessage(`Người dùng này không bị ban!`, event.threadID, event.messageID)
    }
    find.timestamp = parseInt(event.timestamp)
    api.sendMessage(`Gỡ ban thành công!`, event.threadID, event.messageID)
}