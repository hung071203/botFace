let fs = require('fs');
const https = require('https');
const path = require('path');
const axios = require('axios');
const { time } = require('console');

module.exports.config = {
    name: 'sShortcut',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = async function (api, event, client) {

    if(!event) return;
    if(!event.body) return;
    let query = event.body;
    if(query.includes(process.env.PREFIX)) return;
    if(client.shortcut.length == 0) return;
    let find = client.shortcut.find(item => query.includes(item.name) && item.threadID == event.threadID);
    if(!find) return;

    if (find.type == 'video') {
        const response = await axios.get(find.url, { responseType: 'stream' });
        
        // Download file from URL
        const filename = `${Date.now()}.mp4`;
        const filePath = path.join(__dirname, '..','..','mp4',filename);

        
        const writeStream = fs.createWriteStream(filePath);
        response.data.pipe(writeStream);
        // Wait for the video to finish downloading
        await new Promise((resolve) => {
            writeStream.on('finish', resolve);
        });
        
        const stream = fs.createReadStream(filePath);
        // Gửi video
        msg = {
            body: `${find.name} \n`,
            attachment:stream
        }
        
        api.sendMessage(msg, event.threadID, event.messageID);
        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) {
                console.error('Error deleting file:', err);
                } else {
                console.log('MP4 file deleted successfully');
                }
            });
        }, 60000);
    } else if (find.type == 'photo') {
        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '..','..','img',filename);

        axios({
            method: 'get',
            url: find.url,
            responseType: 'stream',
        })      
        .then(response => {
            // Ghi dữ liệu từ phản hồi vào một tệp tin
            response.data.pipe(fs.createWriteStream(filePath));
        
            // Bắt sự kiện khi tải xong
            response.data.on('end', () => {
                console.log('Ảnh đã được tải thành công và lưu vào:', filePath);

                const stream = fs.createReadStream(filePath);
                msg = { 
                    attachment: stream, 
                    body: `${find.name} \n`
                }
                api.sendMessage(msg, event.threadID , (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        client.umessage.push({
                            type: 'unsend',
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                        })
                        
                    }
                }, event.messageID);

            });
        })
        .catch(error => {
            console.error('Lỗi khi tải ảnh:', error);
        });  

        

        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) {
                console.error('Error deleting file:', err);
                } else {
                console.log('img file deleted successfully');
                }
            });
        }, 60000);
    }
}