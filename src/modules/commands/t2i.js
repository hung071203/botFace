const puppeteer = require('puppeteer');
const translate = require('translate-google');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
module.exports.config = {
    name: "t2i2",
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
    // Khởi động trình duyệt Puppeteer
    const browser = await puppeteer.launch();
    
    // Mở một trang mới
    const page = await browser.newPage();
    
    // Truy cập trang web
    await page.goto('https://aicreate.com/text-to-image-generator/');

    // Chờ cho trang web tải hoàn tất

    try {
        await page.waitForSelector('input[name="caption"]', { timeout: 2000 }); // Đợi tối đa 2 giây cho selector xuất hiện
        
    } catch (error) {
    
    return api.sendMessage('Mạng đang bị lỏ, thử lại sau!', event.threadID, event.messageID)// In ra console nếu không tìm thấy selector sau 2 giây
    }

    // Tìm ô input có trường name="caption"
    const inputElement = await page.$('input[name="caption"]');
    await page.$eval('input[name="caption"]', input => input.value = '');
    
    // Thực hiện thao tác với ô input nếu cần
    // Ví dụ: điền giá trị vào ô input
    await inputElement.type(query);
    const value = await page.evaluate(element => element.value, inputElement);
    console.log('Giá trị của ô input:', value);
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => {
        const img = document.querySelector('img[style="object-fit: cover; width: 100%; height: 100%;"]');
        return img && img.complete;
    });

    // Lấy scr của thẻ img
    const imgSrc = await page.evaluate(() => {
        const img = document.querySelector('img[style="object-fit: cover; width: 100%; height: 100%;"]');
        return img.src;
    });
    
    // In ra scr của thẻ img
    console.log('Src của thẻ img:', imgSrc);
    // Đóng trình duyệt
    await browser.close();

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