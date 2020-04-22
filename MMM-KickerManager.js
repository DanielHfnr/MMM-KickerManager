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
		this.leagueTable = null;
        
		Log.info("Starting module: " + this.name);
		this.updateLeagueTable(this);
		setInterval(() => {
            this.updateLeagueTable(this);
			}, this.config.updateInterval);
			
		//TODO: Update every day at 2:05 pm. On Mondays update at 12:05
		// Something like this: 
		// window.setInterval(function(){ // Set interval for checking
		// 	var date = new Date(); // Create a Date object to find out what time it is
		// 	if(date.getHours() === 8 && date.getMinutes() === 0){ // Check the time
		// 		// Do stuff
		// 	}
		// }, 60000); // Repeat every 60000 milliseconds (1 minute)

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
		this.sendSocketNotification('LOG', "Called dom generator...");
		
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading data...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var dataTable = document.createElement("table");
		dataTable.className = "small";


		for (let i in this.leagueTable) {
			var labelRow = document.createElement("tr");
			var placeCell = document.createElement("td");
			var teamCell = document.createElement("td");
			var pointsCell = document.createElement("td");

			placeCell.innerHTML = this.leagueTable[i].platz;
			teamCell.innerHTML = this.leagueTable[i].teamname;
			pointsCell.innerHTML = this.leagueTable[i].punkte;


			labelRow.appendChild(placeCell);
			labelRow.appendChild(teamCell);
			labelRow.appendChild(pointsCell);

			dataTable.appendChild(labelRow);

			//this.logConsole("Platz: " + this.leagueTable[i].platz + "     Teamname: " + this.leagueTable[i].teamname + "     Punkte: " + this.leagueTable[i].punkte);
		} 


		wrapper.appendChild(dataTable);

		return wrapper;
	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === "LEAGUE_TABLE") {
			this.loaded = true;

			// Check if empty (Game locked because of "Spielzuteilung")
			this.leagueTable = payload;
			this.sendSocketNotification('LOG', "Got socket notification: " + notification);
			this.updateDom(this.config.animationSpeed);
		}
    },


    updateLeagueTable: function() {
		this.sendSocketNotification("GET_LEAGUE_TABLE", this.config);
    },

});
