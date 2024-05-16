

module.exports.config = {
    name: 'cuopbot',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Cướp bot ',
    usage: '!cuopbot ([on/off])'
};

let timestamps = [];
module.exports.run = async function (api, event, args, client) {
    let adIDs = process.env.ADMIN

    arrAD = adIDs.trim().split(' ');
    let checkAdmin = arrAD.find(item => item == event.senderID)
    if(checkAdmin){
        if(args[1] == 'on'){
            process.env.CUOPBOT = true
            return api.sendMessage('Đã bật tính năng cướp bot!', event.threadID, event.messageID)
        }else if(args[1] == 'off'){
            process.env.CUOPBOT = false
            return api.sendMessage('Đã tắt tính năng cướp bot!', event.threadID, event.messageID)
        }else return api.sendMessage('Bạn đã là ADMIN rồi!', event.threadID, event.messageID)
    }
    
    if(process.env.CUOPBOT == true) return api.sendMessage('TÍnh năng hiện đang bị tắt do ADMIN méo thích!', event.threadID, event.messageID)
    let check = Math.floor(Math.random() * 15);
    let findID = timestamps.find(item => item.senderID == event.senderID);
    if(!findID){
        timestamps.push({
            senderID: event.senderID,
            count: 1,
            time: event.timestamp
        })
        return api.sendMessage('Cướp bot thất bại, thử lại!', event.threadID, event.messageID)
    }else{
        if (findID.count >= 10) {
            if (findID.count == 10) {
                findID.count += 1
                findID.time = parseInt(event.timestamp) + 10 *60000
            }
            if (parseInt(event.timestamp) - findID.time < 10 * 60000) {
                var d = new Date(findID.time);
        
                var lDate = d.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
                return api.sendMessage(`Spam ít thôi, bạn sẽ có thể dùng lại lệnh này sau ${lDate}`, event.threadID, event.messageID)
            }else{
                findID.count = 1;
            }
            
        }
        if(check != 2) {
            findID.count += 1
            return api.sendMessage('Cướp bot thất bại, thử lại!', event.threadID, event.messageID)
        }
        newADIDs = `${adIDs} ${event.senderID}`
        process.env.ADMIN = newADIDs.toString()
        let times = parseInt(event.timestamp) + 0.1 *60000
        var date = new Date(times);
        
        var localeDate = date.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        client.handleReply.push({
            name: this.config.name,
            threadID: event.threadID,
            messageID: event.messageID,
            author: event.senderID,
            timestamp: times
        })
        api.sendMessage(`Cướp bot thành công, bạn sẽ được quyền dùng mọi lệnh của bot đến ${localeDate}`, event.threadID, event.messageID)
    }
}

module.exports.handleReply = async function (api, event, client, hdr) {
    // Lấy thời gian hiện tại
    const currentTime = new Date();

    console.log(currentTime, hdr.timestamp);
    if (currentTime >= hdr.timestamp) {
        process.env.ADMIN = process.env.ADMIN.replace(hdr.author, '').trim();
        let user = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
        if(!user) return
        let moneyu = user.money + user.moneyL;
        api.getUserInfo(hdr.author, (err, userInfo) => {
            let check = Math.floor(Math.random() * 4);
            let msgbody =''
            if (check == 2) {
                moneyu = moneyu * 0.9 
                if (moneyu > user.money) {
                    user.moneyV += moneyu - user.money
                    user.money = 0
                }else{
                    user.money = user.money - moneyu
                }
                msgbody = `Hệ thống phát hiện người dùng ${userInfo[hdr.author].name} cướp bot, đã bị mất 90% tiền trong tài khoản!`;
                
            }else{
                 
                if (moneyu > user.money) {
                    user.moneyV += moneyu - user.money
                    user.money = 0
                }else{
                    user.money = user.money - moneyu
                }
                msgbody = `Hệ thống phát hiện người dùng ${userInfo[hdr.author].name} cướp bot, đã bị mất toàn bộ tiền trong tài khoản!`;
            }
            msg = {
                body: msgbody,
                mentions: [
                    {
                        tag: userInfo [hdr.author].name,
                        id: hdr.author
                    }
                    
                ]
            }
            api.sendMessage(msg, hdr.threadID);
            
            client.handleReply = client.handleReply.filter(item =>item.messageID != hdr.messageID);
            
          })
    }
}
