


module.exports.config = {
    name: 'qtv',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Chỉ qtv được dùng bot ',
    usage: '!qtv '
};
 
module.exports.run = async function (api, event, args, client) {
    console.log(process.env.QTVOL);
    if (process.env.QTVOL == 0 ) {
        
        let check = false;
        for (let i = 0; i < client.QTV.length; i++) {
            if (client.QTV[i].adminID == event.senderID || event.senderID == process.env.ADMIN) {
                process.env.QTVOL = 1;
                console.log('hgfds'+process.env.QTVOL);
                api.sendMessage('Chỉ quản trị viên có thể dùng bot đã bật!', event.threadID, event.messageID);
                check = false;
                break;
            }else{
                check = true;
            }
            
        }
        console.log('check '+check);
        if (check == true) {
            api.sendMessage('Chỉ quản trị viên mới có thể dùng lệnh này!', event.threadID, event.messageID);
        }
        

    }else{
        let check = false;
        for (let i = 0; i < client.QTV.length; i++) {
            if (client.QTV[i].adminID == event.senderID || event.senderID == process.env.ADMIN) {
                process.env.QTVOL = 0;
                console.log('hgfds'+process.env.QTVOL);
                api.sendMessage('Chỉ quản trị viên có thể dùng bot đã tắt!', event.threadID, event.messageID);
                check = false;
                break;
            }else{
                check = true;
            }
            
        }
        console.log('check '+check);
        if (check == true) {
            api.sendMessage('Chỉ quản trị viên mới có thể dùng lệnh này!', event.threadID, event.messageID);
        }
    }
    
    
}
