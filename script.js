'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const log = console.log;

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    // MEMO: addEventListener 는 this를 form element로 한다 -> bind(this (= App))
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField)
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
      alert('Could not get your position');
    }) 
  }

  _loadMap({coords: {latitude, longitude}}) {      
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
  
    // handling clicks on map
    // MEMO: this가 App이 아니기 때문에(여기서는 이벤트 리스너를 붙인 map이된다, Cannot write private member #mapEvent to an object whose class did not declare it가 발생함
    this.#map.on('click', this._showForm.bind(this))
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden')
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    // Clear Input Fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
  
    const {latlng: {lat: latitude, lng: longitude}} = this.#mapEvent;
    const coords = [latitude, longitude];
    L.marker(coords).addTo(this.#map)
    .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
    }))
    .setPopupContent('work out!')
    .openPopup();
  }
}

const app = new App();


