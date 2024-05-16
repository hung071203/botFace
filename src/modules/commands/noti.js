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
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return api.sendMessage(`Lỗi: ${err.message}`, event.threadID, event.messageID)
        arr.forEach(element => {
            if(!element.isGroup) return
            let find = client.QTVOL.find(item => item.threadID == element.threadID && item.timestamp > parseInt(element.timestamp))
            if(!find) return
            threads.push(element.threadID)
        });
    })
}