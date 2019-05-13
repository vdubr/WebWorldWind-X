import WorldWind from 'webworldwind-esa';
import {fromUrl} from 'geotiff/src/main';
import proj4 from 'proj4';

import CogTiledLayer from '../src/layers/COGTiledLayer';

import LayerManager from './LayerManager';
import SentinelCloudlessLayer from "../src/layer/SentinelCloudlessLayer";

WorldWind.configuration.baseUrl = window.location.pathname.replace('ControlsExample.html', '');
const wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new SentinelCloudlessLayer());

fromUrl('https://s3-us-west-2.amazonaws.com/planet-disaster-data/hurricane-harvey/SkySat_Freeport_s03_20170831T162740Z3.tif').then(tiff => {
    let amountOfLevels, boundingBox, width, height, resX, resY, tileHeight, tileWidth;

    tiff.getImageCount().then(count => {
        amountOfLevels = count;

        return tiff.getImage(0);
    }).then(image => {
        boundingBox = image.getBoundingBox();

        width = image.getWidth();
        height = image.getHeight();

        resX = Math.abs((boundingBox[0] - boundingBox[2]) / width);
        resY = Math.abs((boundingBox[1] - boundingBox[3]) / height);

        tileWidth = image.getTileWidth();
        tileHeight = image.getTileHeight();

        const targetProjection = image.getGeoKeys()['ProjectedCSTypeGeoKey'];

        console.log(targetProjection);

        return fetch(`https://epsg.io/${targetProjection}.wkt?download`)
    }).then(result => {
        return result.text();
    }).then(sourceProjection => {
        console.log(sourceProjection);
        console.log(boundingBox);

        console.log(proj4(sourceProjection, 'WGS84', [boundingBox[0], boundingBox[1]]));

        const min = proj4(sourceProjection, 'WGS84', [boundingBox[0], boundingBox[1]]);
        const max = proj4(sourceProjection, 'WGS84', [boundingBox[2], boundingBox[3]]);

        boundingBox[0] = min[0];
        boundingBox[1] = min[1];
        boundingBox[2] = max[0];
        boundingBox[3] = max[1];

        console.log(boundingBox);

        const sector = new WorldWind.Sector(boundingBox[1], boundingBox[3], boundingBox[0], boundingBox[2]);
        console.log(sector);
        wwd.addLayer(new CogTiledLayer(tiff,
            new WorldWind.Location(Math.abs(boundingBox[3] - boundingBox[1]), Math.abs(boundingBox[2] - boundingBox[0])),
            sector, amountOfLevels, resX, resY, tileHeight,
            tileWidth, sourceProjection));

        wwd.navigator.lookAtLocation = new WorldWind.Location(boundingBox[1],boundingBox[0]);
        wwd.navigator.range = 100000;

        const show = new WorldWind.RenderableLayer('Around');
        wwd.addLayer(show);

        const onlyAround = new WorldWind.ShapeAttributes();
        onlyAround.drawInterior = false;

        show.addRenderable(new WorldWind.SurfacePolygon([
            new WorldWind.Location(sector.minLatitude, sector.minLongitude),
            new WorldWind.Location(sector.maxLatitude, sector.minLongitude),
            new WorldWind.Location(sector.maxLatitude, sector.maxLongitude),
            new WorldWind.Location(sector.minLatitude, sector.maxLongitude),
        ], onlyAround));

        wwd.redraw();
    });
});

new LayerManager(wwd);