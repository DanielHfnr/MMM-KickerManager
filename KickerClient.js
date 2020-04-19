const axios = require("puppeteer");


class KickerClient {

    constructor(opts, modulePath) {

        this._init(opts);
    }

    _init(opts) {

        if (this.mustLogin()) {

        } else {

        }
    }

    mustLogin() {

    }

    login(email, password) {

    }

}

module.exports = KickerClient;