const { exit, cwd } = require('process');
const { homedir } = require('os');

const { Tray, Menu, nativeImage, shell, globalShortcut } = require('electron');
const { capture } = require('../helpers/capture');
const { write } = require('../helpers/saver');

class Renderer {

    tray = Tray;

    constructor() {

        this.tray = new Tray(nativeImage.createFromPath(`${cwd()}/icon.png`));

        const contextMenu = Menu.buildFromTemplate([
            { label: 'Shortcut:         Alt+Shift+X' },
            { type: 'separator' },
            { label: 'Abrir directorio de capturas', click: this.openDir },
            { label: 'Cerrar', click: this.close },
        ]);

        this.tray.setContextMenu(contextMenu);

        this.tray.on('click', () => { this.capture() });

        // Registra el atajo Alt/Option + Shift + X para realizar la captura.
        globalShortcut.register('Alt+Shift+X', () => {
            console.log('Pulsación');

            // Realiza una captura.
            // TODO: Revisar el lag de la captura de pantalla.
            this.capture()
        })

        // Registra el atajo Cmd/Ctrl + Shift + Alt/Option + X para abrir el directorio de capturas.
        globalShortcut.register('CommandOrControl+Shift+Alt+X', () => {
            this.openDir()
        })

    }

    openDir() {
        shell.openPath(`${homedir()}/dss`)
    }

    close() {
        exit(0);
    }

    capture() {
        return new Promise((resolve, reject) => {
            capture()
            .then(buffer => {
    
                console.log('Buffer preparado');
                // Envía el buffer a ser escrito en el disco.
                write(buffer).then((a) => {
                    console.log('Captura guardada en ' + a);
                    resolve();
                }).catch(err => {
                    console.log(err);
                    reject();
                })
            })
            .catch(err => {
                // La captura de pantalla no se ha podido realizar.
                console.log(err);
                reject()
            })

        })

    }
}

module.exports = { Renderer }