const puppeteer = require('puppeteer-core');

const requestURL = 'https://business-search.nav.com';
const company = '';
const zipCode = '';

(async () => {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Navigate to nav site and wait till load
    await page.goto(requestURL, { waitUntil: 'load'});

    //Fill First Form and Submit 
    await page.focus('#search_name');
    await page.keyboard.type(company);
    await page.focus('#search_zip_code');
    await page.keyboard.type(zipCode);
    page.click('#search-submit');

    //Wait for second page to load then click on 1st option radio button
    await page.waitForNavigation({ waitUntil: 'load'});
    await page.waitForSelector('#similar-form > label:nth-child(3) > input');
    await page.click('#similar-form > label:nth-child(3) > div');
    
    //Pause here to wait for button to appear after selecting a radio button then click
    await page.waitForSelector('#continue-btn');
    page.click('#continue-btn');

    //Wait for navigation to 3rd page in workload
    await page.waitForNavigation({ waitUntil: 'load' });

    //Find dimensions of data block and output them to rect variable
    const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if(!element){ return null;}
        const { x, y, width, height } = element.getBoundingClientRect();
        return { left: x, top: y, width, height, id: element.id};
    }, 'body > div.business-search__hero > div.free__report > div.free__report__summary');

    //screenshot just the data of the company and store in company_data.png 
    await page.screenshot({ path: 'company_data.png', omitBackground: true, clip: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
    } });    

    //Close headless browser after finish
    await browser.close();
})();