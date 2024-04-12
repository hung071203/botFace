const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
let c =0;
module.exports.config = {
    name: "img",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tìm hình ảnh qua tên",
    tag: 'Công cụ',
    usage: "!img [tên muốn tìm]",
  };
  
let standByTime =[]
  
module.exports.run = async function (api, event, args, client) {
    let findSBT = standByTime.find(item => item.threadID == event.threadID)
    if(!findSBT) {
      standByTime.push({
        threadID: event.threadID,
        timestamp: parseInt(event.timestamp) + 90 * 1000
      })
    }else{
      if(findSBT.timestamp > parseInt(event.timestamp)) {
        var d = new Date(findSBT.timestamp);
        var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        return api.sendMessage(`Lệnh có thể sử dụng lại sau ${lDate}`, event.threadID, event.messageID)
      }
    }
    if(args.length == 1){
        api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
        return;
    }
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if(!id) return  api.sendMessage('Thử lại!', event.threadID, event.messageID);
    if (id.money<150) {
        api.sendMessage('Bạn quá nghèo để thực hiện hành động này!', event.threadID, event.messageID);
        return;
    }
    let query = args.slice(1).join(" ");
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Điều hướng đến trang Google Images
    await page.goto(`https://www.google.gg/search?q=${encodeURIComponent(query)}&sca_esv=594000818&tbm=isch&source=lnms&sa=X&ved=2ahUKEwid3_LR9a-DAxWzbPUHHRNjBKcQ_AUoAXoECAIQAw&biw=1912&bih=924&dpr=1`);
  
    // Chờ trang load đầy đủ
    findSBT = standByTime.find(item => item.threadID == event.threadID)
    try {
      await page.waitForSelector('img.rg_i', { timeout: 2000 }); // Đợi tối đa 2 giây cho selector xuất hiện
      
    } catch (error) {
      findSBT.timestamp = 0
      return api.sendMessage('Mạng đang bị lỏ, thử lại sau!', event.threadID, event.messageID)// In ra console nếu không tìm thấy selector sau 2 giây
    }
    id.money -= 150;
    //check
    
    
    // Lấy đường link (src) của 12 hình ảnh đầu tiên
    const imageSrcList = await page.evaluate(() => {
      const imageElements = document.querySelectorAll('img.rg_i');
      const srcList = Array.from(imageElements).slice(0, 9).map(img => img.src.replace(/^data:image\/(jpeg|png);base64,/, ''));
      return srcList;
    });
    await browser.close();
    let arrimg =[];
    imageSrcList.forEach(e => {
        const filename = `${c}.png`;
        const filePath = path.join(__dirname, '..','..','img',filename);
        c++;
        // Chuyển đổi base64 sang buffer
        const buffer = Buffer.from(e, 'base64');

        // Chuyển đổi buffer sang ảnh PNG và lưu vào tệp tin
        sharp(buffer)
        .toFile(filePath, (err, info) => {
            if (err) {
                console.error(err);
                return api.sendMessage('Ảnh tải về có định dạng không được hỗ trợ, thử lại sau!', event.threadID, event.messageID)
            } else {
                findSBT.timestamp = parseInt(event.timestamp) + 60 * 1000
                console.log('Chuyển đổi thành công!');
                console.log(info);
                arrimg.push(filePath);
                if (arrimg.length == imageSrcList.length) {
                    api.sendMessage({
                        body: `Tìm được ${arrimg.length} hình ảnh cho từ khóa: ${query} (-150$)`,
                        attachment: arrimg.map(path => fs.createReadStream(path))
                    }, event.threadID, (error, info) => {
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
    });
}