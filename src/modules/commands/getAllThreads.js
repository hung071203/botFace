module.exports.config = {
    name: "gthread",
    version: "1.0.0",
    credits: "Ralph",
    description: "nhan tat ca cac nhom ma bot o trong",
    tag: 'Threads',
    usage: "!gthread",
};
  
  
module.exports.run = async function (api, event, args, client) {
    api.getThreadList(999, null, [], (err, arr) => {
        if (err) return console.error(err);
        let i = 1
        let msgs = 'Thông tin các nhóm hiện tại:\n-----------------------------------------------\n'
        arr.forEach(thread => {
            if (thread.isGroup) {
                msgs += `${i}: Tên nhóm: ${thread.name}\n  Mã nhóm: ${thread.threadID}\n  Số thành viên hiện tại: ${thread.participantIDs.length}\n-----------------------------------------------\n`
                
                i++
            }
        });
        api.sendMessage(msgs, event.threadID, event.messageID)
    });
}