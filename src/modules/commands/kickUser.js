module.exports.config = {
    name: "kick",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kick người dùng khỏi nhóm! ",
    tag: 'QTV',
    usage: "!kick [user]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    //checkQTV
    api.getThreadInfo(event.threadID, (err, info) => {
        if (err) {
            console.log(err.error);
        } else {
            if (info.isGroup) {
                let qtvIDs = info.adminIDs
                client.QTV = client.QTV.filter(item => item.threadID != info.threadID)
                qtvIDs.forEach(e => {
                    client.QTV.push({
                        threadID: info.threadID,
                        adminID: e.id
                    })
                })

                let adIDs = process.env.ADMIN.trim().split(' ');
                let checkADmin = adIDs.find(item => item == event.senderID)
                let filter = client.QTV.filter(e => e.threadID == event.threadID)
                if (!checkADmin) {
                    console.log(filter, client.QTV);
                    let find = filter.find(e => e.adminID == event.senderID)
                    console.log(find);
                    if(!find) return api.sendMessage('Chỉ quản trị viên dùng được chức năng này!', event.threadID, event.messageID)
                }
                
                let checkBotAD = filter.find(e => e.adminID == api.getCurrentUserID())
                if(!checkBotAD) return api.sendMessage('Cho t lên làm QTV đã!', event.threadID, event.messageID)

                if(Object.keys(event.mentions).length == 0 ) return api.sendMessage('Tin nhắn sai cú pháp!', event.threadID, event.messageID)
                
                const userIDs = Object.keys(event.mentions);
                userIDs.forEach(userID => {
                    if (userID == api.getCurrentUserID()) return api.sendMessage("Mày muốn sao? :/", event.threadID, event.messageID);
                    let adIDs = process.env.ADMIN.trim().split(' ');
                    let checkAD = adIDs.find(item => item == userID)
                    if(checkAD) return api.sendMessage("M định kick bố t á, t kick m giờ!", event.threadID, event.messageID);
                    let findQTV = filter.find(e => e.adminID == userID)
                    if(findQTV) return api.sendMessage("Không thể kick Quản trị viên", event.threadID, event.messageID);
                    api.removeUserFromGroup(userID, event.threadID, (err) =>{
                        if(err) return console.log(err);
                    })
                });
            }else return
        }

    })

    
    
};