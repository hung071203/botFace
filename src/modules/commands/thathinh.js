const path = require('path');
const fs = require('fs');
module.exports.config = {
    name: 'tt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Thơ thả thính ',
    usage: '!tt '
};
let thathinh =[]
const filePath = path.join(__dirname, '..', '..', 'savefile', 'thathinh.json');
try {
    const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
    thathinh = JSON.parse(duLieuHienTaiJSON);
} catch (err) {
    console.error('Lỗi khi đọc tt file:', err);
}
module.exports.run = async function (api, event, args, client) {
    
    const i = Math.floor(Math.random() * thathinh.length);
    api.sendMessage(thathinh[i], event.threadID, event.messageID)


}