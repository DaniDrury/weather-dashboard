const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
let cityInput = document.getElementById('cityInput');
let searchForm = document.querySelector('form');
// let resultsEl = document.querySelector('article');
let cardContainer = document.getElementById('cityOptCardContainer')

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
    let coordinatesQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;

    fetch(coordinatesQuery).then(function(response) {
        if (!response.ok) {
            throw new Error('Failed to load weather data.');
        }
        return response.json();
        })
        .then(whichCity(response.json()))
    .catch(function (error) {
        console.error(error);
    });
}

// function fetchAPI(queryURL) {
//     //fetch api data
//     fetch(queryURL).then(function(response) {
//         if (!response.ok) {
//             throw new Error('Failed to load weather data.');
//         }
//         return response.json();
//         })
//         .then(function (weatherData) {
//             console.log(weatherData);
//             console.log('test');
//             whichCity(weatherData);
//         })
//     .catch(function (error) {
//         console.error(error);
//     });
// }

function whichCity(response) {
    console.log('test');
    for (let i=0; i < response.length; i++) {
        let cityOpt = response.name;
        let stateOpt = response.state;
        let countryOpt = response.country;
        let lat = response.lat;
        let lon = response.lon;
        
        let cityOptCard = document.createElement('div');
        cityOptCard.className ='card';
        
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        resultsEl.appendChild(cityOptCard);
    }
}


searchForm.addEventListener('submit',handleSearchSubmit);


// var searchInputVal = document.querySelector('#search-input').value;
// searchApi(searchInputVal, formatInputVal);

