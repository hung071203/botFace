let fs = require('fs');
const request = require("request");
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

exports.config = {
  name: 'tiktok',
  version: '0.0.1',
  hasPermssion: 2,
  credits: 'DC-Nam',
  description: '.',
  usage: 'Gửi đường dẫn video Tiktok',
  tag: 'Công cụ',
  cooldowns: 3
};
module.exports.run = async function (api, event, args, client) {
    api.sendMessage('Gửi đường dẫn video Tiktok là được ', event.threadID, event.messageID);
};

let stream_url = (url, format)=>axios.get(url, {
  responseType: 'arraybuffer'
}).then(res=> {
  const filename = generateRandomFilename(format);
  const filePath = path.join(__dirname, '..', '..', 'img', filename);

  fs.writeFileSync(filePath, res.data);
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi xóa tệp:', err);
        return;
      }
      console.log('Đã xóa tệp thành công:', filePath);
    });
  }, 1000 * 60);

  return fs.createReadStream(filePath);
});
module.exports.handleEvent = async function (api, event, client) {
  // Hàm được thực thi khi sự kiện xảy ra

  if (event.type == 'message') {
    // Kiểm tra xem đường dẫn có đoạn đầu là "https://vt.tiktok.com/" hay không
    const tiktokURL = 'tiktok.com/';
    const inputURL = event.body; // Giả sử args[0] là đường dẫn cần kiểm tra
    console.log(inputURL);
    console.log(inputURL.includes(tiktokURL));
    if (inputURL.includes(tiktokURL)) {
        // Nếu có, lấy toàn bộ đường dẫn
        const fullURL = inputURL;
        let res = await axios.post(`https://www.tikwm.com/api/`, {
            url: fullURL
        });
        console.log(res);
        let format = '.mp4';
        if(res.data.code == -1) return 
        let downloadLink = [res.data.data.play];
        if(res.data.data.images) {

          downloadLink = res.data.data.images
          if (res.data.data.images.length > 6) {
            downloadLink = res.data.data.images.slice(0, 6)
          }
          format = '.jpg';
        }

        const mp3 = res.data.data.music
        console.log(res.data, downloadLink);

        
        let attachment = []
        for (const link of downloadLink) {
          attachment.push(await stream_url(link, format))
        }
        
        api.sendMessage({
            body: `${res.data.data.title} \nTổng lượt xem: ${res.data.data.play_count}\nTim: ${res.data.data.digg_count} \nComment: ${res.data.data.comment_count}\n\n👉Thả tim tin nhắn để tải âm thanh!`,
            attachment: attachment
        }, event.threadID, (err, info) => {
          if (err) {
              console.error('Error sending message:', err);
          } 
          client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            linkMp3: mp3
          })
          
        
        }, event.messageID);
    }
}
}

function generateRandomFilename(format) {
  return crypto.randomBytes(16).toString('hex') + format;
}
module.exports.handleReply = async function (api, event, client, hdr) {
  if(event.type != 'message_reaction') return
  if(event.messageID != hdr.messageID) return
  if(event.reaction != '❤') return
  const filename = path.basename(hdr.linkMp3);
  const filePath = path.join(__dirname, '..', '..', 'mp3', filename);
  
  var callback = (filePath) => {
    api.sendMessage({
        body: ``,
        attachment: fs.createReadStream(filePath)
    }, event.threadID, (err, info) => {
      if (err) {
          console.error('Error sending message:', err);
      } 
      
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Error deleting file:', err);
          } else {
              console.log('MP4 file deleted successfully');
          }
      });
    
    }, event.messageID);

  };
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
        // Nếu tệp không tồn tại, tải xuống từ đường dẫn web
        request(encodeURI(hdr.linkMp3)).pipe(fs.createWriteStream(filePath))
            .on("close", () => callback(filePath));
    } else {
        // Nếu tệp đã tồn tại, gửi ngay lập tức
        callback(filePath);
    }
  });
  client.handleReply = client.handleReply.filter(item => item.messageID != hdr.messageID)
};

