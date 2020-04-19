/* Magic Mirror
 * Module: MMM-KickerManager
 * DanielHfnr
 * MIT Licensed.
 */

Module.register("MMM-KickerManager", {

	defaults: {
		updateInterval: 60 * 60 * 1000, // Every hour.
        animationSpeed: 1000, // One second.
        username: "",
        password: "",
		debug: false,
		headless: true
	},

	start: function() {
        this.loaded = false;
        
		Log.info("Starting module: " + this.name);
		this.updateLeagueTable(this);
		setInterval(() => {
            this.updateLeagueTable(this);
        	}, this.config.updateInterval);
	},

	getStyles: function() {
		return ["MMM-KickerManager.css", "font-awesome.css"];
	},

	//Define header for module.
	getHeader: function() {
		return this.data.header;
	},


	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");


		return wrapper;
	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === "LEAGUE_TABLE") {

		}
    },


    updateLeagueTable: function() {
		this.sendSocketNotification("GET_LEAGUE_TABLE", this.config);
    },

});
