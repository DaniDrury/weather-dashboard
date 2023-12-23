const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
const searchForm = document.querySelector('form');

//api call
// const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

function displayCityDetails(ev) {
    document.getElementById('cityOptCardContainer').setAttribute('hidden','');
}

function whichCity(response) {
    // reset container from previous searches
    document.querySelector('h3').textContent = '';
    const cityCardContainer = document.getElementById('cityOptCardContainer');
    cityCardContainer.innerHTML = '';

    cityCardContainer.insertAdjacentHTML('afterbegin','<h3>Select City:</h3>');
    
    for (let i = 0; i < response.length; i++) {
        // deconstruct response object
        const {
            name,
            state,
            country,
            lat,
            lon
        } = response[i];

        const cityCard = `
            <div class = 'card w-25 mb-1 me-1'>
                <div class = 'card-body'>
                    <p>${name}, ${state}, ${country}</p>
                </div>
            </div>
        `
        cityCardContainer.removeAttribute('hidden');
        cityCardContainer.insertAdjacentHTML('beforeend', cityCard);
        // cityCard.addEventListener('click', displayCityDetails);
    }
}

async function getLatLon(city) {
    const coordinatesQuery = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey;

    try {
        const response = await fetch(coordinatesQuery);
        const resultsData = await response.json();
        if (resultsData.length > 1) {
            whichCity(resultsData);
        } else {
            displayCityDetails(resultsData);
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

    getLatLon(city);
}

searchForm.addEventListener('submit', handleSearchSubmit);

