

module.exports.config = {
    name: 'check',
    version: '1.0.0',
    credit: 'TênCủaBạn',
    description: 'Kiểm tra thông tin bản thân',
    tag: 'system',
    usage: '!check'
};

module.exports.run = async function (api, event, args, client) {
    api.getUserInfo(event.senderID, (err, info) => {
        if (err) {
            console.error(err);
            api.sendMessage('Có lỗi khi truy vấn thông tin bạn, thử lại sau!', event.threadID, event.messageID)

        } else {
            console.log(info[event.senderID]);
            msgs =`🎄Dữ liệu cá nhân của ${info[event.senderID].name}:\n---------------------------------------------------------\n`
            msgs += `🪪ID người dùng: ${event.senderID}\n`
            msgs += `🆔Biệt danh: ${info[event.senderID].vanity}\n`
            msgs += `⛩️Liên kết TCN: ${info[event.senderID].profileUrl}\n`
            msgs += `🕵️Giới tính: ${info[event.senderID].gender}\n---------------------------------------------------------\n`
            msgs += '🎄Kiểm tra tương tác của nguời dùng:\n---------------------------------------------------------\n'
            let find = client.message.filter(item => item.senderID == event.senderID && item.threadID == event.threadID)
            if(!find){
                msgs +='Tương tác đi rồi kiểm tra lại!'
            }else{
                msgs +=`🎈Tổng số tin nhắn: ${find.length}\n`
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0)
                let day = find.filter(item => item.timestamp >= currentDate.getTime())
                msgs +=`🚲Số tin nhắn trong ngày: ${day.length}\n`
            }
            api.sendMessage(msgs, event.threadID, event.messageID)
        }
      });
}
