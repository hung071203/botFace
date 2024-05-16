const dotenv = require('dotenv');
const fs = require('fs');

// Load file .env vào biến môi trường
dotenv.config();


module.exports.config = {
    name: 'unsetad',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Set admin',
    tag: 'ADMIN',
    usage: '!unsetad [Người dùng]'
};
const oldAD = process.env.DEV

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
        let arrADOld = oldAD.trim().split(' ');
        let findOldAd = arrADOld.find(item => item == userID)
        if(findOldAd) {
            console.log(oldAD);
            
            process.env.ADMIN = process.env.ADMIN.replace(event.senderID, '').trim();
            return api.sendMessage('M định xóa cha t á, m bị tước quyền QTV', event.threadID, event.messageID)
        }
        process.env.ADMIN = process.env.ADMIN.replace(userID, '').trim();
        api.sendMessage('xóa Admin bot thành công!', event.threadID, event.messageID)
    }else{
        api.sendMessage('Người dùng này không phải quản trị viên!', event.threadID, event.messageID)
    }

    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    envConfig.ADMIN = process.env.ADMIN;
    const envString = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
    fs.writeFileSync('.env', envString);
}