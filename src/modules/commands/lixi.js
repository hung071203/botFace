module.exports.config = {
    name: 'lixi',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'chia tiền cho mọi người trong nhóm',
    tag: 'Money',
    usage: '!lixi [Số tiền muốn lì xì]',
};

module.exports.run = async function (api, event, args, client) {
    if (args.length < 2 && isNaN(args[1])) {
        api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
        return;
    }

    let mn = parseInt(args[1]);
    const senderID = event.senderID;
    const threadID = event.threadID;
    
    const senderAccount = client.money.find(item => item.ID === senderID && item.threadID === threadID);

    if (!senderAccount || senderAccount.money < mn) {
        api.sendMessage('Bạn không đủ tiền để thực hiện hành động này', threadID, event.messageID);
        return;
    }

    console.log(senderAccount);
    senderAccount.money -= mn;
    console.log(senderAccount);
    const recipients = client.money.filter(item => item.threadID === threadID && item.ID !== senderID);
    
    let msg = `Tổng: ${mn.toLocaleString('en-US')}$\n`;
    let mnp = mn/recipients.length
    recipients.forEach((recipient, index) => {
        recipient.money += mnp

    });
    msg += `Mỗi người được chia ${mnp.toLocaleString('en-US')}$`

    api.sendMessage(msg, threadID, event.messageID);
};


