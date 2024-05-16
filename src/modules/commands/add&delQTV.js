module.exports.config = {
    name: 'editqtv',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chỉnh trạng thái QTV',
    tag: 'QTV',
    usage: '!editqtv [add/del] [@user]'
};
 
module.exports.run = async function (api, event, args, client) {
    if(args.length < 3) return api.sendMessage('Tin nhắn sai cú pháp!', event.threadID, event.messageID)
    if(checkQTV(client, event.threadID, api.getCurrentUserID()) == false) return api.sendMessage('Thêm bot làm QTV đi đã', event.threadID, event.messageID)
    let adIDs = process.env.ADMIN.trim().split(' ');
    let checkADmin = adIDs.find(item => item == event.senderID)
    if(!checkADmin){
        if(checkQTV(client, event.threadID, event.senderID) == false) return api.sendMessage('Bạn không phải QTV', event.threadID, event.messageID)
    }
    let arrID = []
    if(Object.keys(event.mentions).length == 0){
        if(args[args.length - 1] == 'me'){
            arrID.push(event.senderID)
        }else return api.sendMessage('Cần tag tối thiểu 1 người dùng!', event.threadID, event.messageID)
    } 
    
    switch (args[1]) {
        case 'add':
            Object.keys(event.mentions).forEach(ID => {
                if(checkQTV(client, event.threadID, ID)) return 
                arrID.push(ID)
            });
            api.changeAdminStatus(event.threadID, arrID, true, (err) =>{
                if (err) return console.error(err);
            });
            api.sendMessage(`Thêm ${arrID.length} người dùng làm QTV thành công`, event.threadID, event.messageID)
            break;
        case 'del':
            Object.keys(event.mentions).forEach(ID => {
                if(checkQTV(client, event.threadID, ID) == false) return 
                arrID.push(ID)
            });
            api.changeAdminStatus(event.threadID, arrID, false, (err) =>{
                if (err) return console.error(err);
            });
            api.sendMessage(`Hủy ${arrID.length} người dùng khỏi QTV thành công`, event.threadID, event.messageID)
            break;
        default:
            api.sendMessage('Tin nhắn sai cú pháp!', event.threadID, event.messageID)
            break;
    }
}
function checkQTV(client, threadID, ID) {
    let check = client.QTV.find(item => item.threadID == threadID && item.adminID == ID)
    if(!check) return false
    return true
}