const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1980, height: 1080 });
    await page.goto('https://remoteok.com/');

    let jobs = await scrapeJobs(page);
    let processedOffsets = new Set(jobs.map(job => job.offset));

    while (jobs.length < 50) {
        console.log(`Found ${jobs.length} jobs. Scrolling down to load more...`);
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        try {
            await page.waitForFunction(
                (prevCount) => document.querySelectorAll('#jobsboard tr[data-id]').length > prevCount,
                { timeout: 30000, polling: 1000 },
                jobs.length
            );
        } catch (e) {
            console.log(`Timed out waiting for more job postings. Found ${jobs.length} jobs.`);
            break;
        }

        let newJobs = await scrapeJobs(page);
        newJobs = newJobs.filter(job => !processedOffsets.has(job.offset)); // Filter out duplicate offsets
        jobs = jobs.concat(newJobs);
        newJobs.forEach(job => processedOffsets.add(job.offset));
    }

    fs.writeFile('output.json', JSON.stringify(jobs), (err) => {
        if (err) throw err;
        console.log(`Found ${jobs.length} jobs. JSON file has been saved!`);
    });

    await browser.close();
})();

async function scrapeJobs(page) {
    let jobElements = await page.$$('#jobsboard tr[data-offset]:is([data-id])');

    let jobs = [];

    for (let jobElement of jobElements) {
        let offset = await page.evaluate((element) => element.getAttribute('data-offset'), jobElement);
        let title = null;
        let titleElement = await jobElement.$('h2[itemprop="title"]');
        if (titleElement) {
            title = await page.evaluate(titleElement => titleElement.textContent.trim(), titleElement);
        }

        let company = null;
        let companyElement = await jobElement.$('h3[itemprop="name"]');
        if (companyElement) {
            company = await page.evaluate(companyElement => companyElement.textContent.trim(), companyElement);
        }

        let location = null;
        let locationElements = await jobElement.$$('div.location');
        if (locationElements.length > 0) {
            location = await Promise.all(locationElements.map(async el => {
                return await page.evaluate(locationEl => locationEl.textContent.trim(), el);
            }));
        }

        let experience = null;
        let tagElements = await jobElement.$$('div.tag h3');
        if (tagElements.length > 0) {
            experience = await Promise.all(tagElements.map(async el => {
                return await page.evaluate(tagEl => tagEl.textContent.trim(), el);
            }));
        }

        let createdAt = null;
        let timeElement = await jobElement.$('td.time time');
        if (timeElement) {
            createdAt = await page.evaluate(timeEl => timeEl.getAttribute('datetime'), timeElement);
        }
        let imageUrl = null;
        let imageElement = await jobElement.$('img.logo');
        if (imageElement) {
            imageUrl = await page.evaluate(imageEl => imageEl.getAttribute('data-src'), imageElement);
        }

        let priceFrom = null;
        let priceTo = null;
        if (location && location.length > 0) {
            const priceIndex = location.findIndex(loc => loc.includes('💰'));
            if (priceIndex !== -1) {
                const priceRange = location[priceIndex].replace('💰', '').trim();
                [priceFrom, priceTo] = priceRange.split(' - ');
                priceFrom = priceFrom.replace(/\D/g, '');
                priceTo = priceTo.replace(/\D/g, '');
                location.splice(priceIndex, 1);
            }
        }
        let markdownElement = await jobElement.$('div.markdown');
        let about = "";
        if (markdownElement) {
            about = await page.evaluate(markdownEl => markdownEl.textContent.trim(), markdownElement);
        }
        
        jobs.push({
            offset,
            title,
            company,
            location,
            experience,
            createdAt,
            imageUrl,
            priceFrom,
            priceTo,
            about: about
        });
        if (priceFrom) {
            jobs[jobs.length - 1].priceFrom = [priceFrom + 'k'];
          }
          
          if (priceTo) {
            jobs[jobs.length - 1].priceTo = [priceTo + 'k'];
          }
          
    }

    return jobs;
}
