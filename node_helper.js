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
                this.initClient(payload).then(() => { 
                    if (this.config.debug === true) {
                        console.log("Getting league table...");
                    }
                    this.getLeagueTable(); 
                });
            } else {
                this.getLeagueTable(payload);
            }
            return true;
        }
    },

    getLeagueTable: function () {
        if (this.client.mustLogin()) {
            // Login
            if (this.config.debug === true) {
                console.log("Logging in...");
            }
            // Login
            var logged_in = this.client.login();
            logged_in.then(() => { 
                if (this.config.debug === true) {
                    console.log("Retrieving league table data...");
                }
                // Get actual league table 
                this.client.getLeagueTable().then(table => {
                    this.leagueTable = table;
                    if (this.config.debug === true) {
                        console.log("League table:  ");
                        for (let i in this.leagueTable.table) {
                            console.log("Platz: " + this.leagueTable.table[i].platz + "     Teamname: " + this.leagueTable.table[i].teamname + "     Punkte: " + this.leagueTable.table[i].punkte);
                        }
                    } 
                    this.sendSocketNotification("LEAGUE_TABLE", this.leagueTable);
                });
            });


        } else {
            
            if (this.config.debug === true) {
                console.log("Relaunching session...");
            }

            this.client.relaunchSession();
  
        }
    },

    initClient: function (payload) {
        if (this.config.debug === true) {
            console.log("Initializing client...");
        }
        
        this.client = new KickerClient(payload, this.path);
        var connected = this.client.init();
        connected.then(() => { 
            if (this.config.debug === true) {
                console.log("Initializing client finished...");
            }
        });
        return connected; 
    },
});