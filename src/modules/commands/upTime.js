const os = require('os');
const fs = require('fs');
const axios = require('axios');
const { format } = require('date-fns');
const { exec } = require('child_process');

const timeRun = Date.now()
module.exports.config = {
    name: 'upt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Xem nền tảng bot đang chạy',
    usage: '!upt'
};
 
module.exports.run = async function (api, event, args, client) {
    const totalMemory = os.totalmem();
    let msgs = `-------------------------------------------------------\n[Thông tin thiết bị chạy bot:]\n-------------------------------------------------------\n`
    const timeNow = Date.now(); // Thời điểm hiện tại
    const timeElapsed = timeNow - timeRun; // Thời gian đã trôi qua tính bằng mili giây

    // Chuyển đổi thời gian từ mili giây sang giờ, phút và giây
    const seconds = Math.floor((timeElapsed / 1000) % 60);
    const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
    const hours = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24);
    msgs += `⏱Thời gian hoạt động: ${hours}:${minutes}:${seconds}\n`
    const freeMemory = os.freemem();
    msgs += `💻Tên máy tính: ${os.hostname()}\n`
    msgs += `⏸️Phiên bản hệ điều hành: ${os.version()}\n`
    msgs += `©️Thông tin CPU: ${os.cpus()[0].model}, ${os.cpus().length} nhân\n`
    msgs += `📱Nền tảng: ${os.platform()} ${os.arch()}\n`
    msgs += `♈Dung lượng Ram còn trống: ${(freeMemory / Math.pow(1024, 3)).toFixed(2)} GB\n`
    msgs += `❄️Tổng dung lượng RAM: ${(totalMemory / Math.pow(1024, 3)).toFixed(2)} GB\n`
    const pingURL = async (url) => {
        try {
        
            const startTime = Date.now();
            await axios.get(url);
            const endTime = Date.now();
            const pingTime = endTime - startTime;
            msgs += `🪫Ping: ${pingTime}ms`
        } catch (error) {
            console.error(`Ping to ${url} failed: ${error.message}`);
            msgs += `🪫Ping: false`
        }

        
        const now = new Date();
        const formattedTime = format(now, 'HH:mm:ss || dd-MM-yyyy');
        msgs += `\n-------------------------------------------------------\n[Dữ liệu cập nhật lúc: ${formattedTime}]\n-------------------------------------------------------\n`
        return api.sendMessage(msgs, event.threadID, event.messageID)
    };
    
    return pingURL('https://www.google.com');
    
}
