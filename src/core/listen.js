module.exports = (api, client) => {

    for (let i = 0; i < client.onload.length; i++) {

        client.onload[i].onload (api, client);
    };

    api.setOptions({ listenEvents: true });
    api.listenMqtt((err, event) => {

        client.events.forEach((value, key) => {
            client.events.get(key).run(api, event, client)
        });
        console.log(client.handleReply, client.QTV, process.env.QTVOL, process.env.CHECK, process.env.YT);
        
        if (process.env.YT == 1 && event.type === 'message_reply' && client.handleReply != []) {
            console.log('tesst1', event, client.handleReply);
            if (event.messageReply.messageID == client.handleReply[client.handleReply.length - 1].messageID && client.handleReply[client.handleReply.length - 1].author == event.senderID) {
                console.log('tesst2');
                client.commands.get (client.handleReply[client.handleReply.length - 1].name).handleReply(api, event, client)

            }else if (event.messageReply.messageID == client.handleReply[client.handleReply.length - 1].messageID && client.handleReply[client.handleReply.length - 1].author != event.senderID) {
                api.sendMessage('Chỉ người hỏi mới được rep lại tin nhắn này', event.threadID,event.messageID);
            }
            
        }
        if (process.env.CHECK == 1 && event.type == 'message_reply') {
            console.log('hhhhh');
            client.commands.get (client.handleReply[client.handleReply.length - 1].name).handleReply(api, event, client)
        }

        if (!event) {
            return;
        }
        if (event.senderID) {
            if ((process.env.QTVOL == 1 && (client.QTV.find(item => item.adminID === event.senderID) || event.senderID == process.env.ADMIN)) || process.env.QTVOL == 0) {
                let args = '';
                console.log(event);
                if (event && event.body) {
                    console.log('a');
                    // Sử dụng event.body sau khi kiểm tra
                    args = event.body.trim().split(' ');
                
                    // Tiếp tục xử lý các thao tác khác với args
                
                    listNoprefix= [];

                    client.noprefix.forEach((value, key) => {
                        listNoprefix.push(key);
                    });

                    if (listNoprefix.includes (args[0])) {
                        client.noprefix.get(args[0]).noprefix(api, event, args, client);
                    }
                    
                    listCommands = [];
                    if(!event.body.startsWith(client.config.PREFIX)) return;
                    
                    args = event.body.slice (client.config.PREFIX.length).trim().split(' ');
                    client.commands.forEach((value, key) => {
                        listCommands.push(key);
                    });
                    
                    if (!listCommands.includes(args[0])) return api.sendMessage('Lệnh của bạn không tồn tại!!', event.threadID, event.messageID);
                    client.commands.get (args[0]).run(api, event, args, client);
                }
            }else if((process.env.QTVOL == 1 && (!client.QTV.find(item => item.adminID === event.senderID) || event.senderID != process.env.ADMIN)) || process.env.QTVOL != 0){
                api.sendMessage('Chỉ QTV dùng dc bot', event.threadID,event.messageID);
            }
        }
        

    })
    
}