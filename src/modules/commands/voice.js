const googleTTS = require('google-tts-api');
const fs = require('fs');
const https = require('https');
const path = require('path');
module.exports.config = {
    name: 'voice',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chuyển đổi văn bản thành giọng nói',
    usage: '!voice [text]',
};

module.exports.run = async function (api, event, args, client) {
    // Kiểm tra số lượng đối số
    if (args.length < 2) {
        api.sendMessage('Invalid number of arguments. Usage: !voice [text]', event.threadID, event.messageID);
        return;
    }

    // Lấy nội dung từ tin nhắn
    const text = args.slice(1).join(' ');

    try {
        // Chuyển đổi văn bản thành giọng nói
        
        const url = googleTTS.getAudioUrl(text, {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com',
        });

        // Download file from URL
        const filename = `${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '..','..','mp3',filename);

        const download = await https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filePath));
            } else {
                console.error('Error downloading file from URL:', res.statusCode);
                api.sendMessage('Đã xảy ra lỗi trong quá trình tải file từ URL.', event.threadID, event.messageID);
            }
        });
        while(!fs.existsSync(filePath)){
            await sleep(500);
        }
        
        const stream = fs.createReadStream(filePath);
        // Gửi âm thanh
        api.sendMessage({ attachment: stream, body: '' }, event.threadID, event.messageID);

        stream.on('end', () => {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log('MP3 file deleted successfully');
              }
            });
        });
    } catch (error) {
        console.error('Error converting text to voice:', error);
        api.sendMessage('Đã xảy ra lỗi trong quá trình chuyển đổi văn bản thành giọng nói.', event.threadID, event.messageID);
    }
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
