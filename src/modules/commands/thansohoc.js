const axios = require("axios");

module.exports.config = {
  name: "tsh",
  version: "1.0.0",
  credits: "Ralph",
  description: "Tìm hiểu về Thần số học của bản thân ",
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

