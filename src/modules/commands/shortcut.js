
module.exports.config = {
    name: 'shortcut',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Các lệnh của shortcut',
    tag: 'shortcut',
    usage: '!shortcut '
};
 
module.exports.run = async function (api, event, args, client) {
   prefix = process.env.PREFIX;
    msgs = `Các lệnh của Shortcut:\n`;
    msgs += `${prefix}creShort [tên short mới] (lưu ý rep lại hình ảnh hoặc video muốn tạo)\n\n`;
    msgs += `${prefix}short [tên shortcut]\n\n`;
    msgs += `${prefix}delShort [tên shortcut]\n\n`;
    api.sendMessage(msgs, event.threadID, event.messageID);
    
}
