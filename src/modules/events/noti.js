

module.exports.config = {
    name: 'noti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, client) {

    // Hàm được thực thi khico ev bat ki xay ra
    // console.log(event)
    // if (!event) {
    //     return;
    // }
    // if (event.threadID) {
    //     api.getThreadInfo(event.threadID, (err, info) => {
    //         if (err) {
    //             console.log(err.error);
    //         } else {
    //             client.QTV.length = 0;

    //             for (let index = 0; index < info.adminIDs.length; index++) {
    //                 client.QTV.push({
    //                     threadID: event.threadID,
    //                     adminID: info.adminIDs[index].id
    //                 })
                    
    //             } 
    //         }
    
    //     })
    // }
    

}


module.exports.onload = function (api, client) {
// Hàm được thực thi khi bpt khởi chay



console.log("noti@!")
}