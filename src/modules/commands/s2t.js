module.exports.config = {
    name: "s2t",
    version: "1.0.0",
    credits: "Ralph",
    description: "gui tin nhan den nhom ma bot o trong",
    tag: 'Threads',
    usage: "!s2t [threadID] [tin nhan]",
};
  
let thID =[]
module.exports.run = async function (api, event, args, client) {
    if(args.length < 3) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
    let findUMN = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!findUMN) return api.sendMessage('Thử lại sau!', event.threadID, event.messageID)

    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return api.sendMessage(`Lỗi: ${err.message}`, event.threadID, event.messageID)
        
        arr.forEach(thread => {
            if (thread.isGroup) {
                thID.push({
                    threadID: thread.threadID,
                    name: thread.name
                })
                
            }
        });
        let check = thID.find(item => item.threadID == args[1]);
        let checkn = thID.find(item => item.threadID == event.threadID);
        if(!check || !checkn) return api.sendMessage('Nhóm không tồn tại hoặc bot không trong nhóm đó, dùng gthread để biết chi tiết!', event.threadID, event.messageID)
        const groupedText = args.slice(2).join(' ');
        if(findUMN.money < 100) return api.sendMessage('Cần tối thiểu 100$ để thực hiện hành động này!', event.threadID, event.messageID)
        findUMN.money -= 100
        let msg = `-----------------------------------------------------------------\n🎄Người dùng ${findUMN.name} từ nhóm ${checkn.name} gửi lời nhắn:\n-----------------------------------------------------------------\n\n${groupedText}\n\n-----------------------------------------------------------------\nReply tin nhắn này để phản hồi!`
        let msgs ={
            body: msg,
            mentions:[{
                tag: findUMN.name,
                id: event.senderID
            }]
        }
        api.sendMessage(msgs, args[1], (error, info) => {
            if (error) {
                console.log(error);
                api.sendMessage('Gửi thất bại!', event.threadID, event.messageID)
            } else {
                api.sendMessage(`Gửi tin nhắn thành công tới nhóm ${check.name}!`, event.threadID, event.messageID)
                client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    auMessageID: event.messageID,
                    threadID: event.threadID,
                    toThreadID: args[1]
                })
            }
        }) 
        
    });
}

module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.type != 'message_reply') return
    if(!event.messageReply.messageID) return
    if(event.messageReply.messageID != hdr.messageID) return
    let checkMN = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!checkMN) return api.sendMessage('Thử lại sau!', event.threadID, event.messageID)
    if(checkMN.money < 100) return api.sendMessage('Cần tối thiểu 100$ để thực hiện hành động này!', event.threadID, event.messageID)
    checkMN.money -= 100
    let check = thID.find(item => item.threadID == hdr.threadID);
    let checkn = thID.find(item => item.threadID == event.threadID);
    if(!check || !checkn) return api.sendMessage('Nhóm không tồn tại hoặc bot không trong nhóm đó, dùng gthread để biết chi tiết!', event.threadID, event.messageID)
    let msg = `-----------------------------------------------------------------\n🎄Người dùng ${checkMN.name} từ nhóm ${checkn.name} phản hồi tin nhắn:\n-----------------------------------------------------------------\n\n${event.body}\n\n-----------------------------------------------------------------\nReply tin nhắn này để phản hồi!`
        let msgs ={
            body: msg,
            mentions:[{
                tag: checkMN.name,
                id: event.senderID
            }]
        }
        api.sendMessage(msgs, hdr.threadID, (error, info) => {
            if (error) {
                console.log(error);
                api.sendMessage('Gửi thất bại!', event.threadID, event.messageID)
            } else {
                api.sendMessage(`Gửi tin nhắn thành công tới nhóm ${check.name}!`, event.threadID, event.messageID)
                client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    auMessageID: event.messageID,
                    threadID: event.threadID,
                    toThreadID: hdr.threadID
                })
            }
        }, hdr.auMessageID) 

}