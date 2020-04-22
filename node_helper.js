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

    stop: function() {
        console.log("Shutting down MMM-KickerManager module...")
        this.client.closeBrowser().then(() => {
            console.log("MMM-KickerManager: Browser session closed!");
        });
    },

    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
            case 'GET_LEAGUE_TABLE':
                this.config = payload;
                if (!this.client) {
                    this.initClient(payload).then(() => { 
                        this.logConsole("Getting league table...");
                        this.getLeagueTable(); 
                    });
                } else {
                    this.logConsole("Getting league table...");
                    this.getLeagueTable(payload);
                }
                break;
            case 'LOG':
                this.logConsole(payload);
                break;
        }
    },

    getLeagueTable: function () {
        if (this.client.mustLogin()) {
            // Login
            this.logConsole("Logging in...");
            var logged_in = this.client.login();
            logged_in.then(() => { 
                this.logConsole("Saving Cookies...");
                this.client.saveCookies();
                this.logConsole("Retrieving league table data...");
                // Get actual league table 
                this.client.getLeagueTable().then(table => {
                    // check if empty because of game is locked
                    if (!this.isEmpty(table.table) && !this.isEmpty(table.tbody)) {
                        this.leagueTable = table;
                        for (let i in this.leagueTable.table) {
                            this.logConsole("Platz: " + this.leagueTable.table[i].platz + "     Teamname: " + this.leagueTable.table[i].teamname + "     Punkte: " + this.leagueTable.table[i].punkte);
                        } 
                        this.logConsole("Sending socketNotification...");
                        this.sendSocketNotification("LEAGUE_TABLE", {"table":this.leagueTable.table, "tbody":this.leagueTable.tbody});
                    } else {
                        this.logConsole("League table is empty or game is locked...");
                    }
                });
            });
        } else { 
            this.logConsole("Relaunching session...");
            this.client.relaunchSession().then(() => {
                this.logConsole("Retrieving league table data...");
                // Get actual league table 
                this.client.getLeagueTable().then(table => {
                    this.leagueTable = table;
                    for (let i in this.leagueTable.table) {
                        this.logConsole("Platz: " + this.leagueTable.table[i].platz + "     Teamname: " + this.leagueTable.table[i].teamname + "     Punkte: " + this.leagueTable.table[i].punkte);
                    }
                    this.logConsole("Sending socketNotification...");
                    this.sendSocketNotification("LEAGUE_TABLE", {"table":this.leagueTable.table, "tbody":this.leagueTable.tbody});
                });
            });
        }
    },

    initClient: function (payload) {

        this.logConsole("Initializing client...");
        this.client = new KickerClient(payload, this.path);
        var connected = this.client.init();
        connected.then(() => { 
            this.logConsole("Initializing client finished...");
        });
        return connected; 
    },

    logConsole: function(txt) {
        if (this.config.debug === true) {
            console.log("MMM-KickerManager:  " + txt);
        }
    },

    isEmpty: function(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

});