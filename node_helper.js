"use strict";

/* Magic Mirror
 * Module: MMM-KickerManager
 * DanielHfnr
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const KickerClient = require("./KickerClient");


let client;
let config;
let leagueTable;

module.exports = NodeHelper.create({
    
    start: function() {
		console.log("MMM-KickerManager helper started ...");
	},

    socketNotificationReceived: function (notification, payload) {
        this.config = payload;
        if (notification === "GET_LEAGUE_TABLE") {
            if (!this.client) {
                this.initClient(payload);
                this.getLeagueTable(payload);
            } else {
                this.getLeagueTable(payload);
            }
            return true;
        }
    },

    getLeagueTable: function (payload) {
        if (this.client.mustLogin()) {
            // Login
            if (this.config.debug === true) {
                console.log("Logging in...");
            }

            do {

            } while(this.client.pageLoaded);

            this.client.login(this.config.username, this.config.password);

        } else {
            
            if (this.config.debug === true) {
                console.log("Relaunching session...");
            }

            this.client.relaunchSession();
            // Get Table
            this.leagueTable = this.client.getLeagueTable();

            console.log("League table:  " + this.leagueTable);

            this.sendSocketNotification("LEAGUE_TABLE", {leagueTable: this.leagueTable});
        }
    },

    initClient: function (payload) {
        if (this.config.debug === true) {
            console.log("Initializing client...");
        }
        
        this.client = new KickerClient(payload, this.path);
    }
});