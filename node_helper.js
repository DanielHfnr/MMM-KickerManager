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

module.exports = NodeHelper.create({
    
    start: function() {
		console.log("MMM-KickerManager helper started ...");
	},

    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_LEAGUE_TABLE") {
            if (!this.client) {
                this.initClient(payload);
            } else {
                this.getLeagueTable(payload);
                this.config = payload;
            }
            return true;
        }
    },

    getLeagueTable: function (payload) {
        if (this.client.mustLogin()) {
            this.initClient(payload.config);
        } else {
            // Get Table
        }
    },

    initClient: function (payload) {
        this.client = new KickerClient(payload, this.path);

    }
});