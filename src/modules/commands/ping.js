
module.exports.config = {
    name: 'ping',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Ping! nội dung đến mọi người',
    tag: 'system',
    usage: '!ping [nội dung]',
};

module.exports.run = async function (api, event, args, client) {
    let text = args.slice(1).join(" ");
    msgbody = `@Mọi người ${text}\n`;
    msg = {
        body: msgbody,
        mentions: [
            {
            tag: '@Mọi người',
            id: event.threadID
            }
        ]
    }
    api.sendMessage(msg, event.threadID);

    
};

module.exports.noprefix = function (api, event, args, client) {
    // Tương tự như trên nhưng không cần prefix
    api.sendMessage("dell có gì đâu ping cc", event.threadID, event.messageID);
};

module.exports.onload = function (api, client) {
    // Hàm được thực thi khi bpt khởi chạy
    console.log('onload!');
};
