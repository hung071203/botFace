
module.exports.config = {
    name: "cbox",
    version: "1.0.0",
    credits: "Ralph",
    description: "Xem thông tin nhóm",
    tag: 'system',
    usage: "!cbox",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    api.getThreadInfo(event.threadID, (err, inf) =>{
        if (err) {
            console.log(err);
        }else{
            console.log(inf);
            let msg = `Thông tin nhóm: ${inf.threadName}\n`;
            msg += `Mã nhóm: ${inf.threadID}\n`;
            msg+= `Số lượng thành viên: ${inf.participantIDs.length}\n`;
            msg+= `Emoji đang dùng: ${inf.emoji}\n`;
            msg+= `Thread color: ${inf.color}\n`;
            msg+= `số tin nhắn trong nhóm: ${inf.messageCount}\n`;
            api.sendMessage(msg, event.threadID, event.messageID);

        }
    });
    
}