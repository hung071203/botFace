const {readdirSync} = require("fs");
const path = require('path');

module.exports = (client) => {
    const commandPath = path.join(__dirname, '..','modules', 'commands');
    const commandFile = readdirSync(commandPath).filter(File => File.endsWith('.js'));
    
    var commandCount = 0,
        handlerCount = 0,
        noprefixCount = 0;
        eventCount = 0


    if(client.commands.get('test')){
        console.log(client.commands.get('test').run.toString());
    }
    client.commands.clear()
    client.noprefix.clear()
    console.log(client.commands, '223232');
    for(const file of commandFile){
        require.cache[require.resolve(commandPath + `/${file}`)]
        command = require(commandPath + `/${file}`);
        
        if (!command.config.name) return;
        
        if (command.run) {
            commandCount++;
            client.commands.set(command.config.name, command);
        }

        if (command.handleReply) {
            handlerCount++;
        }

        if (command.handleEvent) {
            eventCount++;
        }

        if (command.noprefix) {
            noprefixCount++;
            client.noprefix.set(command.config.name, command);
        }

        if (command.onload) {
            client.onload.push(command)
        }
    }
    
    console.log('thanh cong' + commandCount + 'lenh va '+noprefixCount, handlerCount, eventCount +' lenh noprefix/handel/handleEvents');
}