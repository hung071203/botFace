module.exports.config = {
    name: 'autoBan',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}
arrBan =[]
module.exports.run = function (api, event, client) {
    if (!event) {
        return;
    }
    if(!event.threadID) return;
    if(event.type == 'message' || event.type == 'message_reply'){
        const inputURL = event.body.toLowerCase(); 
        if(!inputURL.includes(process.env.PREFIX)) return
        const timeLimit = 5 * 60 * 1000
        const messageLimit = 15
        let find = arrBan.find(e => e.ID == event.senderID && e.threadID == event.threadID)
        if(!find){
            arrBan.push({
                ID: event.senderID,
                threadID: event.threadID,
                count: 1,
                timestamp: parseInt(event.timestamp) + timeLimit
            })
            return
        }

        if (find.timestamp > parseInt(event.timestamp)) {
            if (find.count <= messageLimit) return find.count ++
            
            let findB  = client.Ban.find(item => item.threadID == event.threadID && item.ID == event.senderID)
            let timeBan = 30 * 60 * 1000
            if(!findB){
                client.Ban.push({
                    threadID: event.threadID,
                    ID: event.senderID,
                    des: 'Spam quá nhiều',
                    timestamp: parseInt(event.timestamp) + timeBan
                })
                return 
            }
            if(findB.timestamp > parseInt(event.timestamp)) return
            findB.timestamp += timeBan
            findB.des = 'Spam quá nhiều'
        }else{
            find.count = 1
            find.timestamp = parseInt(event.timestamp) + timeLimit
        }
    }
}

