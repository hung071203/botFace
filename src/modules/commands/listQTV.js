module.exports.config = {
    name: 'listqtv',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Hiện tất cả QTV nhóm',
    tag: 'system',
    usage: '!listqtv'
};
 
module.exports.run = async function (api, event, args, client) {
    let find = client.QTV.filter(item => item.threadID == event.threadID)
    if(!find) return api.sendMessage('Có lỗi khi truy vấn thông tin QTV, thử lại sau!', event.threadID, event.messageID)
    let msg = '🎄Thông tin quản trị viên của nhóm🎄\n---------------------------------------------------------------------\n'
    let mentions =[]
    
    const promises = find.map(e => new Promise((resolve, reject) => {
        api.getUserInfo(e.adminID, (err, userInfo) => {
            if(err) return reject(err);
            console.log(userInfo);
            msg += `→Tên người dùng: ${userInfo[e.adminID].name}\n`
            msg += `→Biệt danh: ${userInfo[e.adminID].vanity}\n`
            msg += `(👉ﾟヮﾟ)👉Đường dẫn trang cá nhân: ${userInfo[e.adminID].profileUrl}\n---------------------------------------------------------------------\n`
            mentions.push({
                tag: userInfo[e.adminID].name,
                id: e.adminID
            })
            resolve(userInfo[e.adminID]);
        })
    }));
    
    Promise.all(promises)
    .then(() => {
        console.log(msg, mentions);
        let msgs = {
            body: msg,
            mentions: mentions
        }
    
        api.sendMessage(msgs, event.threadID, event.messageID)
    })
    .catch(error => {
        console.log(error);
    });
    
    
}