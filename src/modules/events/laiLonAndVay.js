module.exports.config = {
    name: 'laiL',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'Noti!',
    usage: ''
}

module.exports.run = function (api, event, client) {
    if (!event) {
        return;
    }
    if (client.money ) {
        client.money.forEach(e => {
            if (e.moneyL <= 0) {
                e.timeL =0;
                return;
            }
            let timeN = parseInt(event.timestamp);
            if (timeN >= e.timeL+ 24 * 60*60*1000) {
                if(e.moneyL > 999999999){
                    e.timeL += 24 * 60*60*1000;
                }else{
                    e.moneyL += e.moneyL*0.07;
                    e.timeL += 24 * 60*60*1000;
                }
                
            }
            
            if (e.moneyV < 0) {
                return;
            }
            if(e.timeV == 0) return;
            timeN = parseInt(event.timestamp);
            for (;timeN >= e.timeV+ 24 * 60*60*1000; ) {
                e.moneyV += e.moneyV*0.1;
                e.timeV += 24 * 60*60*1000;
                
            }
        });
    }
}