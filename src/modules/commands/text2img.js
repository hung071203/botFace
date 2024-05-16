const axios = require('axios');
const translate = require('translate-google');
const path = require('path');
const fs = require('fs');

module.exports.config = {
    name: "t2i",
    version: "1.0.0",
    credits: "Ralph",
    description: "Text 2 img",
    tag: 'AI',
    usage: "!t2i[kiểu ảnh(help để xem chi tiết các kiểu ảnh đầu ra)] [noi dung muon tao]",
};
  
  
module.exports.run = async function (api, event, args, client) {

    if (args.length == 1) return api.sendMessage('Cú pháp không hợp lệ, dùng !t2i[kiểu ảnh(help để xem chi tiết các kiểu ảnh đầu ra)] [noi dung muon tao]', event.threadID, event.messageID);
    const validKeywords = [
        '3d-model', 'analog', 'anime', 'cinematic', 'comic-book', 'craft-clay',
        'digital-art', 'enhance', 'fantasy-art', 'isometric', 'line-art', 'lowpoly',
        'manga', 'neonpunk', 'origami', 'photographic', 'pixel-art', 'texture'
        ];
    if (args[1] == 'help') {
        const message = validKeywords.join(', ');
        api.sendMessage(message, event.threadID, event.messageID);
        return;
    }
    
    let query1 = args.slice(2).join(" ");
    let a = args[1]; // Bạn cần thay đổi giá trị này theo trường hợp thực tế
    console.log(query1, a);
    // Danh sách các từ khóa cho kiểm tra
    

    // Kiểm tra nếu a không thuộc danh sách validKeywords
    if (!validKeywords.includes(a)) {
        a = 'photographic';
        query1 = args.slice(1).join(' ');
    }
    console.log(query1, a);

    let query = await translateText(query1);

    try {
        const options = {
            method: 'POST',
            url: 'https://stable-diffusion9.p.rapidapi.com/generate',
            headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '3ee6c65fbdmsh5974ed9ecabf1c9p1cb610jsna2b7f0fc3860',
            'X-RapidAPI-Host': 'stable-diffusion9.p.rapidapi.com'
            },
            data: {
            prompt: query,
            style: a
            }
        };

        const response = await axios.request(options);
        console.log(response.data.url);

        const url = response.data.url;
        sleep(200);
        const filename = `${Date.now()}.png`;
        const filePath = path.join(__dirname, '..','..','img',filename);
        api.sendMessage('Tạo ảnh thành công, đang tải!', event.threadID,(error, info) => {
            if (error) {
                console.log(error);
            } else {
                
            }
        },event.messageID);

        axios({
            method: 'get',
            url: url,
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
                    body: `Tạo hình ảnh cho từ khóa: ${query1}`
                }
                api.sendMessage(msg, event.threadID,(error, info) => {
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
    } catch (error) {
        console.error(error);
        api.sendMessage('Hôm nay đã hết lượt dùng hoặc đã có lỗi xảy ra, vui lòng thử lại sau.', event.threadID, event.messageID);
        return;
    }
    
    
}
async function translateText(text) {
    try {
      // Chọn ngôn ngữ nguồn là tiếng Việt ('vi') và ngôn ngữ đích là tiếng Anh ('en')
      const translation = await translate(text, { from: 'vi', to: 'en' });
  
      console.log('Original text:', text);
      console.log('Translated text:', translation);
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}