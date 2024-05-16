
const path = require('path');
const fs = require('fs');
module.exports.config = {
    name: "cadao",
    version: "1.0.0",
    credits: "Ralph",
    description: "cadao",
    usage: "!cadao",
};
let cadao = []
const filePath = path.join(__dirname, '..', '..', 'savefile', 'cadao.json');
try {
    const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
    cadao = JSON.parse(duLieuHienTaiJSON);
} catch (err) {
    console.error('Lỗi khi đọc cadao file:', err);
}
  
module.exports.run = async function (api, event, args, client) {
    
    let rd = Math.floor(Math.random() * 268) +1
    api.sendMessage(cadao.data[rd], event.threadID, event.messageID)
}