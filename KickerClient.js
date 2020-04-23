const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
//const fs = require('fs');
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
        return this.isEmpty(this.currentCookies);
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
        this.currentCookies = await this.page.cookies();
        //fs.writerFileSync('./cookies.json', JSON.stringify(this.currentCookies));
        // Instead of filesystem --> save in variable
    }

    async relaunchSession() {      
        await this.page.setCookie(...this.currentCookies);
        
        return true;
    }

    async closeBrowser() {
        await this.browser.close();
        return true;
    }

    async getLeagueTable() {
        await this.page.goto(standings_url, { waitUntil: 'networkidle2' });

        // Get page content as HTML.
        const content = await this.page.content();

        //Load content in cheerio.
        const $ = cheerio.load(content);
        
        let stat = $('[summary="Spieltagswertung"]');
        let tbody = stat.children();
        let table_rows = tbody.children();

        let table = [];

        table_rows.each(function (i, e) {

            if ($(e).children('td.first').length && 
                $(e).children('td').children('a.link').length &&
                $(e).children('td.last.alignright').length) {

                var platz = $(e).children('td.first').text();  
                var tendenz = $(e).find('img').attr('src');
                var teamname = $(e).children('td').children('a.link').text();
                var punkte = $(e).children('td.last.alignright').text();

                table.push({"platz":platz, "teamname":teamname, "tendenz":tendenz, "punkte":punkte});
            }
        });
        return table;
    }

    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

}

module.exports = KickerClient;