module.exports.config = {
    name: 'setpf',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Hiện prefix của nhóm và hệ thống',
    tag: 'system',
    usage: '!setpf [dấu lệnh mới]'
};
 
module.exports.run = async function (api, event, args, client) {
    if (args.length != 2 ) return api.sendMessage(`Lỗi khi đặt prefix nhóm, thử lại!`, event.threadID, event.messageID)
    let find = client.QTVOL.find(item => item.threadID == event.threadID)
    find.prefix = args[1]
    api.sendMessage(`Dấu lệnh nhóm đã được đổi sang ${args[1]}`, event.threadID, event.messageID)
    
}
