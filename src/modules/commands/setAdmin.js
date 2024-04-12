

module.exports.config = {
    name: 'setad',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Set admin',
    tag: 'ADMIN',
    usage: '!setad [Người dùng]'
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
    if(!find){
        newADIDs = `${adIDs} ${userID}`
        process.env.ADMIN = newADIDs.toString()
        api.sendMessage('Thêm Admin bot thành công!', event.threadID, event.messageID)
    }else{
        api.sendMessage('Người dùng này đã là quản trị viên!', event.threadID, event.messageID)
    }
}