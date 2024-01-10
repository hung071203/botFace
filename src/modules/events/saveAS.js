let i = 0;
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, '..', '..', "/appstate.json");

module.exports.config = {
    name: 'sat',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'us',
    usage: ''
}



module.exports.run = async function (api, event, client) {
    if(!event) return;
    if (i == 0) {
        let a = api.getAppState();
        fs.writeFile(filePath, JSON.stringify(a, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                console.error('Lỗi khi lưu tien file:', err);
            } else {
                
            }
        });
        i = 1;
    }

}