const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');
module.exports.config = {
    name: 'voice',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chuyển đổi văn bản thành giọng nói',
    tag: 'Công cụ',
    usage: '!voice [text]',
};

module.exports.run = async function (api, event, args, client) {
    const url = 'https://api.fpt.ai/hmi/tts/v5';
    const apiKey = 'NSS6f0oXFkN9roVSDQIcgKjM08FCtdig';
    const speed = '';
    const voice = 'ngoclam';

    // Kiểm tra số lượng đối số
    if (args.length === 1 && event.type !== 'message_reply') {
        api.sendMessage('Invalid number of arguments. Usage: !voice [text]', event.threadID, event.messageID);
        return;
    }

    // Lấy nội dung từ tin nhắn
    let text = args.slice(1).join(' ');
    if (event.type === 'message_reply') {
        const lastQuery = event.messageReply.body;
        text = `${args.slice(1).join(" ")}\n${lastQuery}`;
    }

    try {
        // Chuyển đổi văn bản thành giọng nói
        const headers = {
            'api-key': apiKey,
            'speed': speed,
            'voice': voice
        };

        const response = await axios.post(url, text, { headers: headers });
        console.log(response.data);
        sleep(1000);
        const asyncUrl = response.data.async;

        // Tải file từ URL không đồng bộ
        const filename = `${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '..', '..', 'mp3', filename);

        // await new Promise((resolve, reject) => {
        //     https.get(asyncUrl, (res) => {
        //         if (res.statusCode === 200) {
        //             const fileStream = fs.createWriteStream(filePath);
        //             res.pipe(fileStream);
        //             fileStream.on('finish', () => {
        //                 fileStream.close(resolve);
        //             });
        //         } else {
        //             console.error('Error downloading file from URL:', res.statusCode);
        //             reject(new Error('Failed to download file'));
        //             return
        //         }
        //     }).on('error', (err) => {
        //         console.error('Error during HTTPS GET request:', err);
        //         reject(err);
        //     });
        // });

        downloadFileWithRetries(asyncUrl, filePath)
            .then(async() => {
                console.log('File downloaded successfully')
                // Đợi file được tải xong
                while (!fs.existsSync(filePath)) {
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
            })
            .catch(err => console.error('Download failed:', err));
        

    } catch (error) {
        console.error('Error converting text to voice:', error);
        return api.sendMessage(`Lỗi: ${error.message}`, event.threadID, event.messageID);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFileWithRetries(asyncUrl, filePath, retries = 30, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await new Promise((resolve, reject) => {
                https.get(asyncUrl, (res) => {
                    if (res.statusCode === 200) {
                        const fileStream = fs.createWriteStream(filePath);
                        res.pipe(fileStream);
                        fileStream.on('finish', () => resolve());
                    } else {
                        reject(new Error(`Failed to download file, status code: ${res.statusCode}`));
                    }
                }).on('error', reject);
            });
            console.log('Download successful');
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === retries) {
                console.error('All download attempts failed');
                throw new Error('Failed to download file after multiple attempts');
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}