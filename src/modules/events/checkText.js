module.exports.config = {
    name: 'checknoti',
    version: '1.0.0',
    credit: 'HungDz',
    description: 'checkNoti!',
    usage: ''
}



module.exports.run = async function (api, event, client) {
    if (!event) {
        return;
    }
    return
    if (event.type == 'message' || event.type == 'message_reply') {
        let checkBT = client.QTVOL.find(e=> e.threadID == event.threadID)
        if(client.QTVOL.length == 0) return 
        if(typeof checkBT == 'undefined' || checkBT.time < parseInt(event.timestamp)) return 

        const inputURL = event.body.toLowerCase(); 
        console.log(inputURL);
        const chui = [
            "Bố mẹ đẻ ra để m chửi bậy thế à?",
            "Chửi ít thôi",
            "M là thánh chửi à, chửi ít thôi",
            "để t tụng kinh niệm phật cho m nhá, khẩu nghiệp ít thôi",
            "nói tiếng người đi bạn",
            "Chửi bậy là một biểu hiện của sự vô học"
        ]
        
        
        if(inputURL.includes(process.env.PREFIX)) return
        const i = Math.floor(Math.random() * 6);
        

        const keychui = /(dm|chó|lồn|lon| cc|dit|địt|cm|lol|dell|đéo|sv)/
        const keyngu =/(ngu | đần|)/
        const keyiu = /(iu|yêu|thích)/
        const keyname = /(t|tao|tớ|mình|m|mày|cậu)/

        

        if(!inputURL.includes('bot')) {
            if (keychui.test(inputURL)) return  api.sendMessage(chui[Math.floor(Math.random() * chui.length)], event.threadID, event.messageID);
        }else{
            if (keychui.test(inputURL)) return  api.sendMessage('clm mày nungws hả:)?', event.threadID, event.messageID);
            if (keyiu.test(inputURL) || (keyiu.test(inputURL) && keyname.test(inputURL))) return  api.sendMessage('Tớ thích cậu lắm á:>', event.threadID, event.messageID);
            if (keyngu.test(inputURL)) return  api.sendMessage('Lại ngáo chó r!', event.threadID, event.messageID);    
        }
    }
}
