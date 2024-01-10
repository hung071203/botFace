const request = require('request');
const fs = require('fs');
const path = require('path');
const axios = require('axios');


module.exports.config = {
    name: 'dlq',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Đoán tướng liên quân ',
    tag: 'game',
    usage: '!dlq '
};

module.exports.run = async function (api, event, args, client) {
    return api.sendMessage('Tính năng tạm thời không khả dụng', event.threadID,event.messageID);
    request(`https://docs-api.jrtxtracy.repl.co/game/lienquanquiz`, (err, response, body) => {
        if (err) {
            console.error(err);
            return;
        }

        const data = JSON.parse(body);
        const img = data.skillimg;
        console.log(img);

        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '..','..','img',filename);

        axios({
            method: 'get',
            url: img,
            responseType: 'stream',
        })      
        .then(response => {
            // Ghi dữ liệu từ phản hồi vào một tệp tin
            response.data.pipe(fs.createWriteStream(filePath));
        
            // Bắt sự kiện khi tải xong
            response.data.on('end', () => {
                console.log('Ảnh đã được tải thành công và lưu vào:', filePath);

                const stream = fs.createReadStream(filePath);
                const msg = { 
                    attachment: stream, 
                    body: `${data.question} \n ${data.options_}`
                }
                api.sendMessage(msg, event.threadID,(error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    
                    client.handleReply.push({
                        type: 'lq',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        dapan: data.answer_,
                        t: data.answer,
                        c:data.skillname
                    })
                    
                    
                    
                }
                },event.messageID);

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
    });
}


module.exports.handleReply = async function (api, event, client, hdr) {
    if(event.type != 'message_reply') return;
    let check = hdr;
    if(!check) return;
    const dp = check.dapan.toLowerCase();
    console.log("chekkhdfudj");
    const id = client.money.find(item => item.ID == event.senderID&&item.threadID == event.threadID);
    if (id) {
        if (event.messageReply.messageID == check.messageID) {

            if (event.body.toLowerCase() == dp) {
            
                api.getUserInfo(event.senderID, (err, userInfo) => {
                    msgbody = `Chúc mừng ${userInfo[event.senderID].name} đã trả lời đúng, Skill này là ${check.c} của vị tướng ${check.t}\nBạn đã được thêm 100$ vào tài khoản`;
                    msg = {
                        body: msgbody,
                        mentions: [
                            {
                                tag: userInfo [event.senderID].name,
                                id: event.senderID
                            }
                            
                        ]
                    }
                    api.sendMessage(msg, event.threadID,event.messageID);
                    id.money += 100;
                })

                let check = client.handleReply.find(item => item.name == this.config.name);
                api.unsendMessage(check.messageID);
                client.handleReply = client.handleReply.filter(item =>item.messageID != event.messageReply.messageID );
            }else{
                api.sendMessage('Đoán sai rồi(-100$), đoán lại!', event.threadID,event.messageID);
                id.money -=100;
            }
        }
    }
}