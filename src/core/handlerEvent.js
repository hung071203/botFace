const {readdirSync} = require("fs");
const path = require('path');

module.exports = (client) => {
    const eventPath = path.join(__dirname, '..','modules', 'events');
    const eventFile = readdirSync(eventPath).filter(File => File.endsWith('.js'));

    var eventCount = 0;
    for(const file of eventFile){
        let event = require(eventPath + `/${file}`);
        if (!event.config.name) return;
        if (event.run) {
            eventCount++;
            client.events.set(event.config.name, event);
        }

        if (event.onload) {
            client.onload.push(event)
        }
    }
    
    console.log('thanh cong' + eventCount + 'event');
}