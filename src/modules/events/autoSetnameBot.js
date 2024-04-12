module.exports.config = {
    name: 'anb',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage:''
}

module.exports.run = function (api, event, args, client) {
    return
    if (!event) {
        return;
    }
    if(!event.threadID) return;
    const botID = api.getCurrentUserID();
    api.getThreadInfo (event.threadID, (err, info) => {
        if(err) return console.error(err);;
        console.log(info.nicknames);
        let check = info.nicknames[botID];
        if (!check || check != process.env.BOTNAME) {
            api.changeNickname(process.env.BOTNAME,event.threadID, botID, (err) => {
                if (err) return console.error(err);
            });
        }
    })
}

