module.exports.config = {
    name: 'timeBoxs',
    version: '1.0.0',
    credit: 'YourName',
    description: ' ',
    tag: 'ADMIN',
    usage: '!timeBox'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN

    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)
    let msgs ='---------------------------------------------'
    let i = 1
    client.botTime.sort((a, b) => a - b);
    client.botTime.forEach(e => {
        var d = new Date(e.time);
        var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        msgs += `${i}, ThreadID: ${e.threadID}\n   Thời gian còn lại: ${lDate}\n---------------------------------------------\n`
        i++
    });
    api.sendMessage(msgs, event.threadID, event.messageID)
}