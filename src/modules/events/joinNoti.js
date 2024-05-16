module.exports.config = {
    name: 'joihNoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'ng tham gia!',
    usage:''
}

module.exports.run = function (api, event, client) {
    // Hàm được thực thi khico ev bat ki xay ra
    if (!event) {
        return;
    }
    if (event.logMessageType != 'log:subscribe') return;
    console.log(event)
    let find = client.QTVOL.find(item => item.threadID == event.threadID)
    if(!find) return api.sendMessage('lỗi!', event.threadID)
    if(find.antiJoin == false){
        api.getThreadInfo (event.threadID, (err, info) => {
            msgbody = `✌️Chào mừng ${event.logMessageData.addedParticipants[0].fullName} đã đến với ${info.threadName}\n`;
            msgbody+= `👤Bạn là thành viên thứ ${info.participantIDs.length} của nhóm\nSử dụng ${process.env.PREFIX}rule để xem luật nhóm`;
            
            api.shareContact(msgbody, event.logMessageData.addedParticipants[0].userFbId, event.threadID, (err, data) => {
                if(err) {
                    console.log(err);
                }
            })
        })
    }else{
        let check = client.QTV.find(item => item.threadID == event.threadID && item.adminID == api.getCurrentUserID())
        if(!check) return api.sendMessage('Vui lòng thêm bot làm QTV để antiJoin có hiệu lực!', event.threadID)
        api.removeUserFromGroup(event.logMessageData.addedParticipants[0].userFbId, event.threadID, (err) =>{
            if(err) return console.log(err);
            api.sendMessage('Người dùng đã bị kick vì antiJoin đang có hiệu lực!', event.threadID);
        })
        
    }
}

