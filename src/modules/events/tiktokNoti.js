const puppeteer = require('puppeteer');
const fs = require('fs');

const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: 'ttNoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'ttNoti!',
    usage: ''
}



module.exports.run = async function (api, event, args, client) {
    // Hàm được thực thi khi sự kiện xảy ra

    if (event.type == 'message') {
        // Kiểm tra xem đường dẫn có đoạn đầu là "https://vt.tiktok.com/" hay không
        const tiktokURL = 'https://vt.tiktok.com/';
        const inputURL = event.body; // Giả sử args[0] là đường dẫn cần kiểm tra
        console.log(inputURL);
        if (inputURL.startsWith(tiktokURL)) {
            // Nếu có, lấy toàn bộ đường dẫn
            const fullURL = inputURL;
            let retryCount = 0;
            const maxRetries = 3;
            let downloadLink = [];
            while (retryCount < maxRetries) {
                try {
                    const snaptikURL = 'https://snaptik.app/vn';
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(snaptikURL);
                    await page.waitForSelector('input#url');
                    await page.type('input#url', fullURL);
                    await page.keyboard.press('Enter');
                    console.log(page.url());
                    await page.waitForSelector('.button.download-file', { timeout: 500 });
                    downloadLink = await page.evaluate(() => {
                        const link = document.querySelector('.button.download-file');
                        return link ? link.href : null;
                    });
                    await browser.close();  
                    break; // Exit the loop if the download is successful
                } catch (error) {
                    if (error.message === 'Execution context was destroyed, most likely because of a navigation.') {
                        console.error('Retrying download due to navigation error...');
                        retryCount++;
                        continue; // Retry the download process
                    } else {
                        console.error('Error:', error.message);
                        // Handle other errors here
                        break; // Exit the loop on other errors
                    }
                }
            }

            if (retryCount === maxRetries) {
                console.error('Maximum retry attempts exceeded.');
            }


            if (downloadLink) {
                console.log('Download link:', downloadLink);

                const response = await axios.get(downloadLink, { responseType: 'stream' });

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
                await api.sendMessage({ attachment: stream, body: '' }, event.threadID, event.messageID);

                stream.on('end', () => {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        console.error('Error deleting file:', err);
                      } else {
                        console.log('MP4 file deleted successfully');
                      }
                    });
                });
                
            } else {
                console.log('Download link not found.');
            }

            
        } 
    }
}
