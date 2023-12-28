const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
const searchForm = document.querySelector('form');
const cardContainer = document.getElementById('cardContainer');
const historyArr = JSON.parse(localStorage.getItem('savedSearches'));
const modalEl = document.getElementById('errorModal');
const myModal = new bootstrap.Modal(modalEl);


function renderSearchHistory() {
    const searchHistoryContainer = document.getElementById('searchHistory');
    searchHistoryContainer.innerHTML = '';

    for (i = historyArr.length - 1; i >= 0; i--) {
        const {
            city,
            state,
            country,
            lon,
            lat
        } = historyArr[i];

        const historyBtn = `
            <button type="button" class = "btn btn-info btn-md my-1 historyBtns w-100" id = "historyBtn${i}" data-lon = '${lon}' data-lat = '${lat}'
            data-name = '${city}' data-state = '${state}' data-country = '${country}'>
                ${city}, ${state}, ${country}
            </button>
        `
        searchHistoryContainer.insertAdjacentHTML('beforeend', historyBtn);

        //add eventlistener to the History Buttons
        document.getElementById(`historyBtn${i}`).addEventListener('click', fetchCityDetails);
    }
}

function saveSearch(city) {
    // create local storage object and save to local storage
    const historyObj = {
        city: city.name,
        state: city.state,
        country: city.country,
        lon: city.lon,
        lat: city.lat,
    }

    historyArr.push(historyObj);
    if (historyArr.length > 10) {
        historyArr.shift();
    }

    localStorage.setItem("savedSearches", JSON.stringify(historyArr));
    renderSearchHistory();
}

function displayWeatherDetails(cityDetails, current, forecast) {
    // reset cardContainer
    cardContainer.innerHTML = '';

    // get current date using day.js
    const today = dayjs();

    // construct current weather card
    const currentWeatherHTML = `
        <div class = "card w-75 px-2 mb-2">
            <div class = "card-header">
                <h3>${cityDetails.name}, ${cityDetails.state}, ${cityDetails.country} (${today.format("MM/DD/YYYY")})</h3>
            </div>
            <div class = "card-body">
                <p>Temp: ${current.main.temp}°</p>
                <p>Wind: ${current.wind.speed} mph</p>
                <p>Humidity: ${current.main.humidity}%</p>
            </div>
        </div>
        <h4>5-Day Forecast:</h4>`
    // insert current weather card HTML
    cardContainer.insertAdjacentHTML('afterbegin', currentWeatherHTML);

    // destructure forecast weather data, create and insert cards
    for (let i = 0; i < forecast.list.length; i++) {
        // destructure
        const forecastWeather = {
            city: forecast.city.name,
            temp: forecast.list[i].main.temp,
            humidity: forecast.list[i].main.humidity,
            wind: forecast.list[i].wind.speed,
            date: forecast.list[i].dt_txt,
            // time: forecast.list[i].dt
        }

        const slicedDate = forecastWeather.date.slice(0, 10);
        const forecastDate = dayjs(slicedDate);

        const slicedTime = forecastWeather.date.slice(11);

        if (slicedTime == '12:00:00') {
            const forecastHTML = `
                <div class = "card forecastCards mx-1">
                    <div class = "card-header">
                        <h4>${forecastDate.format("MM/DD/YYYY")}</h4>
                    </div>
                    <div class = "card-body">
                        <p>Temp: ${forecastWeather.temp}°</p>
                        <p>Wind: ${forecastWeather.wind} mph</p>
                        <p>Humidity: ${forecastWeather.humidity}%</p>
                    </div>
                </div>`

            cardContainer.insertAdjacentHTML('beforeend', forecastHTML);
        }
    }
}

async function fetchCityDetails(ev) {
    // get specific lat & lon for chosen city
    const cityDetails = {
        lat: this.dataset.lat,
        lon: this.dataset.lon,
        name: this.dataset.name,
        state: this.dataset.state,
        country: this.dataset.country,
    }

    // api call for current weather data
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&appid=${apiKey}&units=imperial`;
    const currentResponse = await fetch(currentWeatherURL);
    const currentDetails = await currentResponse.json();

    // api call for 5-day forecast data
    const fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityDetails.lat + '&lon=' + cityDetails.lon + '&appid=' + apiKey + '&units=imperial';
    const fiveDayResponse = await fetch(fiveDayURL);
    const forecastDetails = await fiveDayResponse.json();

    saveSearch(cityDetails);
    displayWeatherDetails(cityDetails, currentDetails, forecastDetails);
}

function whichCity(response) {
    // reset container from previous searches
    cardContainer.innerHTML = '';

    cardContainer.insertAdjacentHTML('afterbegin', '<h3>Select City:</h3>');

    for (let i = 0; i < response.length; i++) {
        // destructure response object
        const {
            name,
            state,
            country,
            lon,
            lat
        } = response[i];

        const cityBtn = `
            <button type="button" class = "btn btn-info btn-lg m-1 cityBtns" id = "cityBtn${i}" data-lon = '${lon}' data-lat = '${lat}'
            data-name = '${name}' data-state = '${state}' data-country = '${country}'>
                ${name}, ${state}, ${country}
            </button>
        `

        // cardContainer.removeAttribute('hidden');
        cardContainer.insertAdjacentHTML('beforeend', cityBtn);

        //add eventlistener to the cityCard
        document.getElementById(`cityBtn${i}`).addEventListener('click', fetchCityDetails);
    }
}

async function getCityResponse(city) {
    const coordinatesQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;

    try {
        const response = await fetch(coordinatesQuery);
        const resultsData = await response.json();
        console.log(resultsData);
        if (resultsData.length > 1) {
            whichCity(resultsData);
        } else if (resultsData.length === 0) {
            myModal.show();
        } else {
            // destructure specific city object
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

            saveSearch(resultsData[0]);

            // call function to Display weather details
            displayWeatherDetails(resultsData[0], currentDetails, forecastDetails);
        }
    } catch (error) {
        myModal.show();
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

renderSearchHistory();
searchForm.addEventListener('submit', handleSearchSubmit);

