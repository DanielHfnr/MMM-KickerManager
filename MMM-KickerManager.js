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
            this.checkDateTime(this);
			}, 60*1000);

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

		// Add logos
		var logoRow = document.createElement("tr");


		var positionLabel = document.createElement("th");
		positionLabel.className = "platz";
		var positionLogo = document.createElement("i");
		positionLogo.classList.add("fa", "fa-hashtag");
		positionLabel.appendChild(positionLogo);
		logoRow.appendChild(positionLabel);


		var teamnameLabel = document.createElement("th");
		teamnameLabel.className = "teamname";
		teamnameLabel.innerHTML = 'Team';
		logoRow.appendChild(teamnameLabel);

		var tendenzLabel = document.createElement("th");
		tendenzLabel.className = "tendenz";
		var tendenzlogo = document.createElement("i");
		tendenzlogo.classList.add("fa", "fa-line-chart");
		tendenzLabel.appendChild(tendenzlogo);
		logoRow.appendChild(tendenzLabel);


		var punkteLabel = document.createElement("th");
		punkteLabel.className = "punkte";
		punkteLabel.innerHTML = 'Punkte';
		logoRow.appendChild(punkteLabel);


		dataTable.appendChild(logoRow);

		// Create Table
		for (let i in this.leagueTable) {
			var tableRow = document.createElement("tr");

			const entries = Object.entries(this.leagueTable[i])
			for (const [key, value] of entries) {	
				var rowCell = document.createElement("td");
				
				switch(key) {
					case "tendenz":
						rowCell.className = "tendenz";
						var img = document.createElement("img");
						img.src = value;
						rowCell.appendChild(img);
						break;
					case "platz":
						rowCell.className = "platz";
						rowCell.innerHTML = value;
						break;
					case "teamname":
						rowCell.className = "teamname";
						rowCell.innerHTML = value;
						break;
					case "punkte":
						rowCell.className = "punkte";
						rowCell.innerHTML = value;
						break;
				}
				tableRow.appendChild(rowCell);
			}
			dataTable.appendChild(tableRow);
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

	checkDateTime: function() {
		var date = new Date(); // Create a Date object to find out what time it is
		this.sendSocketNotification('LOG', "Checking date and time...");

		// On mondays update 12:05 pm
		if (date.getDay() === 0) {
			if (date.getHours() === 12 && date.getMinutes() === 5) {
				this.sendSocketNotification('LOG', "Its monday 12:05. Lets get current standings!");
				this.updateLeagueTable(this);
			}
		} else {
			if (date.getHours() === 14 && date.getMinutes() === 5) {
				this.sendSocketNotification('LOG', "Lets get current standings!");
				this.updateLeagueTable(this);
			}
		}
	},

    updateLeagueTable: function() {
		this.sendSocketNotification("GET_LEAGUE_TABLE", this.config);
    },

});
