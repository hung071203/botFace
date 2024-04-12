const os = require('os');
const fs = require('fs');
module.exports.config = {
    name: 'device',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Xem nền tảng bot đang chạy',
    usage: '!device'
};
 
module.exports.run = async function (api, event, args, client) {
    const totalMemory = os.totalmem();
    let msgs = `-------------------------------------------------------\n[Thông tin thiết bị chạy bot:]\n-------------------------------------------------------\n`
    
    const freeMemory = os.freemem();
    msgs += `Tên máy tính: ${os.hostname()}\n`
    msgs += `Phiên bản hệ điều hành: ${os.version()}\n`
    msgs += `Thông tin CPU: ${os.cpus()[0].model}, ${os.cpus().length} nhân\n`
    msgs += `Nền tảng: ${os.platform()} ${os.arch()}\n`
    msgs += `Dung lượng Ram còn trống: ${(freeMemory / Math.pow(1024, 3)).toFixed(2)} GB\n`
    msgs += `Tổng dung lượng RAM: ${(totalMemory / Math.pow(1024, 3)).toFixed(2)} GB\n`
    api.sendMessage(msgs, event.threadID, event.messageID)
    
}
