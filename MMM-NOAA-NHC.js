/* Magic Mirror Module: MMM-NOAA-NHC
 * Version: 1.0.0
 *
 * By Akira Heid https://github.com/akiraheid/
 * MIT Licensed.
 */

Module.register('MMM-NOAA-NHC', {

	defaults: {
		showPacific: true,
		showAtlantic: true,
		updateInterval: 60 * 60 * 1000, // Every hour
	},


	start: function() {
		console.log('starting ' + this.name)
		Log.info('Starting module: ' + this.name)

		if (this.data.classes === 'MMM-NOAA-NHC') {
			this.data.classes = 'bright medium'
		}

		// Set up the local values, here we construct the request url to use
		this.loaded = false
		this.tropicalGraphicalURL = 'https://www.nhc.noaa.gov/gtwo.xml'

		// Trigger the first request
		this.getData()
	},


	getData: function() {
		// Make the initial request to the helper then set up the timer to perform
		// the updates
		this.sendSocketNotification(
				'GET-TROPICAL-DATA', this.tropicalGraphicalURL);

		setTimeout(this.getData, this.config.interval, this);
	},


	getStyles: function() {
		return []
	},


	getDom: function() {
		// Set up the local wrapper
		var wrapper = document.createElement('div')

		if (this.loaded) {
			var row = document.createElement('tr')
			if (this.config.showPacific && this.result.pacificActive) {
				var column = document.createElement('td')
				var img = document.createElement('img')
				img.setAttribute('src', 'https://www.nhc.noaa.gov/xgtwo/resize/two_pac_5d0_resize.gif')
				img.setAttribute('alt', 'Could not load Pacific image')
				column.appendChild(img)
				row.appendChild(column)
			}

			if (this.config.showAtlantic && this.result.atlanticActive) {
				console.log('atlantic')
				var column = document.createElement('td')
				var img = document.createElement('img')
				img.setAttribute('src', 'https://www.nhc.noaa.gov/xgtwo/resize/two_atl_5d0_resize.gif')
				img.setAttribute('alt', 'Could not load Atlantic image')
				column.appendChild(img)
				row.appendChild(column)
			}

			var imageTable = document.createElement('table')
			imageTable.appendChild(row)
			wrapper.appendChild(imageTable)
		} else {
			wrapper.innerHTML = "Loading NOAA NHC data..."
		}

		return wrapper
	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GOT-TROPICAL-DATA') {
			this.loaded = true
			this.result = payload.result
			this.updateDom(1000)
		}
	}
})