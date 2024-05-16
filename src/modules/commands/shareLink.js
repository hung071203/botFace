module.exports.config = {
    name: 'link',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chia sẻ liên kết',
    usage: '!link [text] [url]'
};
  
module.exports.run = async function (api, event, args, client) {
    if(!isURL(args[args.length - 1])) return api.sendMessage('Url không đúng định dạng!', event.threadID, event.messageID)
    let text = args.slice(1, -1).join(" ")
    
    api.shareLink(text, args[args.length - 1], event.threadID, (err, data) => {
        if(err) {
            console.log(err);
        }
    })
};
function isURL(text) {
    // Biểu thức chính quy để kiểm tra URL
    const urlRegex = /^(?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
    return urlRegex.test(text);
}
  