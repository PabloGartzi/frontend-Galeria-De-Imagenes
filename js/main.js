/* VARIABLES*/
const botonBuscar = document.querySelector('#buscarBtn');
const palabraBuscador = document.querySelector('#buscador');

const client = 'RQWQAsp0OfX6ei1TGzj7LPE2NronT34Begtc9VizPvO1kY3v9C7IUD2d';
const urlApi = `https://api.pexels.com/v1/`


/* EVENTOS*/
botonBuscar.addEventListener('click', () => {
    const palabra = palabraBuscador.value.trim(); //usar para eliminar espacios en blanco al inicio y al final del string
    console.log(palabra);
    buscadorFotosPalabra(palabra);
});


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

//cambiar para que el query cambie por un parametro dependiendo de la funcion
const buscadorFotosPalabra = async (tag) => {
    try {
        const datos = await connect(`${urlApi}search?query=${tag}`)
        const fotos = datos.photos
        console.log(fotos)
        return fotos;
    } catch (error) {
    }
}





/*INVOCACIONES*/
getimgprueba();


