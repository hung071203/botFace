module.exports = (api, client) => {

    for (let i = 0; i < client.onload.length; i++) {

        client.onload[i].onload (api, client);
    };

    api.setOptions({ listenEvents: true });
    api.listenMqtt((err, event) => {

        client.events.forEach((value, key) => {
            client.events.get(key).run(api, event, client)
        });
        // console.log(client.handleReply, client.QTV, process.env.QTVOL, process.env.CHECK, process.env.YT);
        
        if (process.env.YT == 1 && event.type === 'message_reply' && client.handleReply != []) {
            console.log('tesst1', event, client.handleReply);
                
            client.handleReply.forEach(e => {
                if (e.name == 'yt') {
                    client.commands.get (e.name).handleReply(api, event, client, e)
                }
            });
            
        }

        if (client.handleReply.length>0) {
            console.log('hhhhh');
            client.handleReply.forEach(e => {
                if(e.name == 'yt')return;
                client.commands.get (e.name).handleReply(api, event, client, e);
            });
            
        }

        if (!event) {
            return;
        }
        if (event.senderID) {
            
            let args = '';
            console.log(event);
            if (event && event.body) {
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
                //QTV
                let checkQTV = client.QTVOL.find(item => item.threadID == event.threadID);
                if(!checkQTV) return;
                if(client.QTV.length == 0) return api.sendMessage('Có lỗi xảy ra, thử lại!', event.threadID, event.messageID);

                let admin = client.QTV.find(item => item.threadID == event.threadID && event.senderID == item.adminID)
                console.log(checkQTV, admin);
                if(checkQTV.checkid == 1 && !admin) return api.sendMessage('Chỉ quản trị viên dùng được bot', event.threadID, event.messageID);
                
                //code
                args = event.body.slice (client.config.PREFIX.length).trim().split(' ');
                client.commands.forEach((value, key) => {
                    listCommands.push(key);
                });
                
                if (!listCommands.includes(args[0])) return api.sendMessage('Lệnh của bạn không tồn tại!!', event.threadID, event.messageID);
                client.commands.get (args[0]).run(api, event, args, client);
            }
            
        }
        

    })
    
}