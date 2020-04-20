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
		this.leagueTableBody = null;
		this.leagueTable = null;
        
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
		Log.info("Called dom generator...");

		
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading data...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var dataTable = document.createElement("table");
		dataTable.className = "small";
		dataTable.appendChild(this.leagueTableBody);
		wrapper.appendChild(dataTable);

		return wrapper;
	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === "LEAGUE_TABLE") {
			this.loaded = true;
			this.leagueTable = payload.table;
			this.leagueTableBody = payload.tbody;
			Log.info("Got socket notification: " + notification);

			this.updateDom(this.config.animationSpeed);
		}
    },


    updateLeagueTable: function() {
		this.sendSocketNotification("GET_LEAGUE_TABLE", this.config);
    },

});
