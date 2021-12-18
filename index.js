require('dotenv').config();
const { readInput, inquirerMenu, stopApp, listPlaces } = require("./helpers/inquirer");
const Search = require("./models/search");

const main = async() => {
    
    let opt = '';
    const searching = new Search();

    do {
        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                // Mostrar el mensaje
                const termToSearch = await readInput('Cuidad: ');
                
                // Buscar los lugares
                const cities = await searching.city( termToSearch );
                const id     = await listPlaces( cities );
                if ( id === '0' ) {
                    continue;
                }
                
                const placeSelected = cities.find( p => p.id === id);
                
                searching.addSearchRecord(placeSelected.name);

                // Clima
                const weatherResponse = await searching.weatherByPlace( placeSelected.lat,placeSelected.lng );

                // Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', placeSelected.name.green );
                console.log('Latitud:', placeSelected.lat );
                console.log('Longitud:', placeSelected.lng);
                console.log('Temperatura:', weatherResponse.temp );
                console.log('Minima:', weatherResponse.min);
                console.log('Maxima:', weatherResponse.max);
                console.log('Como esta el clima:', weatherResponse.desc);

                break;
                case 2:
                    searching.getCapCities.forEach( (places, i) => {
                        const idx = `${i + 1}.`.green;
                        console.log(`${idx} ${places}`);
                    });

            default:
                break;
            }
            await stopApp();            

    } while (opt != 0);
}

main();