module.exports.config = {
    name: 'lai',
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
            if (e.moneyV < 0) {
                return;
            }
            if(e.timeV == 0) return;
            let timeN = parseInt(event.timestamp);
            if (timeN >= e.timeV+60*60*1000) {
                e.moneyV += e.moneyV*0.1;
                e.timeV += 60*60*1000;
            }
        });
    }
}