module.exports.config = {
    name: 'editbot',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Set admin',
    tag: 'ADMIN',
    usage: '!editbot [(avt [đính kèm ảnh ] [caption])/(bio [Nội dung bio] [public(true/false)])]'
};


module.exports.run = async function (api, event, args, client) {
    if(args.length == 1) return  api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID)
    const checkAD = client.ADMIN.find(item => item == event.senderID)
    if(!checkAD) return api.sendMessage('Bạn không phải admin bot!', event.threadID, event.messageID)

    switch (args[1].toLowerCase()) {
        case 'avt':
            if(event.type != 'message_reply') return  api.sendMessage('vui lòng reply tin nhắn', event.threadID, event.messageID)
            if(event.messageReply.attachments[0].type != 'photo') return  api.sendMessage('vui lòng reply ảnh', event.threadID, event.messageID)
            let msgs = args.slice(2).join(' ')
            api.changeAvt(event.messageReply.attachments[0].url, msgs, (err, data) =>{
                if(err){
                    api.sendMessage('Đổi avt trang cá nhân thất bại', event.threadID, event.messageID)
                }else{
                    api.sendMessage('Đổi avt trang cá nhân thanh công', event.threadID, event.messageID)
                }
            })

            break;
    
        case 'bio':
            let msg = args.slice(2).join(' ')
            let check = true
            if(args[args.length - 1] == true || args[args.length - 1] == false){
                msg = args.slice(2, -1).join(' ')
                check = args[args.length - 1]
            }
            api.changeBio(msg, check, (err, data) =>{
                if(err){
                    api.sendMessage('Đổi bio trang cá nhân thất bại', event.threadID, event.messageID)
                }else{
                    api.sendMessage('Đổi bio trang cá nhân thanh công', event.threadID, event.messageID)
                }
            })
            break;
        default:
            api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID)

            break;
    }
}