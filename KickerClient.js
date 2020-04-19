const puppeteer = require('puppeteer');
const fs = require('fs');
const cookies = require('./cookies.json');

const login_url = 'https://www.kicker.de/meinkicker/login';
const standings_url = 'https://manager.kicker.de/pro/Wertungen/wertunggesamt';

class KickerClient {

    async constructor(opts, modulePath) {
   
        this.currentCookies = null;
        this.browser = await puppeteer.launch({ headless: opts.headless, executablePath: 'chromium-browser' });
        this.page = await browser.newPage();
        await this.page.setDefaultNavigationTimeout(0);

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

}

module.exports = KickerClient;