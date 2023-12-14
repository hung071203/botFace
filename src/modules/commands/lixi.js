module.exports.config = {
    name: 'lixi',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'chia tiền cho mọi người trong nhóm',
    usage: '!lixi [Số tiền muốn lì xì]',
};

module.exports.run = async function (api, event, args, client) {
    if (args.length<2) {
        api.sendMessage('cus pháp không hợp lệ', event.threadID, event.messageID);
    }else{
        let mn = parseInt(args[1]);
        const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
        if (id.money< mn) {
            api.sendMessage('Bạn không đủ tiền để thực hiện hành động này', event.threadID, event.messageID);
           return;
        }
        id.money -= mn;
        let arr =[];
        client.money.forEach(item => {
            if (item.threadID == event.threadID) {
                if (item.ID != event.senderID) {
                    arr.push(item);
                }
                
            }
        
        });
        
        let msg = `Tổng: ${mn.toLocaleString('en-US')}$\n`;
        for (let i = 0; i < arr.length; i++) {
            
            let tmn = Math.floor(Math.random() * mn) + 1;
            const id = client.money.find(item => item.ID == arr[i].ID && item.threadID == arr[i].threadID);
            if (i == arr.length) {
                id.money += mn;
                msg += `${id.name} được chia ${id.money.toLocaleString('en-US')}$\n`
            }else{
                id.money += tmn;
                msg += `${id.name} được chia ${id.money.toLocaleString('en-US')}$\n`
                mn-=tmn;
            }
            
        }
        api.sendMessage(msg, event.threadID, event.messageID);

        

    }
}