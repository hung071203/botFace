

module.exports.config = {
    name: 'delShort',
    version: '1.0.0',
    credit: 'YourName',
    description: ' xoa shortcut',
    tag: 'shortcut',
    usage: '!delShort [tên shortcut]'
};
 
module.exports.run = async function (api, event, args, client) {
   if(args.length == 1) return api.sendMessage('Tên short k được trống', event.threadID, event.messageID);
    let query = args.slice(1).join(" ");
    let find = client.shortcut.find(item => item.name == query && item.threadID == event.threadID);
    if(!find) return api.sendMessage('shortcut không tồn tại!', event.threadID, event.messageID);
    client.shortcut = client.shortcut.filter(item => item.name != query);
    api.sendMessage('Xóa thành công', event.threadID, event.messageID);
}
