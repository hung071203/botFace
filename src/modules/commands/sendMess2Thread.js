module.exports.config = {
    name: "s2t",
    version: "1.0.0",
    credits: "Ralph",
    description: "gui tin nhan den nhom ma bot o trong",
    tag: 'Threads',
    usage: "!s2t [threadID] [tin nhan]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if(args.length < 3) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
    let findUMN = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if(!findUMN) return api.sendMessage('Thử lại sau!', event.threadID, event.messageID)

    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return console.error(err);
        let thID =[]
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
        if(!check) return api.sendMessage('Nhóm không tồn tại hoặc bot không trong nhóm đó, dùng gthread để biết chi tiết!', event.threadID, event.messageID)
        const groupedText = args.slice(2).join(' ');
        if(findUMN.money < 100) return api.sendMessage('Cần tối thiểu 100$ để thực hiện hành động này!', event.threadID, event.messageID)
        findUMN.money -= 100
        let msg = `-----------------------------------------------------------------\n🎄Người dùng ${findUMN.name} từ nhóm ${checkn.name} gửi lời nhắn:\n-----------------------------------------------------------------\n\n${groupedText}`
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
            }
        }) 
        
    });
}