module.exports.config = {
    name: 'listad',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Hiện tất cả Admin bot',
    tag: 'system',
    usage: '!listad'
};
 
module.exports.run = async function (api, event, args, client) {
    
    let msg = '🎄Thông tin admin bot🎄\n---------------------------------------------------------------------\n'
    client.ADMIN.forEach(e => {
        let find = client.members.find(item => item.userID == e)
        if(!find){
            msg += `UID: ${e}\n`
            msg += `Liên kết TCN: https://www.facebook.com/${e}\n\n`
        }else{
            console.log(find);
            msg += `→Tên người dùng: ${find.name}\n`
            msg += `→Biệt danh: ${find.username}\n`
            msg += `(👉ﾟヮﾟ)👉Đường dẫn trang cá nhân: ${find.url}\n\n`
        }
        
    });
    api.sendMessage(msg, event.threadID, event.messageID)
}