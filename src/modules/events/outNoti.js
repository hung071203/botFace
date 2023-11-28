module.exports.config = {
    name: 'outNoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, args, client) {
    if (event.logMessageType != 'log:unsubscribe') return;
    console.log(event);
    api.getUserInfo(event.logMessageData.leftParticipantFbId, (err, userInfo) => {
        msgbody = `Thuyền viên ${userInfo[event.logMessageData.leftParticipantFbId].name} vì chán sống nên đã quyết định roi nhom`;
        msg = {
            body: msgbody,
            mentions: [
                {
                    tag: userInfo [event.logMessageData.leftParticipantFbId].name,
                    id: event.logMessageData.leftParticipantFbId
                }
                
            ]
        }
    api.sendMessage(msg, event.threadID);
    })
}

