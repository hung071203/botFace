

module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, client) {

    // Hàm được thực thi khico ev bat ki xay ra
    console.log(event)
    if (!event) {
        return;
    }
    if (event.threadID) {
        let check = client.QTVOL.find(item => item.threadID == event.threadID);
        if (!check) {
            client.QTVOL.push({
                threadID: event.threadID,
                checkid: 0,
                remess: 0
            })
        };
        api.getThreadInfo(event.threadID, (err, info) => {
            if (err) {
                console.log(err.error);
            } else {
                if (client.QTV.length == 0) {
                    let arrs=[];
                    info.adminIDs.forEach(e => {
                        arrs.push({
                            threadID: event.threadID,
                            adminID: e.id
                        })
                    });
                    client.QTV = arrs;
                    return;
                }
                argsAD = process.env.ADMIN.trim().split(' ');
                argsAD.forEach(e => {
                    let ADMIN = client.QTV.find(item => item.threadID == event.threadID && item.adminID == e);
                    if (!ADMIN) {
                        client.QTV.push({
                            threadID: event.threadID,
                            adminID: e
                        })
                    }
                });
                
                info.adminIDs.forEach(e => {
                    let checkQTV = client.QTV.find(item => item.threadID == event.threadID && item.adminID == e.id);
                    if (!checkQTV) {
                        client.QTV.push({
                            threadID: event.threadID,
                            adminID: e.id
                        })
                    }
                });
                
            }
    
        })
    }
    

}


module.exports.onload = function (api, client) {
// Hàm được thực thi khi bpt khởi chay



console.log("noti@!")
}