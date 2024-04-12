module.exports.config = {
    name: 'ban',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Cấm người dùng dùng bot',
    tag: 'ADMIN',
    usage: '!ban [Người dùng] [thời gian(phút)]'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN
    if(Object.keys(event.mentions).length == 0 || isNaN(args[args.length - 1])) return api.sendMessage('Tin nhắn sai cú pháp!', event.threadID, event.messageID)
    if(Object.keys(event.mentions).length > 1) return api.sendMessage('Chỉ ban được 1 người 1 lúc!', event.threadID, event.messageID)

    const userID = Object.keys(event.mentions)[0];
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)

    let find  = client.Ban.find(item => item.threadID == event.threadID && item.ID == userID)
    let timeBan = parseInt(args[args.length - 1]) * 60 * 1000
    if(!find){
        client.Ban.push({
            threadID: event.threadID,
            ID: userID,
            timestamp: parseInt(event.timestamp) + timeBan
        })
        return api.sendMessage('Ban người dùng thành công!', event.threadID, event.messageID)
    }
    find.timestamp += timeBan
    api.sendMessage(`Người dùng này đã bị cấm dùng bot thêm ${args[args.length - 1]} phút`, event.threadID, event.messageID)
}