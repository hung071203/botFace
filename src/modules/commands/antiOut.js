
module.exports.config = {
    name: 'antiout',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Bật, tắt anti out',
    tag: 'QTV',
    usage: '!antiout '
};
 
module.exports.run = async function (api, event, args, client) {
   
    let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);

    let adIDs = process.env.ADMIN.trim().split(' ');
    let checkADmin = adIDs.find(item => item == event.senderID)
    if (!checkADmin) {
        let id = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
        if(!id) return api.sendMessage('Chỉ QTV được dùng lệnh này', event.threadID, event.messageID);
    }
    let check = client.QTV.find(item => item.threadID == event.threadID && item.adminID == api.getCurrentUserID())
    if(!check) return api.sendMessage('Vui lòng thêm bot làm QTV', event.threadID, event.messageID)
    if (checkQTV.antiOut == true) {
        checkQTV.antiOut = false
        api.sendMessage('AntiOut đã tắt!', event.threadID, event.messageID);
        return;
    }
    if (checkQTV.antiOut == false) {
        checkQTV.antiOut = true
        api.sendMessage('AntiOut đã bật!', event.threadID, event.messageID);
    }
    
}