const request = require("request");
const fs = require("fs")
const path = require('path');
module.exports.config = {
    name: "ghepdoi",
    version: "1.0.0",
    credits: "Ralph",
    description: "Ghép đôi",
    usage: "!ghepdoi",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const users = event.participantIDs.filter(item => item != event.senderID)
    let userID = users[Math.floor(Math.random() * users.length)]
    let userDetail = client.members.find(item => item.userID == userID)
    if(!userDetail) return api.sendMessage('không thể truy vấn thông tin người dùng ', event.threadID, event.messageID)
    const p = Math.floor(Math.random() * 100) + 1
    console.log(userDetail);
    let messageID = ''
    api.sendMessage('Đang tiến hành ghép đôi, vui lòng đợi trong giây lát', event.threadID, (err, data) =>{
        if(err) return console.log(err);
        messageID = data.messageID
        setTimeout(() => {
            ghepdoi(p, userDetail, api, event, messageID)
        }, 2000);
        
    }, event.messageID)

}
function ghepdoi(p, userDetail, api, event, messageID){
    let msg = '||Kết quả ghép đôi:||\n'
    msg += `👤Tên: ${userDetail.name}\n`
    msg += `🎨Giới tính: ${userDetail.gender}\n`
    msg += `💕Mức độ tình cảm: ${p}%\n`
    const filename = `${Date.now()}.jpg`;
    const filePath = path.join(__dirname, '..', '..', 'img', filename);
    var callback = (filePath) => {
        api.sendMessage({
            body: msg,
            attachment: fs.createReadStream(filePath),
            mentions: [{
                tag: userDetail.name,
                id: userDetail.userID
            }]
        }, event.threadID, (err, messageInfo) => {
          
          fs.unlink(filePath, (err) => {
              if (err) {
                  console.error('Error deleting file:', err);
              } else {
                  console.log('MP4 file deleted successfully');
              }
          });
          api.unsendMessage(messageID);
        
        }, event.messageID);

    };
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Nếu tệp không tồn tại, tải xuống từ đường dẫn web
            request(encodeURI(userDetail.profilePicture)).pipe(fs.createWriteStream(filePath))
                .on("close", () => callback(filePath));
        } else {
            // Nếu tệp đã tồn tại, gửi ngay lập tức
            callback(filePath);
        }
    });


}