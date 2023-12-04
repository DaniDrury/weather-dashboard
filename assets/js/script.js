const apiKey = '75d1b0e8f45a5b8907dd772ac1d040f2';
let city;
let state;
let country;
let lat;
let lon;

//api call possibly...
let queryURL = 'api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

//fetch api data
fetch(queryURL);