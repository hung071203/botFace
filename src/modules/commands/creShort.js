
module.exports.config = {
    name: 'creShort',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Tạo shortcut',
    tag: 'shortcut',
    usage: '!creShort [tên short]'
};
 
module.exports.run = async function (api, event, args, client) {
   if(event.type != 'message_reply') return api.sendMessage('Rep lại hình ảnh hoặc video muốn tạo short!', event.threadID, event.messageID);
   if(args.length == 1) return api.sendMessage('Tên short k được trống', event.threadID, event.messageID);
   console.log(event.messageReply);
   if (event.messageReply.attachments[0].type == 'video' || event.messageReply.attachments[0].type == 'photo') {
        let url = event.messageReply.attachments[0].url;
        let query = args.slice(1).join(" ");
        if (client.shortcut.length == 0) {
            client.shortcut.push({
                name: query,
                type: event.messageReply.attachments[0].type,
                url: url,
                threadID: event.threadID
            })
            
            api.sendMessage('shortcut đã thêm vào thành công!', event.threadID, event.messageID);
        }else{
            let find = client.shortcut.find(item => item.name == query && item.threadID == event.threadID);
            if(find) return api.sendMessage('shortcut này đã tồn tại!', event.threadID, event.messageID);
            client.shortcut.push({
                name: query,
                type: event.messageReply.attachments[0].type,
                url: url,
                threadID: event.threadID
            })
            api.sendMessage('shortcut đã thêm vào thành công!', event.threadID, event.messageID);
        }
   }else{
    api.sendMessage('Chỉ hỗ trợ hình ảnh hoặc video làm đầu vào!', event.threadID, event.messageID);
   }
    
}
