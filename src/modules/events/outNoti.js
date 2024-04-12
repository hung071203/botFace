module.exports.config = {
    name: 'outNoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, client) {
    if (!event) {
        return;
    }
    if (event.logMessageType != 'log:unsubscribe') return;
    api.getUserInfo(event.logMessageData.leftParticipantFbId, (err, userInfo) => {
        if(err) return console.log(err.error, '     2');

        let msgbody =''
        let find = client.QTVOL.find(item => item.threadID == event.threadID)
        if(!find) return api.sendMessage('lỗi!', event.threadID)
        if(find.antiOut == false){
            msgbody = `Thuyền viên ${userInfo[event.logMessageData.leftParticipantFbId].name} vì chán sống nên đã quyết định roi nhom`;
            const msg = {
                body: msgbody,
                mentions: [
                    {
                        tag: userInfo [event.logMessageData.leftParticipantFbId].name,
                        id: event.logMessageData.leftParticipantFbId
                    }
                    
                ]
            }
            api.sendMessage(msg, event.threadID);
        }else{
            let check = client.QTV.find(item => item.threadID == event.threadID && item.adminID == api.getCurrentUserID())
            if(!check) return api.sendMessage('Thêm người dùng vào lại nhóm thất bại, có thể do t không phải QTV, nếu đã thêm thử lại sau 5s!', event.threadID)
            msgbody = `out làm sao được ${userInfo[event.logMessageData.leftParticipantFbId].name}!`
            const msg = {
                body: msgbody,
                mentions: [
                    {
                        tag: userInfo [event.logMessageData.leftParticipantFbId].name,
                        id: event.logMessageData.leftParticipantFbId
                    }
                    
                ]
            }
            api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (err) =>{
                if(err) {
                    console.log(err)
                    return api.sendMessage('Thêm người dùng vào lại nhóm thất bại!', event.threadID)
                }
                api.sendMessage(msg, event.threadID)
            })
        }
        
        
        
    })
    
}

