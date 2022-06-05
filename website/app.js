'use strict';

/* Global Variables */
let submitEl;
let zipInputEl;
let feelingsTextEl;

// Personal API Key for OpenWeatherMap API
const apiKey = 'e13f4c94602654795d3bc16e3238340f&units=imperial';

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

/* Function called by event listener */
async function handleGenerateClick() {
  const zip = zipInputEl.value.trim();
  const feelings = feelingsTextEl.value.trim() || 'Not provided';

  if (zip) {
    const temp = await getTemp(zip);
    await postWeatherData({ feelings, newDate, temp });
    const data = await getProjectData();
    updateUI(data);
  }
}

/* Function to GET Web API Data*/
async function getTemp(zip) {
  const url = 'https://api.openweathermap.org/data/2.5/weather';

  try {
    const result = await fetch(`${url}?zip=${zip},us&appid=${apiKey}`);
    const data = await result.json();

    if (data && data.main && data.main.temp) {
      return data.main.temp;
    }

    throw new Error('Expected data not provided');
  } catch (error) {
    console.error('Error fetching weather:', '\n', error);
  }
}

/* Function to POST data */
async function postWeatherData(data) {
  try {
    await fetch('/temp', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error posting data:', '\n', error);
  }
}

/* Function to GET Project Data */
async function getProjectData() {
  try {
    const result = await fetch('/all');
    const data = await result.json();

    if (data) {
      return data;
    }

    throw new Error('Expected data not provided');
  } catch (error) {
    console.error('Error fetching project:', '\n', error);
  }
}

function updateUI(data) {
  const { feelings, newDate, temp } = data;
  const output = {
    date: newDate,
    temp: `${Math.round(temp)} degrees`,
    content: feelings,
  };

  // Reset input values
  [zipInputEl, feelingsTextEl].forEach((el) => el.value = '');

  Object.entries(output).forEach(([id, value]) => {
    document.getElementById(id).innerHTML = value;
  });
}

function init() {
  submitEl = document.getElementById('generate');
  zipInputEl = document.getElementById('zip');
  feelingsTextEl = document.getElementById('feelings');

  // Event listener to add function to existing HTML DOM element
  submitEl.addEventListener('click', handleGenerateClick);
}

// Ensure execution regardless of script placement
document.addEventListener('DOMContentLoaded', init);
