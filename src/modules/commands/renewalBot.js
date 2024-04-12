module.exports.config = {
    name: 'giahan',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Gia hạn thời gian dùng bot',
    tag: 'ADMIN',
    usage: '!giahan [mã nhóm(nếu cần)] [thời gian(ngày)]'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)

    let threadID = ''
    let time = 0
    if(args.length == 2){
        threadID = event.threadID
        if(isNaN(args[1])) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
        time = parseInt(args[1]) * 24 * 60 *60 * 1000
    }else{
        threadID = args[1]
        if(isNaN(args[2])) return api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
        time = parseInt(args[2]) * 24 * 60 *60 * 1000
    }

    let find  = client.QTVOL.find(e => e.threadID == threadID)
    if(!find) return api.sendMessage('Nhóm không tồn tại!', event.threadID, event.messageID)
    find.time = parseInt(event.timestamp) + time
    api.sendMessage('Gia hạn cho nhóm thành công!', event.threadID, event.messageID)
}