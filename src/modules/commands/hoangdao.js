const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.APIG);
module.exports.config = {
  name: "12hd",
  version: "1.0.0",
  credits: "Ralph",
  description: "Tìm hiểu về cung hoàng đạo dựa vào ngày tháng năm sinh ",
  tag: 'mê tín',
  usage: "!12hd [dd/mm/yyyy]",
};


module.exports.run = async function (api, event, args, client) {
    console.log(args);
    let lastQuery = "";
    if (!args[1]) {
    api.sendMessage("Ngày tháng năm sinh vào", event.threadID, event.messageID);
    return;
    }

    const q = args.slice(1).join(" ");
    const query = `cho tôi biết ngày ${q} thuộc cung hoàng đạo nào và tất cả những thông tin về cung hoàng đạo đó`;
    api.sendMessage('Đang tìm câu trả lời...', event.threadID, event.messageID);
    const text = await runN(query);
    api.sendMessage(text, event.threadID, event.messageID);

};
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

