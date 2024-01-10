
module.exports.config = {
    name: 'qtv',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Chỉ qtv được dùng bot (bật/tắt)',
    tag: 'QTV',
    usage: '!qtv '
};
 
module.exports.run = async function (api, event, args, client) {
   
    let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);
    console.log(checkQTV);
    if (checkQTV.checkid == 0) {
        let id = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
        if(!id) return api.sendMessage('Chỉ QTV được dùng lệnh này', event.threadID, event.messageID);
        checkQTV.checkid = 1;
        api.sendMessage('Đã bật QTV dùng bot!', event.threadID, event.messageID);
        console.log(checkQTV);
        return;
    }
    if (checkQTV.checkid == 1) {
        let id = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
        if(!id) return api.sendMessage('Chỉ QTV được dùng lệnh này', event.threadID, event.messageID);
        checkQTV.checkid = 0;
        api.sendMessage('Đã tắt QTV dùng bot!', event.threadID, event.messageID); 
        console.log(checkQTV);
    }
    
}
