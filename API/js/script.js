var formLogin = document.querySelector('.form-login')
var MAP_API = {
	AVIATION_API_URL: "../../API_2/api/airports",
	CONNECTION_API_URL: "../../API_2/api/user",

	infowindow: null,
	map : null,
	icon: null,
	airports: null,
	markers: [],
	userStatut: null,
	userToken: null,

	/**
	 * Init map and set property for icon
	 * @return { void }
	 */
	initMap : function () {
		this.buildMap();
		this.fetchData();
		this.initFormLogin();
		this.initSearchAirport();
		this.icon = {
			url: 'img/plane.svg',
			scaledSize: new google.maps.Size(15, 15),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(0,0)
		}
	},

	initSearchAirport: function(){
		const searchAirportValue = document.querySelector('.search-airport')
		const airportList = document.querySelector('#airports-list')
		
		searchAirportValue.addEventListener("input", () => {
			const searchValue = searchAirportValue.value
			airportList.innerHTML = "";
			this.airports.data.filter((airport) => {
				if(airport.name.toLocaleLowerCase().includes(searchValue.toLowerCase())) this.appendElementToList(airport)
			})
		})

		searchAirportValue.addEventListener("search", () => {
			const searchValue = searchAirportValue.value
			airportList.innerHTML = "";
			this.airports.data.filter((airport) => {
				if(airport.name.toLocaleLowerCase().includes(searchValue.toLowerCase())) this.appendElementToList(airport)
			})
		})
	},

	

	initFormLogin: function(){
		const form = document.querySelector('.form-login')

		form.addEventListener("submit", (e) => {
			e.preventDefault()
			const login = form.elements["login"].value;
			const password = form.elements["password"].value;
			this.connection({login, password})
		})
	},

	/**
	 * Generate the map and initialize the double click to add airport
	 * @return { void }
	 */
	buildMap : function () {
		var paris = { 
            lat: 48.8534, 
            lng: 2.3488 
        };

		this.map = new google.maps.Map(document.getElementById("map"), {
			center: paris,
			zoom: 5,
		});
		this.map.setOptions({disableDoubleClickZoom: true });
	},

	/**
	 * Fetch the data using API
	 * @return { void }
	 */
	fetchData : function () {
		fetch(this.AVIATION_API_URL, {
			method: 'GET',
			headers: new Headers({
				'Authorization': this.userToken
			}),
		})
		.then(function(response) {
			return response.json()
		})
		.then((airports) => {
			this.reset()
			this.airports = airports
			airports.data.forEach(airport => {
				this.appendElementToList(airport)
			});
		})
		.catch(function(error) {
			console.log('Error in fetch: ' + error.message);
		});
	},

	/**
	 * Connect user with the API
	 * @param { object } user 
	 * @return { void }
	 */
	connection(user){
		fetch(this.CONNECTION_API_URL, {
			method: "POST",
			body: JSON.stringify(user)
		})
		.then(function(res){
			return res.json()
		})
		.then((data) => {
			if(data && data.info && data.info.code == 200){
				if(data.info.success){
					formLogin.innerHTML = `<h4 class="h4">Hi ${user.login} !</h4>`
					this.userStatut = data.info.statut;
					this.userToken = data.info.token;
					this.fetchData()
					return;
				}
				formLogin.querySelector('.alert').innerHTML = data.info.message
				formLogin.querySelector('.alert').classList.remove('d-none')
			}else{
				alert(data.info.message)
			}
		})
		.catch(function(error) {
			console.log('Error in fetch: ' + error.message);
		});
	},

	/**
	 * Add airport to the database using API
	 * @param { object } airport 
	 * @return { void }
	 */
	addAirport(airport){
		fetch(this.AVIATION_API_URL, {
			method: "POST",
			mode: 'cors',
            headers: new Headers({
				'Authorization': this.userToken
			}),
			body: JSON.stringify(airport)
		})
		.then(function(res){
			return res.json()
		})
		.then((data) => {
			if(data && data.info && data.info.code == 200){
				this.fetchData();
			}else{
				alert(data.info.message)
			}
		})
		.catch(function(error) {
			console.log('Error in fetch: ' + error.message);
		});
	},

	/**
	 * Edit airport to the database using API
	 * @param { object } airport 
	 * @return { void }
	 */
	editAirport(airport){
		fetch(this.AVIATION_API_URL, {
			method: "PUT",
			mode: 'cors',
            headers: new Headers({
				'Authorization': this.userToken
			}),
			body: JSON.stringify(airport)
		})
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			if(data && data.info && data.info.code == 200){
				this.fetchData();
			}else{
				alert(data.info.message)
			}
		})
		.catch(function(error) {
			console.log('Error in fetch: ' + error.message);
		});
	},

	/**
	 * Delete airport to the database using API
	 * @param { object } airport 
	 * @return { void }
	 */
	deleteAirport(airport){
		fetch(this.AVIATION_API_URL +"?"+ new URLSearchParams({
			'id': airport.id
		}), {
			method: "DELETE",
			mode: 'cors',
            headers: new Headers({
				'Authorization': this.userToken
			}),
		})
		.then((res) => {
			return res.json()
		})
		.then((data) => {
			if(data && data.info && data.info.code == 200){
				this.fetchData();
			}else{
				alert(data.info.message)
			}
		})
		.catch(function(error) {
			console.log('Error in fetch: ' + error.message);
		});
	},

	/**
	 * Reset markers and the list of airport
	 * @param { object } airport 
	 * @return { void }
	 */
	reset: function(){
		this.markers.forEach(marker => {
			marker.setMap(null)
		});
		document.querySelector('#airports-list').innerHTML = "";
		this.markers = []
		if(["editeur", "administrateur"].includes(this.userStatut)){
			this.map.addListener('dblclick', (e) => {
				const coord = e.latLng.toJSON()
	
				form = this.loadModalForm({coord, button: "Ajouter"})
	
				form.addEventListener('submit', (e) => {
					e.preventDefault()
					this.modalFormAction("add")
				})
			})
		}
	},

	/**
	 * Add airport in the list of airports
	 * @param { object } airport
	 * @return { void }
	 */
	appendElementToList : function ( airport ) {
		var el = document.createElement('li')
		el.innerHTML = `
		<div class="d-flex justify-content-between align-items-center">
			<span>${airport.name}</span>
			<div class="d-flex">
				<span class="edit"></span>
				<span class="delete"></span>
			</div>
		</div>
		`

		if(["editeur", "administrateur"].includes(this.userStatut)){
			var buttonEdit = document.createElement('button')
			buttonEdit.classList.add('btn', 'btn-default', 'p-1')
			buttonEdit.innerHTML = '<img class="icon icon-edit" src="img/edit.svg" alt="edit icon" />';
			el.querySelector('.edit').appendChild(buttonEdit)
			buttonEdit.addEventListener('click', (e) => {
				coord = {lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)};
	
				form = this.loadModalForm({coord, airport, button: 'Modifier'})
	
				form.addEventListener('submit', (e) => {
					e.preventDefault()
					this.modalFormAction("edit", {airport})
				})
			})
		}

		if(["administrateur"].includes(this.userStatut)){
			var buttonDelete = document.createElement('button')
			buttonDelete.classList.add('btn', 'btn-default', 'p-1')
			buttonDelete.innerHTML = '<img class="icon icon-trash" src="img/trash.svg" alt="trash icon" />';
			el.querySelector('.delete').appendChild(buttonDelete)
			buttonDelete.addEventListener('click', (e) => {
				if(window.confirm(`Êtes-vous sur de vouloir supprimer ${airport.name}`)){
					this.deleteAirport(airport);
				}
			})
		}
		
		document.querySelector('#airports-list').appendChild(el)		

		el.addEventListener("click", () => {
			this.map.zoom = 5
			this.map.setCenter({lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)});
		})
		this.appendMarkerToMap(airport)
	},

	/**
	 * Load the model form above airplane icon of the airport
	 * @param { object } options 
	 * @return { object }
	 */
	loadModalForm: function(options){
		const coord = options.coord ? options.coord : '';
		const airport = options.airport ? options.airport : '';
		const content = `
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="name" type="text" class="form-control" placeholder="Nom de l'aéroport" value="${airport.name ? airport.name : ''}"/>
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="latitude" type="text" readonly class="form-control" value="${coord.lat}" placeholder="Latitude"/>
				</div>
			</div>
			<div class="form-group row">
				<div class="col-sm-10">
				<input name="longitude" type="text" readonly class="form-control" value="${coord.lng}" placeholder="Longitude"/>
				</div>
			</div>
			<button type="submit" class="btn btn-success">${options.button}</button>
			`
			var form = document.createElement('form')
			form.innerHTML = content

			if (this.infowindow)this.infowindow.close();

			this.infowindow = new google.maps.InfoWindow({
				content: form,
				position: coord,
			});
			this.infowindow.open({
				map: this.map
			});
			return form;
	},

	/**
	 * Retrieve the values ​​from the form then perform the action according to the type
	 * @param { string } type
	 * @param { object } options
	 * @return { void }
	 */
	modalFormAction: function(type, options=null){
		const id = options ? options.airport.id : '';
		const name = form.elements["name"].value;
		const latitude = form.elements["latitude"].value;
		const longitude = form.elements["longitude"].value;
		this.infowindow.close()

		switch (type) {
			case "add":
				this.addAirport({name, latitude, longitude})
				break;
			case "edit":
				this.editAirport({id, name, latitude, longitude})
				break;
			default:
				alert(`Le type ${type} est inconnu`)
				break;
		}

	},

	/**
	 * Add marker to the Google Maps
	 * @param { object } airport 
	 */
	appendMarkerToMap : function(airport){
		markerPos = {lat: parseFloat(airport.latitude), lng: parseFloat(airport.longitude)}
		const content = `
		<div class="content">
			<h3 class="h3">${airport.name}</h3>
			<p>Latitude: ${airport.latitude}</p>
			<p>Longitude: ${airport.longitude}</p>
		</div>`
		
		const marker = new google.maps.Marker({
			position: markerPos,
			map: this.map,
			icon: this.icon,
			title: airport.name
		})

		this.markers.push(marker)

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
