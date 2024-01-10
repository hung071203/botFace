let fs = require('fs');
const https = require('https');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "res",
    version: "1.0.0",
    credits: "Ralph",
    description: "xem tn da go",
    tag: 'system',
    usage: "!res [người cần hiện tin nhắn vừa gỡ]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    let userID;
    
    const user = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if (user.money < 10000000) {
        api.sendMessage('Bạn quá nghèo thể làm điều này, tối thiểu cần 10,000,000!', event.threadID, event.messageID);
        return;
    }
    user.money -= 10000000;
    
    if (!client.unsend) {
        api.sendMessage('Thử lại sau!', event.threadID, event.messageID);
        return;
    }
    let Arr =[];

    if (args.length == 2 || Object.keys(event.mentions).length == 1) {
        userID = Object.keys(event.mentions)[0];
        client.unsend.forEach(e => {
            if (e.senderID == userID && e.threadID == event.threadID) {
                Arr.push(e.messageID);
            }
        });
    }else if (args.length == 1) {
        
        client.unsend.forEach(e => {
            if (e.threadID == event.threadID) {
                Arr.push(e.messageID);
            }
        });
    }else{
        api.sendMessage('Số lượng đối số không hợp lệ. Cách sử dụng: !res [tên người dùng(Có thể không cần)]', event.threadID, event.messageID);
        return;
    }
    
    if (Arr.length == 0) {
        api.sendMessage('Người dùng này không có tin nhắn nào thu hồi gần đây!', event.threadID, event.messageID);
        return;
    }
    
    const idm = Arr[Arr.length -1];
    if (!client.message) {
        api.sendMessage('vui lòng thử lại sau!', event.threadID, event.messageID);
        return;
    }
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}