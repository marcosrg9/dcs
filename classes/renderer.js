const { BrowserWindow, globalShortcut } = require('electron');
const { capture } = require('../helpers/capture');
const { write } = require('../helpers/saver');

class Renderer {

    constructor() {

        // Registra el atajo Alt/Option + Shift + X para lanzar el callback.
        globalShortcut.register('Alt+Shift+X', () => {
            console.log('Pulsación');

            // Realiza una captura.
            // TODO: Revisar el lag de la captura de pantalla.
            capture()
            .then(buffer => {

                console.log('Buffer preparado');
                // Envía el buffer a ser escrito en el disco.
                write(buffer).then((a) => {
                    console.log('Captura guardada en ' + a);
                }).catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                // La captura de pantalla no se ha podido realizar.
                console.log(err);
            })
        })

    }
}

module.exports = { Renderer }