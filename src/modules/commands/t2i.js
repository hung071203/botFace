
const translate = require('translate-google');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
module.exports.config = {
    name: "t2i",
    version: "2.0.0",
    credits: "Ralph",
    description: "Text 2 img 2.0",
    tag: 'AI',
    usage: "!t2i2 [noi dung muon tao]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if (args.length == 1) return api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
    let query1 = args.slice(1).join(" ");
    let query = await translateText(query1)
    let imgSrc = ''
    const data = {
        action: encodeURIComponent('text_to_image_handle'),
        caption: encodeURIComponent(query),
        negative_prompt: encodeURIComponent('ugly, deformed, disfigured, nswf,low res,blurred'),
        model_version: encodeURIComponent('PHOTOREALISTIC13'),
        size: encodeURIComponent('512x512')
    };
    const config = {
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': '_ga=GA1.1.1226295101.1716624915; _ga_P2N8SMS4ZT=GS1.1.1716624914.1.1.1716626078.0.0.0; _ga_LYMBWKV50Z=GS1.1.1716624914.1.1.1716626078.0.0.0',
            'Origin': 'https://aicreate.com',
            'Referer': 'https://aicreate.com/text-to-image-generator/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    const response = await axios.post('https://aicreate.com/wp-admin/admin-ajax.php', data, config);
    const html = response.data.html;
    console.log(response.data);
    const imageUrlRegex = /<img.*?src=["']([^"']+)["']/g;
    const imageUrls = [];
    let match;

    while ((match = imageUrlRegex.exec(html)) !== null) {
        imageUrls.push(match[1]);
    }

    if (imageUrls.length > 0) {
        console.log("Đường dẫn của ảnh đầu tiên:", imageUrls[0]);
        imgSrc = imageUrls[0];
    } else {
        console.log("Không tìm thấy ảnh.");
    }
    const filename = `${Date.now()}.png`;
    const filePath = path.join(__dirname, '..','..','img',filename);

    axios({
        method: 'get',
        url: imgSrc,
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