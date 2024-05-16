module.exports.config = {
    name: 'add',
    version: '1.0.0',
    credit: 'YourName',
    description: ' thêm người dùng vào nhóm bằng link hoặc UID',
    tag: 'QTV',
    usage: '!add [link/UID]'
};
 
module.exports.run = async function (api, event, args, client) {
    if(!args[1]) return api.sendMessage('Thiếu link/UID', event.threadID, event.messageID)
    let id = ''
    if(event.attachments.length == 0 || !event.attachments[0].facebookUrl) {
        id = args[1]
    }else{
        id = event.attachments[0].target.id
    }
    console.log(id);

    let check = client.QTV.find(item => item.threadID == event.threadID && item.adminID == api.getCurrentUserID())
    if(!check) return api.sendMessage('Thêm người dùng vào nhóm thất bại, có thể do t không phải QTV, nếu đã thêm thử lại sau 5s!', event.threadID)
    msg = `Đã thêm người dùng!`
    
    api.addUserToGroup(id, event.threadID, (err) =>{
        if(err) {
            console.log(err)
            return api.sendMessage('Thêm người dùng vào lại nhóm thất bại!', event.threadID)
        }
        api.sendMessage(msg, event.threadID)
    })

}