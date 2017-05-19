const proj4 = require('proj4');
var csv = require('csv-parser')
const fs = require('fs')

var jsonfile = require('jsonfile')
 

const zensusDef = '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
const gpsDef = '+proj=longlat +ellps=GRS80 +no_defs'

const projection = proj4(zensusDef, gpsDef)

function toGeojson(x, y) {
  const coordinates = projection.forward([x, y]).reverse()
  return {type: 'Point', coordinates}
}


const coordinates = []
 
fs.createReadStream('input.csv')
  .pipe(csv({separator: ';'}))
  .on('data', function (data) {
    const x = parseInt(data.x_mp_100m)
    const y = parseInt(data.y_mp_100m)
    const count = parseInt(data.Einwohner)
    if (count > 0) {
      coordinates.push({
        count,
	location: toGeojson(x, y)
      });
    }
  })
  .on('end', function () {
    var file = 'data.json'
    jsonfile.writeFile(file, coordinates, function (err) {
      console.error(err)
    })
  })

