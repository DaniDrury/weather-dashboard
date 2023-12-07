const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
let cityInput = document.getElementById('cityInput');
let searchForm = document.querySelector('form');
let city;
// let state;
// let country;
let lat = 38.49726;
let lon = -123.00357;

//api call
let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

//Search Form Submit Handler Function
function handleSearchSubmit(event) {
    event.preventDefault();

    city = cityInput.value;
    if (!city) {
        cityInput.setAttribute('placeholder', 'Please enter a valid city');
        return;
    }

    getLatLon(city);
}

function getLatLon(city) {
    let coordinatesQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=3&appid=' + apiKey;

    fetch(coordinatesQuery).then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to load weather data.');
        }
        return response.json();
        })
        .then(function (geoData) {
            console.log(geoData);
        })
    .catch(function (error) {
        console.error(error);
    });
}

function fetchAPI(queryURL) {
    //fetch api data
    fetch(queryURL).then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to load weather data.');
        }
        return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);
        })
    .catch(function (error) {
        console.error(error);
    });
}

searchForm.addEventListener('submit',handleSearchSubmit);


// var searchInputVal = document.querySelector('#search-input').value;
// searchApi(searchInputVal, formatInputVal);

