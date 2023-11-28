const {AssemblyAI} = require('assemblyai');

const aai = new AssemblyAI({
    apiKey: 'c4e88525321a411badff7311fa63b1d5',
  });

module.exports.config = {
    name: 'vtt',
    version: '1.0.0',
    credit: 'YourName',
    description: 'Chuyển giọng nói sang văn bản',
    usage: '!vtt',
};

module.exports.run = async function (api, event, args, client) {
    console.log(event);
    
    if (event.type === 'message_reply' && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const voiceAttachment = event.messageReply.attachments[0];

        // Kiểm tra loại tệp đính kèm
        if (voiceAttachment.type === 'audio') {
            const voiceUrl = voiceAttachment.url;
            console.log(voiceUrl);
            

            try {
                const data = {
                    audio_url: voiceUrl,
                    language_code: 'vi'
                }

                const run = async () => {
                    const transcript = await aai.transcripts.create(data);
                    console.log(transcript.text);
                    // Sử dụng textResult theo nhu cầu của bạn
                api.sendMessage(`Văn bản từ âm thanh trên: ${transcript.text}`, event.threadID, event.messageID);
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
