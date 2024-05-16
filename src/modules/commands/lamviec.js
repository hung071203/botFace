module.exports.config = {
    name: "work",
    version: "1.0.0",
    credits: "Ralph",
    description: "Kiếm tiền",
    tag: 'Money',
    usage: "!work",
};
  
  
module.exports.run = async function (api, event, args, client) {
    const arr = [
        'Bạn đã bỏ nhà đi bán thân và kiếm được ',
        'Nay bạn ra sông câu được cá to, sau khi bán đi đã thu được ',
        'Hôm nay là ngày may mắn, bạn bắt được ',
        'Đi ngang qua một quán cà phê, bạn thấy người ta để quên ví, bạn đã thấy và trộm ',
        'Trên đường đi bạn tình cờ thấy một túi tiền nằm dưới đất, bên trong là ',
        'Hôm nay bạn đi cướp ngân hàng và cướp được ',
        'Bạn đã bán 1 quả thận và kiếm được '

    ];
    console.log(event);
    const rd = Math.floor(Math.random() * 7);
    const rdM = Math.floor(Math.random() * 1000) + 120;
    const id = client.money.find(item => item.ID == event.senderID && item.threadID == event.threadID);
    if(!id) return api.sendMessage(`Có lỗi phát sinh, thử lại`, event.threadID, event.messageID);
    if (id.time != 0 && id.time + 5*60*1000 > event.timestamp) {
        var date = new Date(id.time + 5*60*1000);
        
        var localeDate = date.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
        api.sendMessage(`Bạn đã làm việc rồi, vui lòng đợi đến ${localeDate} để tiếp tục kiếm tiền!`, event.threadID, event.messageID);
        return;
    }
    if (id) {
        id.money += rdM;
        id.time = parseInt(event.timestamp) ;
        api.sendMessage(`${arr[rd]}${rdM.toLocaleString('en-US')}$`, event.threadID, event.messageID);
    }else{
        api.sendMessage(`Có lỗi phát sinh, thử lại`, event.threadID, event.messageID);
    }

}