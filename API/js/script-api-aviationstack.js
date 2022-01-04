
var MAP_API = {
	// dblclick sur la map ça ouvre une pop up avec un formulaire pré rempli avec latitude et longitude
	// form input pour le nom pour ajouter un aéroport
	
	// AVIATION_API_URL: "http://api.aviationstack.com/v1/airports?access_key=29cb814b8fb33714e3444e1139f3527c",
	AVIATION_API_URL: "airports.json",

	infowindow: null,
	map : null,
	airports: null,

	initMap : function () {

		this.buildMap();
		this.fetchData();
	},

	buildMap : function () {
		var paris = { 
            lat: 48.8534, 
            lng: 2.3488 
        };

		this.map = new google.maps.Map(document.getElementById("map"), {
			center: paris,
			zoom: 2,
		});
		this.map.setOptions({disableDoubleClickZoom: true });

		this.map.addListener('dblclick', (e) => {
			const coord = e.latLng.toJSON()
			const content = `
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="airport_name" type="text" class="form-control-plaintext" placeholder="Nom de l'aéroport"/>
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="latitude" type="text" readonly class="form-control-plaintext" value="${coord.lat}" placeholder="Latitude"/>
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="longitude" type="text" readonly class="form-control-plaintext" value="${coord.lng}" placeholder="Longitude"/>
				</div>
			</div>
			<button type="submit" class="btn btn-success">Ajouter</button>
			`
			var el = document.createElement('form')
			el.innerHTML = content



			if (this.infowindow)this.infowindow.close();

			this.infowindow = new google.maps.InfoWindow({
				content: el,
				position: coord,
			});
			this.infowindow.open({
				map: this.map
			});

			// $('#map').on('submit', '.add-new-airport', function(e){
			// 	e.preventDefault()
			// 	var form = $(this).eq(0).serializeArray()
			// 	var airport = []

			// 	form.forEach(el => {
			// 		if(el.value == '') el.value = "/"

			// 	});
			// })
			// document.querySelector('.add-new-airport').addEventListener('submit', (e) => {
			// 	e.preventDefault()
			// 	console.log('test')
			// })

		})
		// TODO
		// initialiser la google map
	},

	fetchData : function () {
		fetch(this.AVIATION_API_URL)
		.then(function(response) {
			return response.json()
		})
		.then((airports) => {
			this.airports = airports
			airports.data.forEach(airport => {
				this.appendElementToList(airport)
			});
		})
		// TODO
		// recuperer les donnees de l'API
	},

	appendElementToList : function ( airport ) {
		var el = document.createElement('li')
		el.innerHTML = airport.airport_name
		document.querySelector('#airports-list').appendChild(el)

		
		el.addEventListener("click", () => {
			this.map.zoom = 5
			this.map.setCenter({lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)});
		})
		this.appendMarkerToMap(airport)
		
	},

	appendMarkerToMap : function(airport){
		
		markerPos = {lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)}
		icon = {
			url: 'img/plane.svg',
			scaledSize: new google.maps.Size(15, 15),
			origin: new google.maps.Point(0,0),
    		anchor: new google.maps.Point(0,0)
		}

		const content = `
		<div class="content">
			<h3 class="h3">${airport.airport_name}</h3>
			<p>Pays: ${airport.country_name}</p>
			<p>Latitude: ${airport.latitude}</p>
			<p>Longitude: ${airport.longitude}</p>
		</div>`
		
		const marker = new google.maps.Marker({
			position: markerPos,
			map: this.map,
			icon,
			title: airport.name
		})

		marker.addListener("click", () => {
			if (this.infowindow)this.infowindow.close();

			this.infowindow = new google.maps.InfoWindow({content});
			this.infowindow.open({
				anchor: marker,
				map: this.map,
				shouldFocus: false,
			});
		})
	}
}
