
module.exports.config = {
    name: 'prefix',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Hiện prefix của nhóm và hệ thống',
    tag: 'system',
    usage: '!prefix'
};
 
module.exports.run = async function (api, event, args, client) {
    let find = client.QTVOL.find(item => item.threadID == event.threadID)
    let msg = `→Prefix nhóm: ${find.prefix}\n→Prefix hệ thống: ${process.env.PREFIX}`
    api.sendMessage(msg, event.threadID, event.messageID)
    
}
module.exports.noprefix = function (api, event, args, client) {
    let find = client.QTVOL.find(item => item.threadID == event.threadID)
    let msg = `→Prefix nhóm: ${find.prefix}\n→Prefix hệ thống: ${process.env.PREFIX}`
    api.sendMessage(msg, event.threadID, event.messageID)
}
