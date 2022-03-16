const { createWriteStream, mkdirSync } = require('fs');
const { homedir } = require('os');

function write(buffer) {
    return new Promise((resolve, reject) => {

        // Crea una instancia de Date para el nombre del archivo.
        const date = new Date();
        const path = `${ homedir() }/scs/${ date.toISOString() }.png`;

        // Crea un WriteStream para almacenar el archivo.
        const out = createWriteStream(path);

        // Captura el evento de error en el WriteStream.
        out.on('error', (err) => {

            // Si el directorio no existe (scs - "SCreenshotS")
            if (err.code === 'ENOENT') {

                console.log(`No existe el directorio ${homedir()}/cps...`)
                // Crea el el directorio scs.
                /* 
                    Proceso síncrono. Evita que se realicen más capturas hasta que no
                    se haya creado el directorio.
                 */
                mkdirSync(`${homedir()}/scs`);

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

        // Escribe el buffer en el WriteStream.
        out.write(buffer);

    })
};

module.exports = { write };