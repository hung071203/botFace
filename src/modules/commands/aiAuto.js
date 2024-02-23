const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require('path');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.APIG);
module.exports.config = {
  name: "aiA",
  version: "1.0.0",
  credits: "Ralph",
  description: "Trả lời câu hỏi bằng AI 2.0",
  tag: 'AI',
  usage: "!aiA",
};

let chatHis = []
module.exports.run = async function (api, event, args, client) {
  
  let findHis = chatHis.find(item => item.ID == event.senderID)
  if (!findHis) {
    chatHis.push({
      ID:event.senderID,
      his:[
        {
          role: "user",
          parts: "Chào bạn!",
        },
        {
          role: "model",
          parts: "Tôi có thể giúp gì được cho bạn?",
        }
      ]
    })
    findHis = chatHis.find(item => item.ID == event.senderID)
    api.sendMessage('tự động chat với bot đã được kích hoạt!', event.threadID, (error, info) => {
      if (error) {
          console.log(error);
      } else {
          
          client.handleReply.push({
              type: 'autochat',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              hisU: findHis
          })
      }
      }, event.messageID)
  }else{
    chatHis = chatHis.filter(item => item.ID != event.senderID)
    client.handleReply = client.handleReply.filter(item => item.author != event.senderID)
    api.sendMessage('Tự động chat với bot đã tắt!', event.threadID, event.messageID)
  }
}

module.exports.handleReply = async function (api, event, client, hdr) {
  if(!event) return
  if(!event.senderID) return
  if(event.senderID != hdr.author) return
  let query = event.body
  let args = event.body.trim().split(' ')
  if(args[0].includes(process.env.PREFIX)) return
  if (event.type == 'message_reply') {
      if (event.messageReply.attachments.length == 0) {
          const lastQuery = event.messageReply.body
          query = `${lastQuery}\n${query}`
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
  let findHis = hdr.hisU
  
  api.sendMessage('Đang tìm câu trả lời...', event.threadID, event.messageID);
  const text = await runN(query, findHis.his);
  findHis.his.push({
    role: "user",
    parts: query,
  })
  findHis.his.push({
    role: "model",
    parts: text,
  })
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
        text = error.message;
        
      }
    return text;
}

async function runN(prompts, his) {
    let text = '';
    console.log(his);
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
        const chat = model.startChat({
          history: his,
        });
      
        const msg = prompts;
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        text = response.text();
        
      } catch (error) {
        
        text = error.message;
        
      }
      return text;
}