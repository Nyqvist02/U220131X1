const puppeteer = require('puppeteer');
const fs = require('fs');

const scraperObject = {
    
    url: 'https://arbetsformedlingen.se/platsbanken/annonser?q=devops&l=2:CifL_Rzy_Mku',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        let scrapedData = [];
        let ctr = 0;
        //using links to go into them and collect data from the pages
        async function scrapeCurrentPage(){
            await page.waitForSelector('.result-container');
            let urls = await page.$$eval('.header-container > h3 > a', links => {
                return links.map(link => link.href);
            });
            let pagePromise = (link) => new Promise(async(resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                await newPage.goto(link);

                await newPage.waitForSelector('h1.spacing.break-title');

                //Adding text from the page to our tags. 
                dataObj['jobTitle'] = await newPage.$eval('h1.spacing.break-title', text => text.textContent);
                dataObj['companyName'] = await newPage.$eval('#pb-company-name', text => text.textContent);
                dataObj['companyLocation'] = await newPage.$eval('#pb-job-location', text => text.textContent);
                dataObj['jobDescription'] = await newPage.$eval('.section.job-description', text => text.innerHtml);
                dataObj['url'] = link;

                resolve(dataObj);
                await newPage.close();
                ctr++;
            });

            for(link in urls){
                let currentPageData = await pagePromise(urls[link]);
                console.log(currentPageData);
                scrapedData.push(currentPageData);
                // console.log(currentPageData);
                console.log(ctr);
            }
            let nextButtonExist = false;
            try{
                nextButtonExist = true;
            }
            catch(err){
                nextButtonExist = false;
            }
            try{ //If the button does not exist, keep going. This means the scraper has reached the last page!
                if(nextButtonExist){
                    await page.waitForSelector('.digi-button__icon.digi-button__icon--secondary.sc-digi-button.sc-digi-button-s');
    
                    await page.click('.digi-button__icon.digi-button__icon--secondary.sc-digi-button.sc-digi-button-s');   
                    await page.waitForSelector('.digi-button__icon.digi-button__icon--secondary.sc-digi-button.sc-digi-button-s');
    
                    await page.waitForSelector('.result-container');
    
                    return scrapeCurrentPage(); // Call this function recursively
                }
            }
            catch(err){
                console.log('Last page reached.');
            }

            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();

        let dataJSON = await JSON.stringify(data);

        fs.writeFile('./data/data.json', dataJSON, err => {
            if(err){
                console.log(err);
                return;
            }
            console.log('File has been written!');
            
        });
        // console.log(data);
        return data;
    }

}

//BROWSER
async function startBrowser(){              //start Browser and leaves a message in console
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {                         //error message
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

//PAGECONTROLLER
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await scraperObject.scraper(browser);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

let browserInstance = startBrowser();

scrapeAll(browserInstance);

module.exports = scraperObject;