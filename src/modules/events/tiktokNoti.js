const puppeteer = require('puppeteer');
let fs = require('fs');

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
            const downloadLink = res.data.data.play;
            console.log(res, downloadLink);

            if (downloadLink) {
                console.log('Download link:', downloadLink);

                const response = await axios.get(downloadLink, { responseType: 'stream' });

                 // Download file from URL
                const filename = `${Date.now()}.mp4`;
                const filePath = path.join(__dirname, '..','..','mp4',filename);

                
                const writeStream = fs.createWriteStream(filePath);
                response.data.pipe(writeStream);
                await api.sendMessage('Đang tải...', event.threadID, event.messageID);
                // Wait for the video to finish downloading
                await new Promise((resolve) => {
                    writeStream.on('finish', resolve);
                });
                
                await api.sendMessage('Tải hoàn tất, đang gửi...', event.threadID, event.messageID);

                const stream = fs.createReadStream(filePath);
                // Gửi video

                const bodyVD = { 
                    attachment: stream, 
                    body: `${formatFont(res.data.data.title)} \n Đã được ${res.data.data.play_count} lượt xem, ${res.data.data.digg_count} lượt thích và ${res.data.data.comment_count} bình luận!` 
                }
                await api.sendMessage(bodyVD, event.threadID, event.messageID);

                setTimeout(() => {
                    fs.unlink(filePath, (err) => {
                      if (err) {
                        console.error('Error deleting file:', err);
                      } else {
                        console.log('MP4 file deleted successfully');
                      }
                    });
                  }, 60000);
                
            } else {
                console.log('Download link not found.');
            }

            
        }else if (inputURL.includes('bot') || inputURL.includes('Bot')) {
          api.sendMessage('Tag cc j?', event.threadID, event.messageID);
        }
    }
}
function formatFont(text) {
    const fontMapping = {
      a: "𝙖",
      á: "𝙖́",
      à: "𝙖̀",
      ả: "𝙖̉",
      ã: "𝙖̃",
      ạ: "𝙖̣",
      ă: "𝙖̆",
      ắ: "𝙖̆́",
      ằ: "𝙖̆̀",
      ẳ: "𝙖̆̉",
      ẵ: "𝙖̆̃",
      ặ: "𝙖̣̆",
      â: "𝙖̂",
      ấ: "𝙖̂́",
      ầ: "𝙖̂̀",
      ẩ: "𝙖̂̉",
      ẫ: "𝙖̂̃",
      ậ: "𝙖̣̂",
      b: "𝙗",
      c: "𝙘",
      d: "𝙙",
      đ: "đ",
      e: "𝙚",
      é: "𝙚́",
      è: "𝙚̀",
      ẻ: "𝙚̉",
      ẽ: "𝙚̃",
      ẹ: "𝙚̣",
      ê: "𝙚̂",
      ế: "𝙚̂́",
      ề: "𝙚̂̀",
      ể: "𝙚̂̉",
      ễ: "𝙚̂̃",
      ệ: "𝙚̣̂",
      f: "𝙛",
      g: "𝙜",
      h: "𝙝",
      i: "𝙞",
      í: "𝙞́",
      ì: "𝙞̀",
      ỉ: "𝙞̉",
      ĩ: "𝙞̃",
      ị: "𝙞̣",
      j: "𝙟",
      k: "𝙠",
      l: "𝙡",
      m: "𝙢",
      n: "𝙣",
      o: "𝙤",
      ó: "𝙤́",
      ò: "𝙤̀",
      ỏ: "𝙤̉",
      õ: "𝙤̃",
      ọ: "𝙤̣",
      ô: "𝙤̂",
      ố: "𝙤̂́",
      ồ: "𝙤̂̀ ",
      ổ: "𝙤̂̉",
      ỗ: "𝙤̂̃",
      ộ: "𝙤̣̂",
      ơ: "𝙤̛",
      ớ: "𝙤̛́",
      ờ: "𝙤̛̀",
      ở: "𝙤̛̉",
      ỡ: "𝙤̛̃",
      ợ: "𝙤̛̣",
      p: "𝙥",
      q: "𝙦",
      r: "𝙧",
      s: "𝙨",
      t: "𝙩",
      u: "𝙪",
      ú: "𝙪́",
      ù: "𝙪̀",
      ủ: "𝙪̉",
      ũ: "𝙪̃",
      ụ: "𝙪̣",
      ư: "𝙪̛",
      ứ: "𝙪̛́",
      ừ: "𝙪̛̀",
      ử: "𝙪̛̉",
      ữ: "𝙪̛̃",
      ự: "𝙪̛̣",
      v: "𝙫",
      w: "𝙬",
      x: "𝙭",
      y: "𝙮",
      ý: "𝙮́",
      ỳ: "𝙮̀",
      ỷ: "𝙮̉",
      ỹ: "𝙮̃",
      ỵ: "𝙮̣",
      z: "𝙯",
      A: "𝘼",
      Á: "𝘼́",
      À: "𝘼̀",
      Ả: "𝘼̉",
      Ã: "𝘼̃",
      Ạ: "𝘼̣",
      Ă: "𝘼̆",
      Ắ: "𝘼́̆",
      Ằ: "𝘼̀̆",
      Ẳ: "𝘼̉̆",
      Ẵ: "𝘼̃̆",
      Ặ: "𝘼̣̆",
      Â: "𝘼̂",
      Ấ: "𝘼́̂",
      Ầ: "𝘼̀̂",
      Ẩ: "𝘼̉̂",
      Ẫ: "𝘼̃̂",
      Ậ: "𝘼̣̂",
      B: "𝘽",
      C: "𝘾",
      D: "𝘿",
      Đ: "𝘿̛",
      E: "𝙀",
      É: "𝙀́",
      È: "𝙀̀",
      Ẻ: "𝙀̉",
      Ẽ: "𝙀̃",
      Ẹ: "𝙀̣",
      Ê: "𝙀̂",
      Ế: "𝙀́̂",
      Ề: "𝙀̀̂",
      Ể: "𝙀̉̂",
      Ễ: "𝙀̃̂",
      Ệ: "𝙀̣̂",
      F: "𝙁",
      G: "𝙂",
      H: "𝙃",
      I: "𝙄",
      Í: "𝙄́",
      Ì: "𝙄̀",
      Ỉ: "𝙄̉",
      Ĩ: "𝙄̃",
      Ị: "𝙄̣",
      J: "𝙅",
      K: "𝙆",
      L: "𝙇",
      M: "𝙈",
      N: "𝙉",
      O: "𝙊",
      Ó: "𝙊́",
      Ò: "𝙊̀",
      Ỏ: "𝙊̉",
      Õ: "𝙊̃",
      Ọ: "𝙊̣",
      Ô: "𝙊̂",
      Ố: "𝙊́̂",
      Ồ: "𝙊̀̂",
      Ổ: "𝙊̉̂",
      Ỗ: "𝙊̃̂",
      Ộ: "𝙊̣̂",
      Ơ: "𝙊̛",
      Ớ: "𝙊̛́",
      Ờ: "𝙊̛̀",
      Ở: "𝙊̛̉",
      Ỡ: "𝙊̛̃",
      Ợ: "𝙊̛̣",
      P: "𝙋",
      Q: "𝙌",
      R: "𝙍",
      S: "𝙎",
      T: "𝙏",
      U: "𝙐",
      Ụ: "𝙐̣",
      V: "𝙑",
      W: "𝙒",
      X: "𝙓",
      Y: "𝙔",
      Ý: "𝙔́",
      Ỳ: "𝙔̀",
      Ỷ: "𝙔̉",
      Ỹ: "𝙔̃",
      Ỵ: "𝙔̣",
      Z: "𝙕",
      0: "𝟎",
    1: "𝟏",
    2: "𝟐",
    3: "𝟑",
    4: "𝟒",
    5: "𝟓",
    6: "𝟔",
    7: "𝟕",
    8: "𝟖",
    9: "𝟗"
    };
  
    let formattedText = "";
    for (const char of text) {
      if (char in fontMapping) {
        formattedText += fontMapping[char];
      } else {
        formattedText += char;
      }
    }
    return formattedText;
  }