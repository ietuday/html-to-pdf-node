const axios = require('axios')
const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

async function getTemplateHtml() {

    console.log("Loading template file in memory")
    try {
        const invoicePath = path.resolve("./prediction.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject("Could not load html template");
    }
}


async function generatePdf() {

    let data = {};

    getTemplateHtml()
        .then(async (res) => {

            console.log("Compiing the template with handlebars")
            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;

            const browser = await puppeteer.launch();
            const page = await browser.newPage()

            await page.setContent(html)

            await page.pdf({ path: 'prediction.pdf', format: 'A4' })

            await browser.close();
            console.log("PDF Generated")

        })
        .catch(err => {
            console.error(err)
        });
}

axios
  .post('http://13.234.78.234:3000/api/horoscop/preduction', 
  {
      "langitutde":"73:58E","gender":"male","kundalitype":"kp",
      "birthDate":{"day":"02","month":"12","year":"1992"},
      "timezone":"+05:30","language":"1","product":"","latitude":"18:34N",
      "name":"Om","dst":false,"generate":true,
      "pob":{"StateName":"Maharastra","countryName":"India",
      "districtName":"Pune","latitude":"18:34N","longitude":"73:58E",
      "placeName":"Pune","timezone":"+05:30"},
      "birthTime":{"hour":"10","minute":"10"},
      "rotatekundali":"","currentDate":"11/11/2020","currentTime":"10:34",
      "showref":true,"showupay":false,"showpdf":false,"showgochar":false
    }
    )
  .then(res => {
    console.log(res.data.data['prediction'])
    writeData(res.data.data['prediction'])
    
  })
  .catch(error => {
    console.error(error)
  })

function writeData(data){
    try {
        fs.writeFileSync('prediction.html', data, 'utf8') 
        console.log("COMPLETED");  
        generatePdf(); 
    } catch (error) {
        console.log(error);
    }
}

