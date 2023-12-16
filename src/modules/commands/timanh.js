const request = require('request');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "simg",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tìm hình ảnh qua tên",
    usage: "!simg [tên muốn tìm]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    if(args.length == 1){
        api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
        return;
    }
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if (id.money<150) {
        api.sendMessage('Bạn quá nghèo để thực hiện hành động này!', event.threadID, event.messageID);
        return;
    }
    id.money -= 150;
    let query = args.slice(1).join(" ");
    let pathimgs =[];
    request(`https://docs-api.jrtxtracy.repl.co/pinterest?search=${encodeURIComponent(query)}`, (err, response, body) => {
        if (err) {
            console.error(err);
            return;
        }
        const data = JSON.parse(body);
        const imgss = data.data;
        const imgsss = new Set(imgss);
        const imgs = [...imgsss];
        console.log(imgs);
        // console.log(imgs);
        let numimg = imgs.length;
        
        for (let i = 0; i < numimg; i++) {
            const filename = `${i}.png`;
            const filePath = path.join(__dirname, '..','..','img',filename);
            const img = imgs[i];
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
                    pathimgs.push(filePath);
                    if (pathimgs.length == numimg) {
                        api.sendMessage({
                            body: `Tìm được ${numimg} hình ảnh cho từ khóa: ${query} (-150$)`,
                            attachment: pathimgs.map(path => fs.createReadStream(path))
                        }, event.threadID, event.messageID);
                        
                    }
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
              }, 30000);
        }
        
        
        
             
    });
    
}