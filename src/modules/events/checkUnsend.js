const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

const filePath = path.join(__dirname, '..', '..', 'savefile', 'save.json');
const filePathU = path.join(__dirname, '..', '..', 'savefile', 'unsend.json');
module.exports.config = {
    name: 'unsend',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = async function (api, event, client) {
    if (!event) {
        return;
    }
    if (event.type == 'message' || event.type == 'message_reply' && event.isGroup == true) {
        
        if (client.unsend.length == 0) {
            try {
                const duLieuHienTaiJSON = fs.readFileSync(filePathU, 'utf8');
                client.unsend = JSON.parse(duLieuHienTaiJSON);
            } catch (err) {
                console.error('Lỗi khi đọc unsend file:', err);
            }
        }

        // Đọc dữ liệu hiện tại từ file (nếu có)
        if (client.message.length == 0) {
            try {
                const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
                client.message = JSON.parse(duLieuHienTaiJSON);
            } catch (err) {
                console.error('Lỗi khi đọc file:', err);
            }
    
        }
        // Thêm dữ liệu mới vào mảng hiện tại
        client.message.push(event);
        
        
        fs.writeFile(filePath + '.tmp', JSON.stringify(client.message, null, 2), { encoding: 'utf8' }, (err) => {
            if (err) {
                console.error('Lỗi khi lưu tien file:', err);
            } else {
                fs.rename(filePath + '.tmp', filePath, (err) => {
                    if (err) {
                        console.error('Lỗi khi đổi tên file:', err);
                    }
                });
            }
        });
    }
    const botID = api.getCurrentUserID();
    if (event.type == 'message_unsend' && event.senderID != botID) {
        
        // fs.readFile(filePath, 'utf8', (err, duLieuJSON) => {
        //     if (err) {
        //         console.error('Lỗi khi đọc file:', err);
        //     } else {
        //         // Chuyển đổi chuỗi JSON thành mảng đối tượng
        //         const dt = JSON.parse(duLieuJSON);
        //         const id = dt.find(item => item.messageID == event.messageID);
        //         if (id) {
        //             console.log('Dữ liệu từ file:', id);
                    
        //         }else{
        //             console.log('khong thay');
        //         }
                
        //     }
        // });
        

        client.unsend.push(event);
        fs.writeFile(filePathU, JSON.stringify(client.unsend, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                console.error('Lỗi khi lưu file:', err);
            } else {
                console.log('Dữ liệu đã được lưu vào file thành công.');
            }
        });
        let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);
        if(!checkQTV) return
        if(checkQTV.remess == 0) return;
        
        const idm = event.messageID;
        const id = client.message.find(item => item.messageID == idm);
        console.log(id);
        if (!id) {
            api.sendMessage('Dữ liệu tin nhắn đã bị xóa', event.threadID, event.messageID);
            return;
        }
        let msg;
        let arr =[];
        
        const IDS = Object.keys(id.mentions);
        for (let i = 0; i < IDS.length; i++) {
        arr.push({
                tag: id.mentions[IDS[i]],
                id: IDS[i]
        })
            
        }
        console.log(id.attachments.length);
        if (id.attachments.length>0) {
            if (id.attachments[0].type == 'video') {
                const response = await axios.get(id.attachments[0].url, { responseType: 'stream' });
        
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
                    body: `Nội dung tin nhắn vừ gỡ: \n${id.body}`,
                    mentions: arr,
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
                return;
            }else if (id.attachments[0].type == 'audio') {
                const filename = `${Date.now()}.mp3`;
                const filePath = path.join(__dirname, '..','..','mp3',filename);
                https.get(id.attachments[0].url, (res) => {
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
                api.sendMessage({ attachment: stream, body: `Nội dung tin nhắn vừ gỡ: \n${id.body}  \n-Thả tim tin nhắn này để thu hồi nội dung-` }, event.threadID,  (error, info) => {
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
        
                stream.on('end', () => {
                    fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('MP3 file deleted successfully');
                    }
                    });
                });   
                return;
            }else if (id.attachments[0].type == 'photo') {
                const filename = `${Date.now()}.png`;
                const filePath = path.join(__dirname, '..','..','img',filename);
        
                axios({
                    method: 'get',
                    url: id.attachments[0].url,
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
                            body: `Nội dung tin nhắn vừ gỡ: \n${id.body} \n-Thả tim tin nhắn này để thu hồi nội dung-`
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
                return;
            }
        }
        msg = {
            body: `Nội dung tin nhắn vừ gỡ: \n${id.body} \n-Thả tim tin nhắn này để thu hồi nội dung-`,
            mentions: arr
        }
        
        api.sendMessage(msg, event.threadID,  (error, info) => {
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
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
