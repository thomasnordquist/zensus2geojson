const proj4 = require('proj4');
var csv = require('csv-parser')
const fs = require('fs')

var jsonfile = require('jsonfile')
 

const zensusDef = '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
const gpsDef = '+proj=longlat +ellps=GRS80 +no_defs'

const projection = proj4(zensusDef, gpsDef)

function toGeojson(x, y) {
  const coordinates = projection.forward([x, y])
  return {type: 'Point', coordinates}
}


var file = 'data.json'
var fd = fs.openSync(file, 'w')
fs.writeSync(fd, '[\n')
 
fs.createReadStream('Zensus_Bevoelkerung_100m-Gitter.csv')
  .pipe(csv({separator: ';'}))
  .on('data', function (data) {
    const x = parseInt(data.x_mp_100m)
    const y = parseInt(data.y_mp_100m)
    const count = parseInt(data.Einwohner)
    if (count > 0) {
      const objStr = JSON.stringify({
        count,
	location: toGeojson(x, y)
      });
      fs.writeSync(fd, objStr + ',\n')
    }
  })
  .on('end', function () {
    fs.writeSync(fd, 'undefined]')
    fs.closeSync(fd)
  })

