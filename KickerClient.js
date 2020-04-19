const puppeteer = require('puppeteer');
const fs = require('fs');
const cookies = require('./cookies.json');

const base_url = 'https://www.kicker.de/';
const login_url = 'https://www.kicker.de/meinkicker/login';
const standings_url = 'https://manager.kicker.de/pro/Wertungen/wertunggesamt';

let browser = null;
let page = null;
let currentCookies = null;

class KickerClient {

    constructor(opts, modulePath) {
   
        (async () => {
            await this.page.setDefaultNavigationTimeout(0);

            this.browser = await puppeteer.launch({ headless: opts.headless, executablePath: 'chromium-browser' });
            this.page = await this.browser.newPage();
            await this.page.goto(base_url, {waitUntil: 'networkidle0' });

        })();
    }

    async mustLogin() {
        return Object.keys(cookies).length;
    }

    async login(email, password) {
        await this.page.goto(login_url, {waitUntil: 'networkidle0' });

        await this.page.type('#kick__login-user', email, { delay: 30 });
        await this.page.type('#kick__login-pass', password, { delay: 30});
        await this.page.click('button[class="kick__btn kick__btn-block kick__btn-dark kick__btn--spinner"]');
  
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
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
        
        let texts = await page.evaluate(() => {
            let data = [];
            let elements = document.getElementsByClassName('tStat');
            for (var element of elements)
                data.push(element.textContent);
            return data;
        });
        return texts;
    }

    pageLoaded() {
        try {
            await this.page.waitFor('button[a="kick__header-logo__img"]');
            return true;
        } catch(error) {
            console.log("Not loaded...");
            return false;
        }
    }
}

module.exports = KickerClient;