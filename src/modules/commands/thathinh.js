const request = require('request');

module.exports.config = {
    name: 'tt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Thơ thả thính ',
    usage: '!tt '
};

module.exports.run = async function (api, event, args, client) {
    const key = [
        'JRTfree_8387056913',
        'JRTfree_5220578604',
        'JRTfree_6503368536',
        'JRTfree_9565404844'
    ]
    const i = Math.floor(Math.random() * key.length);
    request(`https://docs-api.jrtxtracy.repl.co/saying/hearing?apikey=${key[i]}`, (err, response, body) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(body);
        const data = JSON.parse(body);
        const msg = data.data

        const id = client.money.find(item => item.ID == event.senderID&&item.threadID == event.threadID);
        if (id) {
            if (id.money<=100) {
                api.sendMessage('bạn quá nghèo để thực hiện hành động này, cần tối thiểu 100$', event.threadID,event.messageID);
            }else{
                api.sendMessage(msg+'\nĐã trừ 100$', event.threadID,(error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        
                    }
                },event.messageID);
                id.money -= 100;
            }
        }else{
            api.sendMessage('bạn quá nghèo để thực hiện hành động này, cần tối thiểu 100$!', event.threadID,event.messageID);

        }

        

    });

}