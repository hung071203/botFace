module.exports.config = {
    name: "s2t",
    version: "1.0.0",
    credits: "Ralph",
    description: "gui tin nhan den nhom ma bot o trong",
    tag: 'Threads',
    usage: "!s2t [threadID] [tin nhan]",
};
  
  
module.exports.run = async function (api, event, args, client) {
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
        if(args.length < 3) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
        let check = thID.find(item => item.threadID == args[1]);
        let checkn = thID.find(item => item.threadID == event.threadID);
        if(!check) return api.sendMessage('Nhóm không tồn tại hoặc bot không trong nhóm đó, dùng gthread để biết chi tiết!', event.threadID, event.messageID)
        const groupedText = args.slice(2).join(' ');
        let msgs = `Người dùng có ID: ${event.senderID} từ nhóm ${checkn.name} gửi lời nhắn:\n${groupedText}`
        console.log(msgs);
        api.sendMessage(msgs, args[1], (error, info) => {
            if (error) {
                console.log(error);
                api.sendMessage('Gửi thất bại!', event.threadID, event.messageID)
            } else {
                api.sendMessage('Gửi tin nhắn thành công!', event.threadID, event.messageID)
            }})
    });
}