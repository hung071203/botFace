const {readdirSync} = require("fs");
const path = require('path');

module.exports = (client) => {
    const commandPath = path.join(__dirname, '..','modules', 'commands');
    const commandFile = readdirSync(commandPath).filter(File => File.endsWith('.js'));
    
    var commandCount = 0,
        handlerCount = 0,
        noprefixCount = 0;

    for(const file of commandFile){
        command = require(commandPath + `/${file}`);
        
        if (!command.config.name) return;
        
        if (command.run) {
            commandCount++;
            client.commands.set(command.config.name, command);
        }

        if (command.handleReply) {
            handlerCount++;
        }

        if (command.noprefix) {
            noprefixCount++;
            client.noprefix.set(command.config.name, command);
        }

        if (command.onload) {
            client.onload.push(command)
        }
    }
    
    console.log('thanh cong' + commandCount + 'lenh va '+noprefixCount, handlerCount +'lenh noprefix/handel');
}