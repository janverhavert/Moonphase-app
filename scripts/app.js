var lat = "";
var lon = "";

let showResult = queryResponse => {
	var flip = document.getElementById("flip");
	document.getElementsByClassName("c-moon-location")[0].innerText = moonPhase + " Phase (" + Math.round(moonIllumi) + "%)";
	document.getElementsByClassName("c-moon-days")[0].innerText = Math.round(age) + " days old";
	document.getElementsByClassName("c-moon-title")[0].innerText = name;

	if (moonIllumi == 100) {

		document.getElementsByClassName("c-moon-dark")[0].style.backgroundColor = "white";
		document.getElementsByClassName("c-moon-block1")[0].style.backgroundColor = "white";
		document.getElementsByClassName("c-moon-block2")[0].style.backgroundColor = "white";
		

	} else if (moonIllumi > 50) {

		document.getElementsByClassName("c-moon-dark")[0].style.backgroundColor = "white";
		document.getElementsByClassName("c-moon-block1")[0].style.backgroundColor = "black";
		document.getElementsByClassName("c-moon-block2")[0].style.backgroundColor = "white";
		document.getElementsByClassName("c-moon-dark")[0].style.width = Math.round((2 * moonIllumi) - 100) + "%";

	} else if (moonIllumi < 50) {

		document.getElementsByClassName("c-moon-dark")[0].style.width = Math.round(100 - (2 * moonIllumi)) + "%";

	} else if (moonIllumi == 0) {

		document.getElementsByClassName("c-moon-dark")[0].style.backgroundColor = "black";
		document.getElementsByClassName("c-moon-block1")[0].style.backgroundColor = "black";
		document.getElementsByClassName("c-moon-block2")[0].style.backgroundColor = "white";
		
	}

	if(Math.round(age) < 15){
		flip.classList.remove("flip");
	} else if (Math.round(age) > 15){
		flip.classList.add("flip");
	}
	
	
	document.getElementsByClassName("c-time-sunrise")[0].innerText = sunrisehour + ':' + sunrisemin;
	document.getElementsByClassName("c-time-sunset")[0].innerText = sunsethour + ':' + sunsetmin;
};
let getAPI = async function (lat, lon) {
	// we bouwen de url op van de moonphases
	var date = Math.floor(Date.now() / 1000);
	const SERVER_ENDPOINTPHASE = 'https://api.farmsense.net/v1/moonphases/?d=' + date;


	let customHeaders = new Headers();
	customHeaders.append('Accept', 'application/json');
	// Met de fetch API proberen we de data op te halen.
	const responsePhase = await fetch(SERVER_ENDPOINTPHASE, {
		headers: customHeaders
	});
	const dataPhase = await responsePhase.json();
	// Elke data in een variable steken
	moonPhase = dataPhase["0"]["Phase"];
	moonIllumi = dataPhase["0"]["Illumination"] * 100;
	age = dataPhase["0"]["Age"];
	name = dataPhase["0"]["Moon"]["0"];
	// we bouwen de url op van de dagtijden
	const SERVER_ENDPOINTDAYLIGHT = 'https://api.farmsense.net/v1/daylengths/?d=' + date + '&lat=' + lat + '&lon=' + lon;
	const responseDaylight = await fetch(SERVER_ENDPOINTDAYLIGHT, {
		headers: customHeaders
	});
	const dataDaylight = await responseDaylight.json();
	// Elke data in een variable steken
	sunriseraw = dataDaylight["0"]["Sunrise"];

	var sunrisearr = sunriseraw.split(':');
	var d = new Date();
	var sunyear = d.getFullYear();
	var sunmonth = d.getMonth() + 1;
	var sunday = d.getDate()
	sunrisehour = eval(sunrisearr[0]) + 6;
	sunrisemin = sunrisearr[1];
	var sunrisesec = sunrisearr[2];
	var d = new Date(sunyear, sunmonth, 24, 10, 33, 30, 0);

	sunsetraw = dataDaylight["0"]["Sunset"];
	var sunsetarr = sunsetraw.split(':');
	sunsethour = eval(sunsetarr[0]) + 6;
	sunsetmin = sunsetarr[1];
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showResult();
};
 
window.setInterval(function () {
	getAPI(lat, lon);
}, 5000);

let getLocation = () => {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function (position) {
			document.body.classList.remove("onload");
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			getAPI(lat, lon);
		});
	} else {
		document.body.innerHTML = "Geolocation is not supported by this browser.";
		getAPI(50.8027841, 3.2097454);
	}
};

function Lightmode() {
	var element = document.getElementById("Night-mode");

	if (element.classList = "night-mode") {
		element.classList.add("day-mode");
		element.classList.remove("night-mode");
		element.innerHTML = "<img class='night-mode_symbol' src='img/favicon.png' alt='day-mode'>";
		document.body.style.backgroundImage = "url('img/Brightsky-background.jpg')";
		document.body.style.color = "var(--global-color-neutral-xxxx-dark)";
		document.getElementsByClassName("c-line")[0].style.borderTop = "1px solid var(--global-color-neutral-xxxx-dark)";
		element.setAttribute('onclick', 'Nightmode()')
	}
}

function Nightmode() {
	var element = document.getElementById("Night-mode");
	if (element.classList = "day-mode") {
		element.classList.add("night-mode");
		element.classList.remove("day-mode");
		element.innerHTML = "<img class='night-mode_symbol' src='img/sunny.png' alt='day-mode'>";
		document.body.style.backgroundImage = "url('img/Nightsky-background.svg')";
		document.body.style.color = "var(--global-page-color)";
		document.getElementsByClassName("c-line")[0].style.borderTop = "1px solid var(--global-page-color)";
		element.setAttribute('onclick', 'Lightmode()')
	}

}