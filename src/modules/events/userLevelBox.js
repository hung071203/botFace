
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
    
    if (event.type == 'message' || event.type == 'message_reply') {
        let checkBT = client.QTVOL.find(e=> e.threadID == event.threadID)
        if(client.QTVOL.length == 0) return 
        if(typeof checkBT == 'undefined' || checkBT.time < parseInt(event.timestamp)) return 

        if(event.isGroup == false) return
        let findUser = client.userLevel.find(item => item.ID == event.senderID && item.threadID == event.threadID)
        if (!findUser) {
            const loaiTu = ['Tu tiên', 'Tu ma', 'Tu yêu'];
            const randomIndex = Math.floor(Math.random() * loaiTu.length);
            const randomTu = loaiTu[randomIndex];
            client.userLevel.push({
                ID: event.senderID,
                threadID: event.threadID,
                level: 0,
                xp: 0,
                tu: randomTu,
                congphap: []
            })
            return
        }
        let getLV = client.dataLevel.level[findUser.level]
        if (findUser.xp >= getLV.xp && findUser.level < client.dataLevel.level.length) {
            api.sendMessage(`Chúc mừng bạn đã lên ${client.dataLevel.level[findUser.level + 1].name} \nNguyên khí hiện tại: ${findUser.xp}/${client.dataLevel.level[findUser.level + 1].xp}\nBạn đang theo ${findUser.tu}`, event.threadID, event.messageID)
            findUser.level += 1
        }
        let point = 0
        if (findUser.congphap.length > 0) {
            findUser.congphap.forEach(e => {
                point += e.power
            });
        }
        findUser.xp += (10 + point) * (1 - findUser.level/100)
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