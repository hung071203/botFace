module.exports.config = {
    name: 'checkBT',
    version: '1.0.0',
    credit: 'TênCủaBạn',
    description: 'Kiểm tra thời hạn sử dụng bot của nhóm!',
    tag: 'system',
    usage: '!checkBT'
};

module.exports.run = async function (api, event, args, client) {
    let find = client.QTVOL.find(e => e.threadID == event.threadID)
    if(!find) return api.sendMessage('Không có thông tin nhóm này, thử lại!', event.threadID, event.messageID)
    var d = new Date(find.time);
    var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
    api.sendMessage(`Thời gian sử dụng bot của nhóm đến ${lDate}`, event.threadID, event.messageID)
}