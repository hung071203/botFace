const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'savefile', 'save.json');

module.exports.config = {
    name: 'unsend',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {
    if (!event) {
        return;
    }
    if (event.type == 'message' || event.type == 'message_reply') {
        const duLieuJSON = JSON.stringify(event, null, 2);

        // Đọc dữ liệu hiện tại từ file (nếu có)
        let duLieuHienTai = [];
        try {
            const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
            duLieuHienTai = JSON.parse(duLieuHienTaiJSON);
        } catch (err) {
            console.error('Lỗi khi đọc file:', err);
        }

        if (duLieuHienTai.length >= 100) {
            duLieuHienTai.length = 0;
        }

        // Thêm dữ liệu mới vào mảng hiện tại
        duLieuHienTai.push(event);

        // Ghi lại mảng vào file
        fs.writeFile(filePath, JSON.stringify(duLieuHienTai, null, 2), { encoding: 'utf8', flag: 'w' }, (err) => {
            if (err) {
                console.error('Lỗi khi lưu file:', err);
            } else {
                console.log('Dữ liệu đã được lưu vào file thành công.');
            }
        });
    }
    if (event.type == 'message_unsend') {
        
        fs.readFile(filePath, 'utf8', (err, duLieuJSON) => {
            if (err) {
                console.error('Lỗi khi đọc file:', err);
            } else {
                // Chuyển đổi chuỗi JSON thành mảng đối tượng
                const dt = JSON.parse(duLieuJSON);
                const id = dt.find(item => item.messageID == event.messageID);
                if (id) {
                    console.log('Dữ liệu từ file:', id);
                    
                }else{
                    console.log('khong thay');
                }
                
            }
        });
    }
}
