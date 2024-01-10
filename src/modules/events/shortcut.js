const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'savefile', 'shortcut.json');
let checkR = 0;

module.exports.config = {
    name: 'shortcut',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {

    
    
    
    if (event) {
       
        if (checkR == 0) {
            try {
                const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
                client.shortcut = JSON.parse(duLieuHienTaiJSON);
            } catch (err) {
                console.error('Lỗi khi đọc shortcut file:', err);
            }
            checkR = 1;
        }
        
        fs.writeFile(filePath, JSON.stringify(client.shortcut, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                console.error('Lỗi khi lưu shortcut file:', err);
            } else {
                
            }
        });
        
    }
   
}