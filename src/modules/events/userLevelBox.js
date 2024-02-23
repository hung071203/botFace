
const fs = require('fs');
const path = require('path');

const filePathG = path.join(__dirname, '..', '..', 'savefile', 'dataLevel.json');
const filePathU = path.join(__dirname, '..', '..', 'savefile', 'userLevel.json');

module.exports.config = {
    name: 'userLevel',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {
    if(!event) return
    
    if(!event.senderID || !event.threadID) return
    let findUser = client.userLevel.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if (!findUser) {
        client.userLevel.push({
            ID: event.senderID,
            threadID: event.threadID,
            level: 0,
            xp: 0
        })
        return
    }
    
    fs.writeFile(filePathU + '.tmp', JSON.stringify(client.userLevel, null, 2), { encoding: 'utf8' }, (err) => {
        if (err) {
            console.error('Lỗi khi lưu tien file:', err);
        } else {
            fs.rename(filePathU + '.tmp', filePathU, (err) => {
                if (err) {
                    console.error('Lỗi khi đổi tên file:', err);
                }
            })
        }
    });
}

module.exports.onload = function (api, client) {
    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePathG, 'utf8');
        client.dataLevel = JSON.parse(duLieuHienTaiJSON);
    } catch (err) {
        console.error('Lỗi khi đọc CM file:', err);
    }
    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePathU, 'utf8');
        client.userLevel = JSON.parse(duLieuHienTaiJSON);
    } catch (err) {
        console.error('Lỗi khi đọc dataUser file:', err);
    }
}