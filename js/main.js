/* VARIABLES*/
const botonBuscar = document.querySelector('#buscarBtn');
const palabraBuscador = document.querySelector('#buscador');
const contenedor_imagenes = document.querySelector('.contenedor-imagenes');
const contenedor_imagenes_fav = document.querySelector('.contenedor-imagenes-favoritos');

const client = 'RQWQAsp0OfX6ei1TGzj7LPE2NronT34Begtc9VizPvO1kY3v9C7IUD2d';
const urlApi = `https://api.pexels.com/v1/`

const fragment = document.createDocumentFragment();

/* EVENTOS*/
botonBuscar.addEventListener('click', async () => {
    const palabra = palabraBuscador.value.trim(); //usar para eliminar espacios en blanco al inicio y al final del string
    console.log(palabra);
    const listaFotos = await buscadorFotosPalabra(palabra);
    pintarImagenesBuscar(listaFotos);
});

contenedor_imagenes.addEventListener('click', (ev) => {
    if (ev.target.matches('.btnFavorito')) {
        const foto = JSON.parse(ev.target.dataset.foto);
        guardarFavorito(foto);
    }
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
        console.log(datos.src.original);
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

//Funcion para pintar las imagenes que se han buscado haciendo uso del input del html
const pintarImagenesBuscar = (listaFotos) => {
    eliminarElementosDOM(contenedor_imagenes);
    listaFotos.forEach(element => {
        const newFigure = document.createElement("FIGURE");
        
        const newImg = document.createElement("IMG");
        newImg.src = element.src.original;
        newImg.alt = element.src.alt;

        const newFigcaption = document.createElement("FIGCAPTION");
        newFigcaption.textContent = "Autor: "+element.photographer+". Descripción: "+element.alt;

        const btnFav = document.createElement("BUTTON");
        btnFav.textContent = "Favorito ⭐";
        btnFav.classList.add("btnFavorito"); 
        btnFav.id = element.id;
        btnFav.dataset.foto = JSON.stringify(element);

        newFigure.append(newImg, newFigcaption, btnFav);
        fragment.append(newFigure);
    });
    contenedor_imagenes.append(fragment);
}

const guardarFavorito = (foto) => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const existeFavorito = favoritos.findIndex(fotoLista => fotoLista.id === foto.id);
    if (existeFavorito == -1) {
        favoritos.push(foto);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
    else {
        console.log("Ya está en favoritos");
    }
}

const eliminarFavorito = (foto) => {
    //TODO
}

const pintarImagenesFavotiro = () =>{

}


const eliminarElementosDOM = (elemento) => {
    elemento.innerHTML = "";
}

/*INVOCACIONES*/
//getimgprueba();


