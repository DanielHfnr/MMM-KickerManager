"use strict";

/* Magic Mirror
 * Module: MMM-KickerManager
 * DanielHfnr
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const BringClient = require("./KickerClient");


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
            this.client.login();

        } else {
            this.client.relaunchSession();
            // Get Table
            this.leagueTable = this.client.getLeagueTable();

            console.log("League table:  " + this.leagueTable);

            this.sendSocketNotification("LEAGUE_TABLE", {leagueTable: this.leagueTable});
        }
    },

    initClient: function (payload) {
        this.client = new KickerClient(payload, this.path);

        
    }
});