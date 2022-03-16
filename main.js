const { app } = require('electron');

const { Renderer } = require('./classes/renderer');

let renderer = Renderer;

// Espera al evento ready para lanzar el "renderizador"...
app.on('ready', () => {
    renderer = new Renderer();
});