module.exports.config = {
    name: 'joihNoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'ng tham gia!',
    usage:''
}

module.exports.run = function (api, event, args, client) {
    // Hàm được thực thi khico ev bat ki xay ra
    return;
    if (!event) {
        return;
    }
    if (event.logMessageType != 'log:subscribe') return;
    console.log(event)
    api.getThreadInfo (event.threadID, (err, info) => {
    msgbody = `Chào mừng ${event.logMessageData.addedParticipants[0].fullName} đã đến với băng hải tặc ${info.threadName}\n`;
    msgbody+= `Bạn là thành viên thứ ${info.participantIDs.length} của băng\n`;
    msgbody+= "Hãy cố gắng tương tác đề không bị thuyền trưởng đá khỏi băng nhé!!";
    
    msg = {
        body: msgbody,
        mentions: [
            {
            tag: event.logMessageData.addedParticipants[0].fullName,
            id: event.logMessageData.addedParticipants[0].userFbId
            }
        ]
    }
    api.sendMessage(msg, event.threadID);
    })
}

