module.exports.config = {
    name: "toptuvi",
    version: "1.0.0",
    credits: "Ralph",
    description: "",
    tag: 'TUTIEN',
    usage: "!toptuvi",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let findtuvi = client.userLevel.filter(item => item.threadID == event.threadID)
    let arrTuvi = []
    findtuvi.forEach(e => {
        let check = arrTuvi.find(item => item.tu == e.tu)
        if (!check) {
            arrTuvi.push({
                tu: e.tu,
                arr: [e]
            })
        }else{
            check.arr.push(e)
        }
    });
    arrTuvi.forEach(e => {
        e.arr.sort((a, b) => b.xp - a.xp)
    })
    msgs ='[Bản xếp hạng sức mạnh các thể tu hiện tại]\n--------------------------------------------------------\n'
    arrTuvi.forEach(e => {
        msgs += `[${e.tu}]\n`
        e.arr.forEach((element, i) => {
            let user = client.money.find(item => item.ID == element.ID && item.threadID == element.threadID)
            let getLV = client.dataLevel.level[element.level]
            if(!user){
                msgs += `${i + 1}: ${element.ID} <${getLV.name}>\n`
            }else{
                msgs += `${i + 1}: ${user.name} <${getLV.name}>\n`
            }
            
        });
        msgs += '--------------------------------------------------------\n'
    })
    api.sendMessage(msgs, event.threadID, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            client.umessage.push({
                type: 'unsend',
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
            })
            
        }
    }, event.messageID)
}