const fs = require('fs');
const path = require('path')

const filePath = path.join(__dirname, '..', '..', 'savefile', 'rule.json');
let rules = []
try {
    const duLieuHienTaiJSON = fs.readFileSync(filePath, 'utf8');
    rules = JSON.parse(duLieuHienTaiJSON);
} catch (err) {
    console.error('Lỗi khi đọc money file:', err);
}

module.exports.config = {
    name: 'rule',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'luật nhóm',
    tag: 'system',
    usage: '!rule: (hiện luật nhóm) (set/help)',
};

module.exports.run = async function (api, event, args, client) {
    let findR = rules.find(item => item.threadID == event.threadID)
    if (args.length == 1) {
        
        if(!findR) return api.sendMessage('Nhóm chưa thêm luật, vui lòng dùng !rule set (luật mới) để thêm', event.threadID, event.messageID)
        api.sendMessage(`--------------------------------------------------------------------------\n🎄Nhìn, đọc hiểu cho kĩ đi không có ngày bị kick: \n--------------------------------------------------------------------------\n${findR.rule}`, event.threadID, event.messageID)

    }else{
        switch (args[1]) {
            case 'help':
                api.sendMessage(`!rule: hiện nội quy nhóm\n!rule set (Nội quy): thêm lại nội quy cho nhóm!`, event.threadID, event.messageID)
                break;
            case 'set':
                let findQTV = client.QTV.find(item => item.threadID == event.threadID && item.adminID == event.senderID)
                if(!findQTV) return api.sendMessage('M định làm gì:)? Chỉ quản trị viên mới dùng dc chức năng này!',event.threadID, event.messageID)
                let msg = args.slice(2).join(' ')
                if (!findR) {
                    rules.push({
                        threadID: event.threadID,
                        rule: msg
                    })
                }else{
                    findR.rule = msg
                }
                fs.writeFile(filePath + '.tmp', JSON.stringify(rules, null, 2), { encoding: 'utf8' }, (err) => {
                    if (err) {
                        console.error('Lỗi khi lưu tien file:', err);
                        api.sendMessage('Thêm luật thất bại!', event.threadID, event.messageID)
                    } else {
                        fs.rename(filePath + '.tmp', filePath, (err) => {
                            if (err) {
                                console.error('Lỗi khi đổi tên file:', err);
                                api.sendMessage('Thêm luật mới thất bại!', event.threadID, event.messageID)
                            }else{
                                api.sendMessage('Thêm luật mới thành công!', event.threadID, event.messageID)
                            }
                        });
                    }
                });
                break;
            case 'update':
                let QTV = client.QTV.find(item => item.threadID == event.threadID && item.adminID == event.senderID)
                if(!QTV) return api.sendMessage('M định làm gì:)? Chỉ quản trị viên mới dùng dc chức năng này!',event.threadID, event.messageID)
                let msgs = args.slice(2).join(' ')
                if (!findR) return api.sendMessage('chưa thêm luật vào nhóm, thêm luật mới đi r thử lại!', event.threadID, event.messageID)
                findR.rule +=`\n\n${msgs}`
                fs.writeFile(filePath + '.tmp', JSON.stringify(rules, null, 2), { encoding: 'utf8' }, (err) => {
                    if (err) {
                        console.error('Lỗi khi lưu tien file:', err);
                        api.sendMessage('Thêm luật thất bại!', event.threadID, event.messageID)
                    } else {
                        fs.rename(filePath + '.tmp', filePath, (err) => {
                            if (err) {
                                console.error('Lỗi khi đổi tên file:', err);
                                api.sendMessage('Thêm luật mới thất bại!', event.threadID, event.messageID)
                            }else{
                                api.sendMessage('Thêm luật mới thành công!', event.threadID, event.messageID)
                            }
                        });
                    }
                });
                break
            default:
                api.sendMessage('Cú pháp không hợp lệ!', event.threadID, event.messageID)
                break;
        }
    }
};


