
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const imageDownloader = require('image-downloader');
const crypto = require('crypto');

module.exports.config = {
    name: "img",
    version: "1.0.0",
    credits: "Ralph",
    description: "Tìm hình ảnh qua tên",
    tag: 'Công cụ',
    usage: "!img [tên muốn tìm]",
};
  

const DOWNLOAD_TIMEOUT = 5000;
const MAX_IMAGES = 6;
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const IMAGE_REGEX = new RegExp(`(${VALID_IMAGE_EXTENSIONS.join('|').replace('.', '\\.')})$`, 'i');


module.exports.run = async function (api, event, args, client) {
  const searchQuery = args.slice(1).join(' ');
  const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCrcGq4Z6W_50qDy5klltgyRjRETedXwmM&cx=42d8d00c7e1e742e5&searchType=image&q=${encodeURIComponent(searchQuery)}&filter=1`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.items.length === 0) {
      return api.sendMessage(`Không tìm thấy ảnh`, event.threadID, event.messageID);
    }

    const validImageLinks = data.items
      .filter(item => IMAGE_REGEX.test(item.link))
      .map(item => item.link)
      .slice(0, MAX_IMAGES);

    const downloadedImages = await Promise.allSettled(
      validImageLinks.map(async link => {
        const filename = generateRandomFilename();
        const filePath = path.join(__dirname, '..', '..', 'img', filename);
        try {
          await imageDownloader.image({ url: link, dest: filePath, timeout: DOWNLOAD_TIMEOUT });
          return filePath;
        } catch (error) {
          console.error(`Error downloading ${link}: ${error.message}`);
          return null;
        }
      })
    );

    const successfulDownloads = downloadedImages
      .filter(result => result.status === 'fulfilled' && typeof result.value === 'string')
      .map(result => result.value);

    if (successfulDownloads.length === 0) {
      return api.sendMessage(`Không thể tải xuống ảnh`, event.threadID, event.messageID);
    }
    console.log(downloadedImages);
    api.sendMessage(
      {
        body: `Có ${successfulDownloads.length} kết quả tìm kiếm cho từ khóa ${searchQuery}`,
        attachment: successfulDownloads.map(path => fs.createReadStream(path)),
      },
      event.threadID,
      (err, info) => {
        if (err) {
          console.error(`Error sending message: ${err.message}`);
        } else {
          successfulDownloads.forEach(filePath => {
            fs.unlink(filePath, err => {
              if (err) {
                console.error(`Error deleting file: ${err.message}`);
              }
            });
          });
        }
      },
      event.messageID
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    api.sendMessage(`Lỗi: ${error.message}`, event.threadID, event.messageID);
  }
};

function generateRandomFilename() {
  return crypto.randomBytes(16).toString('hex') + '.png';
}