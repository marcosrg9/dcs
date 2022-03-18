const { createWriteStream, mkdirSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');

function write(buffer) {
    return new Promise((resolve, reject) => {

        // Crea una instancia de Date para el nombre del archivo.
        const date = new Date();
        const path = join(homedir(), 'dss');

        // Crea un WriteStream para almacenar el archivo.
        const out = createWriteStream(join(path, date.getTime() + '.png'));

        // Captura el evento de error en el WriteStream.
        out.on('error', (err) => {

            // Si el directorio no existe
            if (err.code === 'ENOENT') {

                console.log(`No existe el directorio ${path}...`)
                // Crea el el directorio scs.
                /* 
                    Proceso síncrono. Evita que se realicen más capturas hasta que no
                    se haya creado el directorio.
                 */
                mkdirSync(path);

                // Vuelve a intentar escribir de nuevo.
                write(buffer)
                .then(a => { resolve(a) })
                .catch(err => { reject(err) })
                .finally(() => {
                    // Destruye el WriteStream, haya funcionado o no (llama al evento close).
                    out.destroy();
                });

            } else {

                // En caso de que el código no sea ENOENT, rechazar la promesa.
                reject({ msg: 'unknown error', err })
            }
        });
        
        out.on('close', () => {
            // Resuelve la promesa.
            resolve(path);
            
            // Cierra los oyentes de eventos.
            out.removeAllListeners('error')
               .removeAllListeners('finish');
            out.destroy();
        })

        // Escribe el buffer y cierra el WriteStream.
        out.write(buffer);
        out.close();

    })
};

module.exports = { write };