const puppeteer = require('puppeteer');
const fs = require("fs")
module.exports.config = {
    name: "cap",
    version: "1.0.0",
    credits: "Ralph",
    description: "g",
    usage: "!cap",
};
  
  
module.exports.run = async function (api, event, args, client) {
    let uid = event.senderID
    if (event.type == 'message_reply') {
        uid = event.messageReply.senderID
    }
    let url = `https://www.facebook.com/${uid}`
    if(args.length == 2) {
        let a = args[1]
        if(a.includes('https://')||a.includes('http://')){
            url = args[1].toLowerCase()
        }else{
            url = `https://${args[1].toLowerCase()}`
        }
        
    }
    var filePath = __dirname + `/../../img/${Date.now()}.jpg`;
    let deltaTime = 0
    let msgs = []
    // Khởi tạo trình duyệt Puppeteer
    const browser = await puppeteer.launch();

    // Mở một trang mới
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    // Điều hướng đến URL của trang web cần chụp
    const bfTime = Date.now()
    await page.goto(url);
    const atTime = Date.now()
    deltaTime = atTime - bfTime
    if(args.length != 2){
        try {
            
            const divselector = '.x92rtbv.x10l6tqk.x1tk7jg1.x1vjfegm';
            
            await page.waitForSelector(divselector, { timeout: 5000 });
            // Nhấn vào thẻ div
            await page.click(divselector);
            // Chụp màn hình và lưu vào file ảnh

            const divClasses = 'x78zum5 xdt5ytf x2lah0s x193iq5w x2bj2ny x1ey2m1c xayqjjm x9f619 xds687c x1xy6bms xn6708d x1s14bel x1ye3gou xixxii4 x17qophe x1u8a7rm';

            // Tạo selector cho thẻ div
            const divSelector = `div.${divClasses.replace(/ /g, '.')}`;
            // Chờ thẻ div hiển thị
            await page.waitForSelector(divSelector);

            // Xóa thẻ div từ DOM
            await page.evaluate((selector) => {
                const divToRemove = document.querySelector(selector);
                if (divToRemove) {
                divToRemove.remove();
                }
            }, divSelector);
            await page.screenshot({ path: filePath });
            msgs = {
                body: `📱Chụp trang cá nhân thành công\n⌚Truy vấn thực hiện trong ${deltaTime} ms`,
                attachment: fs.createReadStream(filePath)
            }
            
        } catch (error) {
            console.log(error.message);
            await page.screenshot({ path: filePath });
            msgs = {
                body: `⛔Lỗi: ${error.message}\n`,
                attachment: fs.createReadStream(filePath)
            }
        }
    }else{
        try {
           await page.screenshot({ path: filePath });
            msgs = {
                body: `📱Chụp trang web thành công\n⌚Truy vấn thực hiện trong ${deltaTime} ms`,
                attachment: fs.createReadStream(filePath)
            } 
        } catch (error) {
            msgs = `Lỗi: ${error.message}`
        }
            
    }
    
    // Đóng trình duyệt
    await browser.close();
    api.sendMessage(msgs, event.threadID, (err, data) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('MP4 file deleted successfully');
            }
        });
    }, event.messageID)
}

