module.exports.config = {
    name: 'ttk',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Hiện danh sách tài khoản giàu nhất từ trên xuống dưới',
    tag: 'Money',
    usage: '!ttk',
};

module.exports.run = async function (api, event, args, client) {
    api.getThreadInfo(event.threadID, (err, info) => {
        if (err) {
            console.log(err.error);
        } else {
            if (info.isGroup == false) return;

            client.money.forEach(e => {
                if(e.threadID != event.threadID) return
                let users = info.participantIDs;
                if (!users.includes(e.ID)) {
                    let money = client.money.filter(item => item.ID != e.ID && item.threadID == event.threadID)
                    client.money = client.money.filter(item =>item.threadID != event.threadID);
                    client.money.push(...money);
                }
            });

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
            api.sendMessage(msg, event.threadID, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    client.umessage.push({
                        type: 'unsend',
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    })
                    
                }
            }, event.messageID);
        }
    })

    


}