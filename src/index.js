const cheerio = require('cheerio'); 

function run() {
  // Check if the input is a URL
  if (Host.inputString().startsWith("http")) {
    try {
      const response = Http.request({
        method: "GET",
        url: Host.inputString(),
      });
      if (response.status !== 200) {
        throw new Error(`Error fetching URL: ${response.status}`);
      }
      const html = response.body;
      const $ = cheerio.load(html);

      const texts = [];
      $("article").each((_, element) => {
        texts.push(...$(element).text().trim().split("\n"));
        $(element).remove();
      });
      $("p").each((_, element) => {
        texts.push(...$(element).text().trim().split("\n"));
        $(element).remove();
      });


      Host.outputString(texts.join("\n"));
    } catch (error) {

      Host.outputString(`Error scraping URL: ${error.message}`);
    }
  } else {
    // Plain text, output directly using Host.outputString
    Host.outputString(Host.inputString());
  }
}

module.exports = { run };