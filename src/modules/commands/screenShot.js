const puppeteer = require('puppeteer');
const fs = require("fs")
const toughCookie = require('tough-cookie');
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
    let url = `https://facebook.com/${uid}`
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
    // Điều hướng đến URL của trang web cần chụp
    let cookies = await api.Screenshot()
    if (cookies) {
        cookies = cookies.map(cookie => {
            if (cookie.expires) {
                cookie.expires = new Date(cookie.expires).getTime() / 1000;
            }
            return cookie;
        });
        for (const cookie of cookies) {
            await page.setCookie(cookie);
        }
    }      
    await page.setViewport({ width: 1920, height: 1080 });    
    if(args.length != 2){
        try {
            
            const bfTime = Date.now()
            await page.goto(url, { timeout: 5000 });
            const atTime = Date.now()
            
            deltaTime = atTime - bfTime
            
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
            const bfTime = Date.now()
            await page.goto(url);
            const atTime = Date.now()
            deltaTime = atTime - bfTime
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


