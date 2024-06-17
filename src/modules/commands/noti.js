module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Thông báo đến các nhóm dùng bot còn hạn sử dụng',
    tag: 'DEV',
    usage: '!noti '
};


module.exports.run = async function (api, event, args, client) {
    
    let threads =[]
    let check = client.DEV.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không thể dùng chức năng này', event.threadID, event.messageID)
    if(args.length == 1) {
        client.handleReply = client.handleReply.filter(item => item.name != this.config.name)
        return api.sendMessage('Xóa dữ liệu thông báo thành công', event.threadID, event.messageID)
    }
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return api.sendMessage(`Lỗi: ${err.message}`, event.threadID, event.messageID)
        arr.forEach(element => {
            if(!element.isGroup) return
            
            let find = client.QTVOL.find(item => item.threadID == element.threadID && item.time > parseInt(element.timestamp))
            if(!find) return
            console.log(element);
            threads.push({
                threadID: element.threadID,
                name: element.name
            })
        });
        let messageIDs = []
        threads = threads.filter(item => item.threadID != event.threadID)
        threads.forEach(item => {
            console.log(item, 'log1');
            setTimeout(() =>{
                api.sendMessage(`📣Thông báo: ${args.slice(1).join(" ")}\nRep tin nhắn này để dửi về ADMIN!`, item.threadID, (err, data) =>{
                    if(err) {
                       return api.sendMessage(`Lỗi: ${err.message} nhóm có id ${item.threadID}`, event.threadID, event.messageID)
                    }
                    messageIDs.push(data.messageID)
                })
            }, 300)
            
        })
        client.handleReply.push({
            type: 'noti',
            name: this.config.name,
            messageID: messageIDs,
            author: event.senderID,
            auMessageID: event.messageID,
            threadID: event.threadID,
            threads: threads
        })
    })
}
module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.type != 'message_reply') return
    if(!event.messageReply.messageID) return
    console.log(hdr.messageIDs, 'log noti');
    if(!hdr.messageID.find(item => item == event.messageReply.messageID)) return
    
    
    let msg = ''
    switch (hdr.type) {
        case 'noti':
            let checkn = hdr.threads.find(item => item.threadID == event.threadID);
            if(!checkn) return api.sendMessage('Nhóm không tồn tại hoặc bot không trong nhóm đó, dùng gthread để biết chi tiết!', event.threadID, event.messageID)
            console.log(hdr);
            msg = `-----------------------------------------------------------------\n🎄Nhóm ${checkn.name} phản hồi thông báo của bạn:\n-----------------------------------------------------------------\n\n${event.body}\n\n-----------------------------------------------------------------\nReply tin nhắn này để phản hồi!`
            api.sendMessage(msg, hdr.threadID, (err, data) =>{
                if(err){
                   return api.sendMessage(`Lỗi khi gửi về admin: ${err.message}`, event.threadID, event.messageID)
                }
                client.handleReply.push({
                    type: 'rep',
                    name: this.config.name,
                    messageID: [data.messageID],
                    author: event.senderID,
                    auMessageID: event.messageID,
                    threadID: event.threadID,
                    threads: hdr.threads
                })
            }, hdr.auMessageID)
            break;
        case 'rep':
            let check = client.DEV.find(item => item == event.senderID)
            if(!check) return
            console.log(hdr);
            msg = `📣Dev phản hồi: ${event.body}\nReply tin nhắn này để phản hồi!`
            api.sendMessage(msg, hdr.threadID, (err, data) =>{
                if(err){
                   return api.sendMessage(`Lỗi khi gửi đến nhóm: ${err.message}`, event.threadID, event.messageID)
                }
                client.handleReply.push({
                    type: 'noti',
                    name: this.config.name,
                    messageID: [data.messageID],
                    author: event.senderID,
                    auMessageID: event.messageID,
                    threadID: event.threadID,
                    threads: hdr.threads
                })
            }, hdr.auMessageID)
            break
        default:
            break;
    }
}