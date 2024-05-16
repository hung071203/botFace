
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

    let adIDs = process.env.ADMIN.trim().split(' ');
    let checkADmin = adIDs.find(item => item == event.senderID)
    if (!checkADmin) {
        let id = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
        if(!id) return api.sendMessage('Chỉ QTV được dùng lệnh này', event.threadID, event.messageID);
    }
    
    if (checkQTV.checkid == 0) {
        let checkbot = client.QTV.find(item => item.threadID == event.threadID && item.adminID == api.getCurrentUserID())
        if(!checkbot) return api.sendMessage('vui lòng cho bot làm QTV. Nếu đã cho, vui lòng đợi 1p rồi thử lại!', event.threadID)
        checkQTV.checkid = 1;
        api.sendMessage('Đã bật QTV dùng bot!', event.threadID, event.messageID);
        console.log(checkQTV);
        return;
    }
    if (checkQTV.checkid == 1) {
        
        checkQTV.checkid = 0;
        api.sendMessage('Đã tắt QTV dùng bot!', event.threadID, event.messageID); 
        console.log(checkQTV);
    }
    
}
