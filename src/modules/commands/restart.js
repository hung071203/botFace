const { exec } = require('child_process');

module.exports.config = {
    name: 'restart',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Khởi động lại bot',
    tag: 'DEV',
    usage: '!restart'
};


module.exports.run = async function (api, event, args, client) {
    let check = client.DEV.find(item => item == event.senderID)
    if(!check) return api.sendMessage('Bạn không thể dùng chức năng này', event.threadID, event.messageID)
    let seconds = 5;
    api.sendMessage(`hệ thống sẽ tự khởi động lại sau: 5 giây`, event.threadID, (error, data) => {
        if(error) return console.error(error);
        const interval = setInterval(() => {
            console.log(seconds);
            seconds--;
            api.editMessage(data.messageID, `hệ thống sẽ tự khởi động lại sau: ${seconds} giây`)
            
    
            if (seconds < 0) {
                clearInterval(interval);
                console.log('Hết giờ!');
                process.on('exit', (code) => {
                    if (code !== 0) {
                        //hmmmmmm
                    }
                });
                process.exit(1)
                // exec('npm run res', (error, stdout, stderr) => {
                //     if (error) {
                //         console.error(`Lỗi khi khởi động lại ứng dụng: ${error}`);
                //         return;
                //     }
                //     console.log(`Ứng dụng đã khởi động lại: ${stdout}`);
                // });
            }
        }, 1000);
    })
    
    
}