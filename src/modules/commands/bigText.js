const figlet = require('figlet');
module.exports.config = {
    name: "bigtext",
    version: "1.0.0",
    credits: "Ralph",
    description: "văn bản lớn",
    usage: "!bigtext",
};

  
module.exports.run = async function (api, event, args, client) {
    if(args.length == 1) return api.sendMessage('Thiếu văn bản muốn phóng to!', event.threadID, event.messageID)
    let text = args.slice(1).join(' ')
    let a = figlet.textSync(text, {font: 'ANSI Shadow',horizontalLayout: 'default',verticalLayout: 'default',width: 0,whitespaceBreak: true })
    console.log(a);
    const msgs = `Xem trên máy tính để có hình ảnh tốt nhất\n\n${a}`
    api.sendMessage(msgs, event.threadID, event.messageID)
}