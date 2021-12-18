const fs    = require('fs');
const axios = require('axios');

class Search {
  record = [];
  dbPath = './db/database.json';

  constructor() {
    this.readDB();
  }

  getParamsMap() {
    return {
      'limit':5,
      'language':'es',
      'access_token': process.env.MAPBOX_KEY
    }
  }

  get getCapCities() {
    return this.record.map( place => {
      let words = place.split(' ');
      words = words.map( w => w[0].toUpperCase() + w.substring(1));
      
      return words.join(' ');
    })
  }

  async city(place = '') {

    try {
      // peticion http
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.getParamsMap()
      });
      
      const response = await intance.get();
      return response.data.features.map( place => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1]  
      }));
    } catch (error) {
      console.log( error );
    }
  }

  async weatherByPlace( lat, lon ) {
    try {
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=es`,
      });
      const respWeather = await intance.get();
      const { weather, main} = respWeather.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      }

    } catch (error) {
      console.log( error );
    }
  }

  addSearchRecord( place = '' ){
    if ( this.record.includes( place.toLocaleLowerCase() )) {
      return;
    }

    this.record = this.record.splice(0,5);
    this.record.unshift( place.toLocaleLowerCase() );
    this.saveDB();
  }

  saveDB() {
    const payload = {
      record: this.record
    }
    fs.writeFileSync( this.dbPath, JSON.stringify( payload ))
  }

  readDB() {
    if( !fs.existsSync( this.dbPath ) ) {return};

    const information = fs.readFileSync( this.dbPath, {encoding:'utf-8'});
    const data = JSON.parse( information );
    this.record = data.record;

  }
}



module.exports = Search