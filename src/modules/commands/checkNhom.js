
module.exports.config = {
    name: "cbox",
    version: "1.0.0",
    credits: "Ralph",
    description: "Xem thông tin nhóm",
    tag: 'system',
    usage: "!cbox",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let find = client.QTVOL.find(e => e.threadID == event.threadID)
    if(!find) return api.sendMessage('Không có thông tin nhóm này, thử lại!', event.threadID, event.messageID)
    var d = new Date(find.time);
    var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
    
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
            msg+= `Thời gian sử dụng bot của nhóm đến ${lDate}`
            api.sendMessage(msg, event.threadID, event.messageID);

        }
    });
    
}