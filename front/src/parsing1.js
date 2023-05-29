const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://remoteok.com/');

    let jobs = await page.evaluate(() => {
        let jobElements = document.querySelectorAll('#jobsboard tr[data-id]');
        let jobs = [];

        jobElements.forEach((jobElement) => {
            let markdownElement = jobElement.querySelector('div.markdown');
            let text = "";
            if (markdownElement) {
                text = markdownElement.textContent.trim();
            }
            jobs.push({
                text: text
            });
        });

        return jobs;
    });
    fs.writeFile('output1.json', JSON.stringify(jobs), (err) => {
        if (err) throw err;
        console.log('JSON file has been saved!');
    });

    await browser.close();
})();
