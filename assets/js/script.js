const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
const searchForm = document.querySelector('form');

//api call
// const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

function displayWeatherDetails(current, forecast) {
    // deconstruct current weather data
    const currentWeather = {
        temp: current.main.temp,
        humidity: current.main.humidity,
        wind: current.wind.speed
    };

    // deconstruct forecast weather data
    for (let i = 0; i < forecast.list.length; i++) {
        const forecastWeather = {
            temp: forecast.list[i].main.temp,
            humidity: forecast.list[i].main.humidity,
            wind: forecast.list[i].wind.speed
        }
    }
}

async function fetchCityDetails(ev) {
    document.getElementById('cityOptCardContainer').setAttribute('hidden', '');

    // get specific lat & lon for chosen city
    const lat = this.dataset.lat;
    const lon = this.dataset.lon;


    // api call for current weather data
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const currentResponse = await fetch(currentWeatherURL);
    const currentDetails = await currentResponse.json();

    // api call for 5-day forecast data
    const fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    const fiveDayResponse = await fetch(fiveDayURL);
    const forecastDetails = await fiveDayResponse.json();

    console.log(currentDetails, forecastDetails);

    displayWeatherDetails(currentDetails, forecastDetails);
}

function whichCity(response) {
    // reset container from previous searches
    document.querySelector('h3').textContent = '';
    const cityCardContainer = document.getElementById('cityOptCardContainer');
    cityCardContainer.innerHTML = '';

    cityCardContainer.insertAdjacentHTML('afterbegin', '<h3>Select City:</h3>');

    for (let i = 0; i < response.length; i++) {
        // deconstruct response object
        const {
            name,
            state,
            country,
            lon,
            lat
        } = response[i];

        const cityBtn = `
            <button type="button" class = "btn btn-info btn-lg" id = "cityBtn${i}" data-lon = '${lon}' data-lat = '${lat}'>
                ${name}, ${state}, ${country}
            </button>
        `

        cityCardContainer.removeAttribute('hidden');
        cityCardContainer.insertAdjacentHTML('beforeend', cityBtn);

        //add eventlistener to the cityCard
        document.getElementById(`cityBtn${i}`).addEventListener('click', fetchCityDetails);
    }
}

async function getCityResponse(city) {
    const coordinatesQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;

    try {
        const response = await fetch(coordinatesQuery);
        const resultsData = await response.json();
        if (resultsData.length > 1) {
            whichCity(resultsData);
        } else {
            // deconstruct specific city object
            const {
                lon,
                lat
            } = resultsData[0];

            // api call for current weather data
            const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            const currentResponse = await fetch(currentWeatherURL);
            const currentDetails = await currentResponse.json();

            // api call for 5-day forecast data
            const fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
            const fiveDayResponse = await fetch(fiveDayURL);
            const forecastDetails = await fiveDayResponse.json();

            console.log(currentDetails, forecastDetails);

            displayWeatherDetails(currentDetails, forecastDetails);
        }
    } catch (error) {
        console.error(error);
    }
}

//Search Form Submit Handler Function
function handleSearchSubmit(event) {
    event.preventDefault();

    const cityInput = document.getElementById('cityInput');

    city = cityInput.value;
    if (!city) {
        cityInput.setAttribute('placeholder', 'Please enter a valid city');
        return;
    }

    getCityResponse(city);
}

searchForm.addEventListener('submit', handleSearchSubmit);

