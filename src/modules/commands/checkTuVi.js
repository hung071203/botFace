module.exports.config = {
    name: "checktuvi",
    version: "1.0.0",
    credits: "Ralph",
    description: "",
    tag: 'TUTIEN',
    usage: "!checktuvi",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    let findUser = client.userLevel.find(item => item.ID == event.senderID && item.threadID == event.threadID)
    if (!findUser) return api.sendMessage('Thử lại sau', event.threadID, event.messageID)
    let getLV = client.dataLevel.level[findUser.level]
    let msg = ''
    if(findUser.congphap.length == 0){
        msg += '\n(👉ﾟヮﾟ)👉Không'
    }else{
        let checkCap = []
        findUser.congphap.forEach(element => {
            
            let findCap = checkCap.find(item => item.id == element.id)
            if (!findCap) {
                checkCap.push({
                    id: element.id,
                    name: element.name,
                    power: element.power,
                    count: 1
                })
            }else{
                findCap.count ++
                findCap.power += element.power
            }
        });
        checkCap.forEach(element =>{
            const cap = ['Sơ cấp', 'Trung cấp', 'Đại thành']
            msg += `\n<${element.name}(${cap[element.count - 1]})>: +${element.power}`
        })
    }
    api.sendMessage(`Tu vi hiện tại: ${getLV.name} \nNguyên khí hiện tại: ${findUser.xp}/${getLV.xp}\nBạn đang ${findUser.tu}\nCông pháp hiện tại đang sử dụng: ${msg}`, event.threadID, event.messageID)
    

}