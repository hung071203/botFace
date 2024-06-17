const figlet = require('figlet');
module.exports.config = {
    name: "test",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tài xỉu nhiều người chơi",
    tag: 'game',
    usage: "!taixiu [join [t/x] [Mức tiền cược]: tham gia phòng /out: rời phòng /run: Bắt đầu ]",
};
  
  
module.exports.run = async function (api, event, args, client) {
    
    try {
        api.handleMessageRequest(event.threadID, true,(err, data) =>{
            if(err) return console.log(err)
            console.log(data)
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports.handleEvent = async function (api, event, client) {
    // console.log('handleEvent');
}