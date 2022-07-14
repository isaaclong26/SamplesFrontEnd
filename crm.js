// Import Dependencies
import {
  waitForSelectors,
  scrollIntoViewIfNeeded,
  waitForConnected,
  waitForInViewport,
  waitForSelector,
  waitForElement,
  querySelectorsAll,
  querySelectorAll,
  waitForFunction
} from "./recorderFunctions.js";
import puppeteer from "puppeteer"
import cheerio from "cheerio"
import express, { request } from "express";
import cors from "cors"
import mongoose from "mongoose";
import fs from "fs"
// Settings 
const Settings = {
  port: process.env.PORT2 || 3002,
  crmLogin: "https://sage.solarinnovations.com/SOLAR_CRM",
  username: "marketing2",
  password : "Solar#123",
  timeout:  5000,
  headless: false,
  express: false,
  slowMo: 250
}



const sleep = async(ms)=> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Puppeteer Init + config !!! Page and Browser must be globally scoped
const browser = await puppeteer.launch({
  headless: Settings.headless,
  args: [`--window-size=1117,792`],
  defaultViewport: {
      width: 1117,
      height: 792
  },
  slowMo: Settings.slowmo
});

const page = await browser.newPage();

page.setDefaultTimeout(Settings.timeout);

// Navigate to Login Page 
await page.goto(Settings.crmLogin)

const login = async () => {
  await page.type("#EWARE_USERID", Settings.username) //fill Username 
  await page.type("input[name='PASSWORD']", Settings.password) //Fill Password
  await page.keyboard.press("Enter") //submit form 
  await page.waitForNavigation(); //wait for dashboard}
}

const navToList = async () => {
  // set viewport to avoid discrepencies 
  const setUp = async()=>{
  await page.setViewport({
    "width": 1117,
    "height": 792
  })
  // Force Dropdown menu to reveal link
  await page.addStyleTag({
    content: '.er_nopadb[data-reactid=".0.0.$19.1"]{display:block!important'
  })

await sleep(3000)}
const execute = async() =>{

  //click menu option 
  const btn = await page.waitForSelector("a[data-reactid='.0.0.$19.1.0.$Team CRM1.0']");
  await btn.click()

  // Switch to List View 
  await page.waitForNavigation();
  const element = await waitForSelectors([
    ["aria/List View[role=\"link\"]"],
    ["#Button_List\\ View"]
  ], page, {

    visible: true
  });
  await scrollIntoViewIfNeeded(element, Settings.timeout);
  await element.click({
    offset: {
      x: 17.4625244140625,
      y: 11,
    },
  })
  await page.waitForNavigation();

}

await setUp();
await execute();

}

const changeStatusFilter = async (status) => {
  await page.waitForSelector("#comm_status")
  await page.select("select#comm_status", status)
  const filter = await page.waitForSelector("#Button_Filter")
  await filter.click();
  await page.waitForNavigation();
}


const openRequests = async () => {
  var reqLinks = [];
  var reqInfo = [];

  // load cheerio for main page 
  var content = page.content();
  content
    .then(async (success) => {
        var $ = cheerio.load(success)

        // Loops through table of requests to get links
         $("table.CONTENTGRID > tbody > tr").each(async (index, element) => {
          // skips first row beacuse its headers
          if( index == 0){
            return;          } 

          let target = $(element).children()
          var blank = true;
          //loop through cols
          target.map((index, element) => {
            let testVal = $(element).html();
            // if any of the cols have values set blank to false
            if (testVal !== "&nbsp;" ){
              blank = false;
            }
          })
          if(!blank){
            //add links to Array
            reqLinks.push($(target[6]).children().attr("href"));
          }

        })
        // open page and get info
        for(let x in reqLinks){
          if(x === 4){
            console.log(reqLinks[x])
            sleep(10000)
          }


          try{
                      page.goto(`https://sage.solarinnovations.com${reqLinks[x]}`)

          }
          catch(e){
            console.log("failed at goTo")
            await sleep(3000);
            page.goto(`https://sage.solarinnovations.com${reqLinks[x]}`)

          }

          // reinit cheerio 
          await sleep(2000)
         content = page.content();
          content
            .then(async (success) => {
                 $ = cheerio.load(success)
             await page.waitForSelector("textarea#comm_note")
          let request = {
            details: $("textarea#comm_note").val(),
            subject: $("#_HIDDENcomm_subject").val(),
            person: $("#cmli_comm_personidTEXT").val(),
            requester: $("#_Datacomm_createdby").text(),
            status: $("#comm_status").val(),
            createdDate: $("#_Datacomm_createddate").text(),
          }
          reqInfo.push(request)
          console.log(request)


          // go back to table 
        //  var saveBtn = await page.waitForSelector("#Button_Save")
        //  await saveBtn.click();
        //  await page.waitForNavigation();
        
        });
            }

 


    });


}

const loginForce = async()=>{
var curUrl = page.url();
let x = curUrl.slice(curUrl.length - 2, curUrl.length)

if (x === "go") {
  await page.waitForSelector("#LB")
  await page.click("#LB")
  await page.waitForNavigation();
}  
}



await login();
await loginForce();
await navToList();
await changeStatusFilter("InProgress")
await openRequests();


if(Settings.express){
// Express SetUp
const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(cors());

mongoose.connect('mongodb+srv://isaaclong26:elco9377@cluster0.0claj.mongodb.net/samplesDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  tlsAllowInvalidHostnames: true
});


app.listen(Settings.port, () => {
  console.log(`App running on port ${Settings.port}!`);
});

app.get("/statusFilter/:filter", async (req, res) => {
    let status = req.params.filter

    changeStatusFilter(status)

    res.send("done")
  

})

}
