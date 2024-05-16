module.exports.config = {
    name: 'clientqtv',
    version: '1.0.0',
    credit: 'YourName',
    description: 'cập nhật danh sách admin các nhóm!',
    usage: '!clientqtv'
};


module.exports.run = async function (api, event, args, client) {
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return api.sendMessage('Lấy thông tin thất bại!', event.threadID, event.messageID);
        client.QTV = []
        arr.forEach(thread => {
            if (thread.isGroup) {
                let qtvIDs = thread.adminIDs
                qtvIDs.forEach(e => {
                    client.QTV.push({
                        threadID: thread.threadID,
                        adminID: e
                    })
                })

            }
        })
        api.sendMessage('Cập nhật danh sách quản trị viên thành công!', event.threadID, event.messageID);
    });
}