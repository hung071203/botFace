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
  
let chatHis = []
module.exports.run = async function(api, event, args, client) {
  if (args.length <= 1) {
      api.sendMessage('Cú pháp không hợp lệ', event.threadID, event.messageID);
      return;
  }

  let query = args.slice(1).join(" ");

  if (event.type === 'message_reply') {
      if (event.messageReply.attachments.length === 0) {
          const lastQuery = event.messageReply.body;
          query = `${lastQuery}\n${args.slice(1).join(" ")}`;
      } else if (event.messageReply.attachments[0].type === 'photo') {
          const filename = `${Date.now()}.jpeg`;
          const filePath = path.join(__dirname, '..', '..', 'img', filename);

          const response = await axios({
              method: 'get',
              url: event.messageReply.attachments[0].url,
              responseType: 'stream'
          });

          response.data.pipe(fs.createWriteStream(filePath));

          response.data.on('end', async () => {
              console.log('Ảnh đã được tải thành công và lưu vào:', filePath);
              const text = await run(query, filePath);
              api.sendMessage(text, event.threadID, event.messageID);
              fs.unlink(filePath, (err) => {
                  if (err) {
                      console.error('Lỗi khi xóa ảnh:', err);
                  } else {
                      console.log('Tệp ảnh đã được xóa thành công');
                  }
              });
          });

          response.data.on('error', (err) => {
              console.error('Lỗi khi tải ảnh:', err);
          });

          return;
      }
  }

  console.log(query);

  let findHis = chatHis.find(item => item.ID === event.senderID);
  if (!findHis) {
      chatHis.push({
          ID: event.senderID,
          his: []
      });
      findHis = chatHis.find(item => item.ID === event.senderID);
  }

  const text = await runN(query, findHis.his);
  
  console.log(findHis.his);
  
  api.sendMessage(text, event.threadID, event.messageID);
};

function fileToGenerativePart(path, mimeType) {
  return {
      inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType
      }
  };
}

async function run(prompts, filePath) {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt = prompts;
      const imageParts = [fileToGenerativePart(filePath, "image/jpeg")];
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      return response.text();
  } catch (error) {
      console.error("Lỗi khi chạy hàm run:", error);
      return error.message;
  }
}

async function runN(prompts, his) {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({ history: his });
      const result = await chat.sendMessage(prompts);
      const response = await result.response;
      return response.text();
  } catch (error) {
      console.error("Lỗi khi chạy hàm runN:", error);
      his = []
      return error.message;
  }
}