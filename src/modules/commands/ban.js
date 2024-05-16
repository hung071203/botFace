module.exports.config = {
    name: 'ban',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Cấm người dùng dùng bot, trả lời tn ng muốn ban',
    tag: 'ADMIN',
    usage: '!ban [thời gian(phút)] [Lý do]'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN
    if(event.type!= 'message_reply') return api.sendMessage('Vui lòng đính kèm tin nhắn người muốn ban', event.threadID, event.messageID)
    

    const userID = event.messageReply.senderID
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)
    if(isNaN(args[1])) return api.sendMessage('Thời gian ban phải là 1 số', event.threadID, event.messageID)
    let find  = client.Ban.find(item => item.threadID == event.threadID && item.ID == userID)
    let des = args.slice(2).join(" ")

    let timeBan = parseInt(args[1]) * 60 * 1000
    if(!find){
        client.Ban.push({
            threadID: event.threadID,
            ID: userID,
            des: des,
            timestamp: parseInt(event.timestamp) + timeBan
        })
        return api.sendMessage(`Ban người dùng thành công ${args[1]} phút !`, event.threadID, event.messageID)
    }
    find.timestamp += timeBan
    find.des = des
    api.sendMessage(`Người dùng này đã bị cấm dùng bot thêm ${args[args.length - 1]} phút`, event.threadID, event.messageID)
}