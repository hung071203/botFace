
module.exports.config = {
    name: 'short',
    version: '1.0.0',
    credit: 'YourName',
    description: ' Hiện tất cả shortcut',
    tag: 'shortcut',
    usage: '!short'
};
 
module.exports.run = async function (api, event, args, client) {
   if(args.length == 1) {
    let msgs = `Tất cả shortcut của nhóm:\n`;
    let i=1;
    client.shortcut.forEach(e => {
        msgs+= `[${i}] ${e.name}\n`;
        i++;
    });
    api.sendMessage(msgs, event.threadID, event.messageID);
    return;
   }
   
    
}
