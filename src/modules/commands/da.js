const request = require("request");
const fs = require("fs")
module.exports.config = {
    name: "đá",
    version: "1.0.0",
    credits: "Ralph",
    description: "đá ai đó",
    usage: "!đá [@user]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    if (!event.mentions) return api.sendMessage('Vui lòng tag người dùng', event.threadID, event.messageID);
    
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");
    var link = [
        "https://i.imgur.com/jXOwoHx.gif",
    ];

    var filePath = __dirname + "/../../img/cache/da.jpg"; // Đường dẫn tới tệp cần tạo và ghi

    var callback = () => {
        api.sendMessage({
            body: `${tag} , t đá chết cmm`,
            mentions: [{
                tag: tag,
                id: Object.keys(event.mentions)[0]
            }],
            attachment: fs.createReadStream(filePath)
        }, event.threadID); // Xóa tệp sau khi gửi
    };

    // Kiểm tra nếu tệp đã tồn tại
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Nếu tệp không tồn tại, tải xuống từ đường dẫn web
            request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(filePath))
                .on("close", () => callback());
        } else {
            // Nếu tệp đã tồn tại, gửi ngay lập tức
            callback();
        }
    });
}