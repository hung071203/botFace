const axios = require("axios");

module.exports.config = {
  name: "bard",
  version: "1.0.0",
  credits: "Ralph",
  description: "Trả lời câu hỏi bằng AI",
  usage: "!bard [câu hỏi]",
};


module.exports.run = async function (api, event, args, client) {
    console.log(args);
    let lastQuery = "";
    if (!args[1]) {
    api.sendMessage("Cho câu hỏi vào để tìm kiếm", event.threadID, event.messageID);
    return;
    }

    const query = args.slice(1).join(" ");
    if (query === lastQuery) {
        api.sendMessage("🕰️ | Cập nhật câu trả lời cho câu hỏi trước", event.threadID, event.messageID);
        return;
    } else {
        lastQuery = query;
    }

    api.sendMessage("Đang tìm câu trả lời...", event.threadID, event.messageID);
    try {
        const response = await axios.get(`https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=${encodeURIComponent(query)}`);

        if (response.status === 200 && response.data && response.data.message) {
        const answer = response.data.message;
        const formattedAnswer = answer; // Apply font formatting
        api.sendMessage(formattedAnswer, event.threadID, event.messageID);
        
        } else {
        api.sendMessage("Hỏi câu nào bớt ngu đi!", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("😿 Lỗi không mong muốn, Trong khi tìm kiếm câu trả lời trên AI...", event.threadID, event.messageID);
        return;
    }

};

