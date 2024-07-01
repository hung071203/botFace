const fs = require('fs');
const path = require('path');

const filePathG = path.join(__dirname, '..', '..', 'savefile', 'coinMaster.json');
const filePathU = path.join(__dirname, '..', '..', 'savefile', 'dataUserCoinM.json');

const filePathBT = path.join(__dirname, '..', '..', 'savefile', 'config.json');

module.exports.config = {
    name: 'coinM',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {
    if(!event) return
    if(isNaN(event.timestamp)) return
    if(!event.threadID) return

    client.userCM.forEach(e => {
        
        let spinLi = 0
        if (e.level < 40) {
            spinLi = 50
        } else if (e.level >= 40 && e.level < 80) {
            spinLi = 70
        }else if (e.level >= 80 ) {
            spinLi = 90
        }
        for ( ; event.timestamp >= e.timestamp + 10 * 60 * 1000; e.timestamp += 10 * 60 * 1000 ) {
            if (e.spin < spinLi) {
                e.spin += 1
            }
        }
        
    });

    let check = client.QTVOL.find(item => item.threadID == event.threadID);
    if (!check) {
        client.QTVOL.push({
            userName: '',
            key: '',
            threadID: event.threadID,
            checkid: 0,
            remess: 0,
            antiOut: false,
            antiJoin: false,
            time: parseInt(event.timestamp),
            prefix: process.env.PREFIX,
            botRep: false
        })
    }

    


    fs.writeFile(filePathU + '.tmp', JSON.stringify(client.userCM, null, 2), { encoding: 'utf8' }, (err) => {
        if (err) {
            console.error('Lỗi khi lưu tien file:', err);
        } else {
            fs.rename(filePathU + '.tmp', filePathU, (err) => {
                if (err) {
                    console.error('Lỗi khi đổi tên file:', err);
                }
            });
        }
    });

    fs.writeFile(filePathBT + '.tmp', JSON.stringify(client.QTVOL, null, 2), { encoding: 'utf8' }, (err) => {
        if (err) {
            console.error('Lỗi khi lưu tien file:', err);
        } else {
            fs.rename(filePathBT + '.tmp', filePathBT, (err) => {
                if (err) {
                    console.error('Lỗi khi đổi tên file:', err);
                }
            });
        }
    });
}

module.exports.onload = function (api, client) {
    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePathG, 'utf8');
        client.coinMaster = JSON.parse(duLieuHienTaiJSON)
    } catch (err) {
        console.error('Lỗi khi đọc CM file:', err);
    }
    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePathU, 'utf8');
        client.userCM = JSON.parse(duLieuHienTaiJSON, function(key, value) {
            if (value === null) {
              return 0;
            }
            return value;
        })
    } catch (err) {
        console.error('Lỗi khi đọc dataUser file:', err);
    }

    try {
        const duLieuHienTaiJSON = fs.readFileSync(filePathBT, 'utf8');
        client.QTVOL = JSON.parse(duLieuHienTaiJSON);
    } catch (err) {
        console.error('Lỗi khi đọc BotTime file:', err);
    }
}