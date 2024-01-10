module.exports.config = {
    name: 'arm',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Tự động gửi lại tin nhắn đã thu hồi ',
    tag: 'QTV',
    usage: '!arm'
};

module.exports.run = async function (api, event, args, client) {
    let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);
    let check = client.QTV.find(item => item.threadID == event.threadID && item.adminID == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quền dùng chức năng này', event.threadID, event.messageID);
    if (checkQTV.remess == 0) {
        checkQTV.remess = 1;
        api.sendMessage('Tự động gửi lại tin nhắn thu hồi đã bật!', event.threadID, event.messageID);
    } else if (checkQTV.remess == 1) {
        checkQTV.remess = 0;
        api.sendMessage('Tự động gửi lại tin nhắn thu hồi đã tắt!', event.threadID, event.messageID);
    }
}