const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require('path');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.APIG);
module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "Ralph",
    description: "Trả lời câu hỏi bằng AI",
    tag: 'AI',
    usage: "!ai [câu hỏi]",
  };
  
  
module.exports.run = async function (api, event, args, client) {
    
    if (args.length <=1) {
        api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
        return;
    }
    let query = args.slice(1).join(" ");
    if (event.type == 'message_reply') {
        if (event.messageReply.attachments.length == 0) {
            const lastQuery = event.messageReply.body
            query = `${lastQuery}\n${args.slice(1).join(" ")}`
        }else{
            if (event.messageReply.attachments[0].type == 'photo') {
                const filename = `${Date.now()}.jpeg`;
                const filePath = path.join(__dirname, '..','..','img',filename);
        
                axios({
                    method: 'get',
                    url: event.messageReply.attachments[0].url,
                    responseType: 'stream',
                })      
                .then(response => {
                    // Ghi dữ liệu từ phản hồi vào một tệp tin
                    response.data.pipe(fs.createWriteStream(filePath));
                
                    // Bắt sự kiện khi tải xong
                    response.data.on('end', async () => {
                        console.log('Ảnh đã được tải thành công và lưu vào:', filePath);
                        api.sendMessage('Đang tìm câu trả lời...', event.threadID, event.messageID);
                        const text = await run(query, filePath);
                        api.sendMessage(text, event.threadID, event.messageID);
                        
                    });
                })
                .catch(error => {
                    console.error('Lỗi khi tải ảnh:', error);
                });  
        
                setTimeout(() => {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                        console.error('Error deleting file:', err);
                        } else {
                        console.log('img file deleted successfully');
                        }
                    });
                }, 60000);
    
                return;
            }
        }
        
    }
    console.log(query);
    
    api.sendMessage('Đang tìm câu trả lời...', event.threadID, event.messageID);
    const text = await runN(query);
    api.sendMessage(text, event.threadID, event.messageID);

}  


function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
}

async function run(prompts, filePath) {
    let text = '';
    try {
        // For text-and-image input (multimodal), use the gemini-pro-vision model
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
        const prompt = prompts;
    
        const imageParts = [
        fileToGenerativePart(filePath, "image/jpeg"),
        ];
        
    
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        text = response.text();
    } catch (error) {
        console.error("An error occurred:", error);
        text = "Văn bản không được xử lý vì có thể chứa từ ngữ nhạy cảm!";
        
      }
    return text;
}

async function runN(prompts) {
    let text = '';
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: "Hello",
            },
            {
              role: "model",
              parts: "Great to meet you. What would you like to know?",
            },
          ],
        });
      
        const msg = prompts;
        // // For multi-turn conversations (like chat)
        // const history = await chat.getHistory();
        // const msgContent = { role: "user", parts: [{ text: msg }] };
        // const contents = [...history, msgContent];
        // const { totalTokens } = await model.countTokens({ contents });
        // console.log(contents);
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        text = response.text();
        
      } catch (error) {
        console.error("An error occurred:", error);
        text = "Văn bản không được xử lý vì có thể chứa từ ngữ nhạy cảm!";
        
      }
      return text;
}