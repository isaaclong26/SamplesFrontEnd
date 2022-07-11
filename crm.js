const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(pluginStealth());

const puppeteer = require('puppeteer');
let cheerio = require('cheerio');
const url = "sage.solarinnovations.com/SOLAR_CRM"
const main = async()=>{
    const browser = await puppeteerExtra.launch({
        headless: false,
    
      });
    
      page = await browser.newPage();
    
      // Navigate to Search Page 
      await page.goto(url)
}

main();