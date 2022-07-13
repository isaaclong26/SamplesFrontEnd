
import{  waitForSelectors, scrollIntoViewIfNeeded, waitForConnected, waitForInViewport, waitForSelector , waitForElement, querySelectorsAll, querySelectorAll, waitForFunction} from "./recorderBoiler.js";
import puppeteer from "puppeteer"
import cheerio from "cheerio"
const crmLogin = "https://sage.solarinnovations.com/SOLAR_CRM"

const username = "marketing2";
const password = "Solar#123"


const main = async()=>{

  const timeout = 5000;
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
          width:1117,
          height:792
        }
      });
    
     const  page = await browser.newPage();
        page.setDefaultTimeout(timeout);

      // Navigate to Search Page 
      await page.goto(crmLogin)




      const login = async()=>{
        await page.type("#EWARE_USERID", username)//fill Username 
        await page.type("input[name='PASSWORD']", password) //Fill Password
        await page.keyboard.press("Enter") //submit form 
        await page.waitForNavigation(); //wait for dashboard}
      }

      const navToList = async()=>{



          await page.setViewport({"width":1117,"height":792})
          await page.addStyleTag({content: '.er_nopadb[data-reactid=".0.0.$19.1"]{display:block!important'})
          await page.waitForTimeout(2000)
          // await page.evaluateOnNewDocument(()=>{
          //   var style = document.createElement('style');
          //   style.type = 'text/css';
          //   style.innerHTML = '.body{background: red}'; // the css content goes here
          //   document.getElementsByTagName('head')[0].appendChild(style);
          // });
          // await page.waitForSelector("#main-menu-TeamCRM > strong")
          // // await page.hover("#main-menu-TeamCRM > strong")
          const btn = await page.waitForSelector("a[data-reactid='.0.0.$19.1.0.$Team CRM1.0']");
          await btn.click()
          await page.waitForNavigation();
    const element = await waitForSelectors([["aria/List View[role=\"link\"]"],["#Button_List\\ View"]], page, { timeout, visible: true });
          await scrollIntoViewIfNeeded(element, timeout);
          await element.click({
            offset: {
              x: 17.4625244140625,
              y: 11,
            },
          })
          await page.waitForNavigation();
          await page.setViewport({"width":1300,"height":792})

          // await scrollI  
          // });ntoViewIfNeeded(element2, timeout);
          // await element2.click()
          // await Promise.all(promises);
     
          // const targetPage = page;
          // const promises = [];
          // promises.push(targetPage.waitForNavigation());
       
          // await Promise.all(promises);
      
      }

      const changeStatus = async(status)=>{
        await page.waitForSelector("#comm_status")
        await page.select("select#comm_status", status)
        const filter = await page.waitForSelector("#Button_Filter")
        await filter.click();
      }

      
      const openRequests = async()=>{

        let table = await page.waitForSelctor
      }

      await login();
      var curUrl = page.url();
      let x = curUrl.slice(curUrl.length-2, curUrl.length)
  
      if(x === "go"){
      await page.waitForSelector("#LB")
      await page.click("#LB")
      await page.waitForNavigation();
      }

      await navToList();
      await changeStatus("InProgress")
    
}

main();