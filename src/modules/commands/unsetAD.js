module.exports.config = {
    name: 'unsetad',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Set admin',
    tag: 'ADMIN',
    usage: '!unsetad [Người dùng]'
};


module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN
    if(Object.keys(event.mentions).length == 0) return api.sendMessage('Tin nhắn sai cú pháp!', event.threadID, event.messageID)
    if(Object.keys(event.mentions).length > 1) return api.sendMessage('Chỉ set được 1 người 1 lúc!', event.threadID, event.messageID)

    const userID = Object.keys(event.mentions)[0];
    arrAD = adIDs.trim().split(' ');
    let check = arrAD.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không có quyền dùng chức năng này!', event.threadID, event.messageID)

    let find = arrAD.find(item => item == userID)
    if(find){
        process.env.ADMIN = process.env.ADMIN.replace(userID, '').trim();
        api.sendMessage('xóa Admin bot thành công!', event.threadID, event.messageID)
    }else{
        api.sendMessage('Người dùng này không phải quản trị viên!', event.threadID, event.messageID)
    }
}