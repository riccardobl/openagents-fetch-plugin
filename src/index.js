import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
function run() {
    const inputUrls = JSON.parse(Host.inputString());

    const outputDocs = [];

    for (const url of inputUrls) {
        const response = Http.request({
            method: "GET",
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });
        if (response.status !== 200) throw new Error("Error scraping url " + response.status + " " + response.body);

        const $ = cheerio.load(response.body);
        let htmlContent = ""
        $("main").each((_, element) => {
            element = $(element);
            htmlContent += element.html();
            element.remove();
        });

        $("body").each((_, element) => {
            element = $(element);
            htmlContent += element.html();
            element.remove();
        });

        const mdContent = new TurndownService().turndown(htmlContent);
        outputDocs.push(mdContent);

    }
    Host.outputString(JSON.stringify(outputDocs));

}

module.exports = { run };