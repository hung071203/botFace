module.exports.config = {
    name: 'ttk',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiện danh sách tài khoản giàu nhất từ trên xuống dưới',
    tag: 'Money',
    usage: '!ttk',
};

module.exports.run = async function (api, event, args, client) {
    let topM = [];
    client.money.forEach(item => {
        if (item.threadID == event.threadID) {
            topM.push(item);
        }
    });
    topM.sort((a, b) => b.money - a.money);
    let msg = `---------------------------------------------------------------\n|Bảng xếp hạng người giàu nhất nhóm:|\n---------------------------------------------------------------\n`;
    for (let i = 0; i < topM.length; i++) {
        msg += `${i+1}, Chủ tài khoản: ${topM[i].name}\n    Số tài khoản: ${topM[i].ID}\n    Số tiền hiện tại: ${topM[i].money.toLocaleString('en-US')}$\n---------------------------------------------------------------\n`
        
    }
    api.sendMessage(msg, event.threadID, event.messageID);


}