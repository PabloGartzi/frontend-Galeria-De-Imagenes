/* VARIABLES*/
const client = 'RQWQAsp0OfX6ei1TGzj7LPE2NronT34Begtc9VizPvO1kY3v9C7IUD2d';
const urlApi = `https://api.pexels.com/v1/`

/* EVENTOS*/

/*FUNCIONES*/
const connect = async (urlAp) => {
    try {
        const resp = await fetch(urlAp, {
            method: 'GET', // el metodo para el llamado
            headers: {
                Authorization: client , //aqui invocamos el token
            }
        });
        if(resp.ok){
            const datos = await resp.json()
            return datos
        } else {
            throw 'No hay'
        }
    } catch (error) {
        throw (error + 'no encontramos nada')
    }
}

const getimgprueba = async () => {
    try {
        const datos = await connect(`${urlApi}photos/2014422`)
        //console.log(datos);
    } catch (error) {
        console.log(error);
    }
}


/*INVOCACIONES*/
getimgprueba();
