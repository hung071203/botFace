const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.APIG);
module.exports.config = {
  name: "tsh",
  version: "1.0.0",
  credits: "Ralph",
  description: "Tìm hiểu về Thần số học của bản thân ",
  tag: 'mê tín',
  usage: "!tsh [dd/mm/yyyy]",
};


module.exports.run = async function (api, event, args, client) {
    console.log(args);
    let lastQuery = "";
    if (!args[1]) {
    api.sendMessage("Ngày tháng năm sinh vào", event.threadID, event.messageID);
    return;
    }

    const q = args.slice(1).join(" ");
    const query = `cho tôi biết số chủ đạo của tôi và chi tiết mọi thứ về số chủ đạo đó biết ngày tháng năm sinh của tôi là ${q}(lưu ý số chủ đạo chỉ ra số không cần nêu cách tính)`;
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
              parts: [{ text: "Hello" }],
            },
            {
              role: "model",
              parts: [{ text: "Great to meet you. " }],
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