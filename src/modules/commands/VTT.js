const {AssemblyAI} = require('assemblyai');

const aai = new AssemblyAI({
    apiKey: 'c4e88525321a411badff7311fa63b1d5',
});

const languagePairs = [
{ language: 'Global English', code: 'en' },
{ language: 'Australian English', code: 'en_au' },
{ language: 'British English', code: 'en_uk' },
{ language: 'US English', code: 'en_us' },
{ language: 'Spanish', code: 'es' },
{ language: 'French', code: 'fr' },
{ language: 'German', code: 'de' },
{ language: 'Italian', code: 'it' },
{ language: 'Portuguese', code: 'pt' },
{ language: 'Dutch', code: 'nl' },
{ language: 'Hindi', code: 'hi' },
{ language: 'Japanese', code: 'ja' },
{ language: 'Chinese', code: 'zh' },
{ language: 'Finnish', code: 'fi' },
{ language: 'Korean', code: 'ko' },
{ language: 'Polish', code: 'pl' },
{ language: 'Russian', code: 'ru' },
{ language: 'Turkish', code: 'tr' },
{ language: 'Ukrainian', code: 'uk' },
{ language: 'Vietnamese', code: 'vi' }
];



module.exports.config = {
    name: 'vtt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chuyển giọng nói sang văn bản',
    tag: 'Công cụ',
    usage: '!vtt',
};


module.exports.run = async function (api, event, args, client) {
    console.log(event);
    let message = '';
    languagePairs.forEach(e => {
        message += `Ngôn ngữ: ${e.language}, mã ngôn ngữ: ${e.code} \n`
    });
    message += '!vtt [mã ngôn ngữ để dùng]'
    // if (args.length > 1) {
    //     if(args[1] = 'help') return api.sendMessage(message, event.threadID, event.messageID);
    // }
    if (event.type === 'message_reply' && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const voiceAttachment = event.messageReply.attachments[0];

        // Kiểm tra loại tệp đính kèm
        if (voiceAttachment.type === 'audio') {
            const voiceUrl = voiceAttachment.url;
            let lang = 'en';
            
            // if (args.length > 1) {
            //     let check = languagePairs.find(item => item.code == args[1]);
            //     if(!check) return api.sendMessage('Mã ngôn ngữ không tồn tại!', event.threadID, event.messageID);
            //     lang = check.code;
            // }

            try {
                const data = {
                    audio: voiceUrl,
                    language_code: lang
                }

                const run = async () => {
                    const transcript = await aai.transcripts.transcribe(data);
                    console.log(transcript,transcript.text);
                api.sendMessage(`Văn bản từ âm thanh trên: \n${transcript.text}`, event.threadID, event.messageID);
                };
                run();

                
            } catch (error) {
                console.error('Error transcribing voice:', error);
                api.sendMessage('Lỗi khi chuyển đổi, Thử lại!', event.threadID, event.messageID);
            }
        } else {
            api.sendMessage('Không phải là tệp đính kèm âm thanh.', event.threadID, event.messageID);
        }
    } else {
        
        api.sendMessage('Cú pháp không hợp lệ. Trả lời tin nhắn thoại bằng lệnh !vtt.', event.threadID, event.messageID);
    }
};
