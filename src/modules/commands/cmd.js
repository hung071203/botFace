const { exec } = require('child_process');

module.exports.config = {
    name: 'cmd',
    version: '1.0.0',
    credit: 'YourName',
    description: ' chạy cmd',
    tag: 'DEV',
    usage: '!cmd [lenh]'
};


module.exports.run = async function (api, event, args, client) {
    let check = client.DEV.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không thể dùng chức năng này', event.threadID, event.messageID)
    let cmd = args.slice(1).join(' ')
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Lỗi: ${error}`);
            api.sendMessage(`Lỗi: ${error.message}`, event.threadID, event.messageID)
            return;
        }
        if (stderr) {
            console.error(`Lỗi: ${stderr}`);
            api.sendMessage(`Lỗi: ${stderr}`, event.threadID, event.messageID)
            return;
        }
        console.log(`${stdout}`);
        api.sendMessage(`${stdout}`, event.threadID, event.messageID)
    });
    
    
    
}