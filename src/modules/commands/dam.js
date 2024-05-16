const request = require("request");
const fs = require("fs")
module.exports.config = {
    name: "đấm",
    version: "1.0.0",
    credits: "Ralph",
    description: "đấm ai đó",
    usage: "!đấm [@user]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if (!event.mentions) return api.sendMessage('Vui lòng tag người dùng', event.threadID, event.messageID);
    
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");
    var link = [
        "https://i.postimg.cc/SNX8pD8Z/13126.gif",
        "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
        "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
        "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif",
    ];

    var filePath = __dirname + "/../../img/cache/"; // Thư mục chứa tệp ảnh

    var callback = (fileName) => {
        api.sendMessage({
            body: `${tag} , m vớ alo chắc r`,
            mentions: [{
                tag: tag,
                id: Object.keys(event.mentions)[0]
            }],
            attachment: fs.createReadStream(filePath + fileName)
        }, event.threadID);
    };

    // Chọn ngẫu nhiên một đường dẫn từ mảng link
    var randomLink = link[Math.floor(Math.random() * link.length)];
    var fileName = "dam" + (Math.floor(Math.random() * link.length) + 1) + ".jpg"; // Tạo tên tệp động

    // Tạo đường dẫn đầy đủ tới tệp
    var fileFullPath = filePath + fileName;

    // Kiểm tra nếu tệp đã tồn tại
    fs.access(fileFullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // Nếu tệp không tồn tại, tải xuống từ đường dẫn web
            request(encodeURI(randomLink)).pipe(fs.createWriteStream(fileFullPath))
                .on("close", () => callback(fileName));
        } else {
            // Nếu tệp đã tồn tại, gửi ngay lập tức
            callback(fileName);
        }
    });
}