const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const fs = require('fs');
const cookies = require('./cookies.json');

const base_url = 'https://www.kicker.de/';
const login_url = 'https://www.kicker.de/meinkicker/login';
const standings_url = 'https://manager.kicker.de/pro/Wertungen/wertunggesamt';

//let browser = null;
//let page = null;
//let currentCookies = null;
//let config = null;

class KickerClient {

    constructor(opts, modulePath) {
        this.config = opts;
        this.browser = null;
        this.page = null;
        this.currentCookies = null;



    }

    // Init browser an login 
    async init() {     
        this.browser = await puppeteer.launch({ headless: this.config.headless, executablePath: 'chromium-browser' });
        this.page = await this.browser.newPage();
        await this.page.setDefaultNavigationTimeout(0);
        await this.page.goto(base_url, {waitUntil: 'networkidle0' });

        return true;
    }
    
    async mustLogin() {
        return Object.keys(cookies).length;
    }

    async login() {
        await this.page.goto(login_url, {waitUntil: 'networkidle0' });

        await this.page.type('#kick__login-user', this.config.username, { delay: 30 });
        await this.page.type('#kick__login-pass', this.config.password, { delay: 30});
        await this.page.click('button[class="kick__btn kick__btn-block kick__btn-dark kick__btn--spinner"]');
  
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });

        return true;
    }

    async saveCookies() {     
        this.currentCookies = await page.cookies();
        fs.writerFileSync('./cookies.json', JSON.stringify(this.currentCookies));
    }

    async relaunchSession() {      
        await this.page.setCookie(...cookies);
        await this.page.goto(standings_url, { waitUntil: 'networkidle2' });
    }

    async getLeagueTable() {
        await this.page.goto(standings_url, { waitUntil: 'networkidle2' });

        // Get page content as HTML.
        const content = await this.page.content();

        //Load content in cheerio.
        const $ = cheerio.load(content);
        
        const stat = $('.tStat');

        return stat;
        /*
        let texts = await this.page.evaluate(() => {
            let data = [];
            let elements = document.getElementsByClassName('tStat');
            
            for (var element of elements)
                data.push(element.textContent);
            return data;
        });
        return texts;
        */
    }

}

module.exports = KickerClient;