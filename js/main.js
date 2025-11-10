document.addEventListener("DOMContentLoaded", () => {
/* VARIABLES*/
const paginaActual = window.location.pathname;

const palabraBuscador = document.querySelector('#buscador');
const contenedor_imagenes = document.querySelector('.contenedor-imagenes');
const paginacion = document.querySelector(".Paginacion");


const client = 'RQWQAsp0OfX6ei1TGzj7LPE2NronT34Begtc9VizPvO1kY3v9C7IUD2d';
const urlApi = `https://api.pexels.com/v1/`

const fragment = document.createDocumentFragment();

/* EVENTOS*/

document.addEventListener('click', async (ev) => {
    if (paginaActual.includes("favoritos.html")) {
        if (ev.target.matches('.imagen')) {
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=600,height=300,left=100,top=100`;
            window.open(ev.target.src, "test", params);
        }
        
    }
    if (ev.target.matches('#buscarBtn')){
        const palabra = palabraBuscador.value.trim(); //usar para eliminar espacios en blanco al inicio y al final del string
        const listaFotos = await buscadorFotosPalabra(palabra, 1);
        pintarImagenesBuscar(listaFotos);
        await funcionPaginacion(palabra, 1);
    }
    if (ev.target.matches('.btnFavorito')) {
        const foto = JSON.parse(ev.target.dataset.foto);
        guardarFavorito(foto);
        ev.target.disabled = true;
        ev.target.textContent = "✅ Guardado";
        ev.target.style.color = "black";
    }
    if (ev.target.matches('.basurilla')) {
        const foto = JSON.parse(ev.target.dataset.foto);
        eliminarFavorito(foto);
        const figure = ev.target.closest('figure');
        const btnFav = figure.querySelector('.btnFavorito');

        if (btnFav) {
            btnFav.disabled = false;
            btnFav.textContent = "Favorito ⭐";
        }
    }
    if (ev.target.matches('.tagsInicio')){
        const tag = ev.target.id;
        const listaFotos = await buscadorFotosPalabra(tag, 1);
        pintarImagenesBuscar(listaFotos);
        await funcionPaginacion(tag, 1);
    }
    if (ev.target.matches('.boton_paginacion')){
        const accion = ev.target.dataset.accion;
        numPagMax = await cantidadFotos(ev.target.dataset.tag);
        const tag = ev.target.dataset.tag;
        const pagina = parseInt(ev.target.dataset.pagina);
        if(accion == "avanzar"){
            if(pagina < numPagMax){
                const listaFotos = await buscadorFotosPalabra(tag, pagina+1);
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, pagina+1);
            }
            else{
                console.log("No puedes avanzar más")
            }
            
        }
        else if(accion == "retroceder"){
            if(pagina > 1){
                const listaFotos = await buscadorFotosPalabra(tag, pagina-1);
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, pagina-1);
            }
            else{
                console.log("No puedes retroceder más")
            }
        }
        else if (accion == "page") {
            if (pagina >= 1 && pagina <= numPagMax) {
                const listaFotos = await buscadorFotosPalabra(tag, pagina);
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, pagina);
            }
        }        
        else{
            console.log("ALGO ESTÁ MAL HECHO.")
        }
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

//cambiar para que el query cambie por un parametro dependiendo de la funcion
const buscadorFotosPalabra = async (tag, numPag) => {
    try {
        const datos = await connect(`${urlApi}search?query=${tag}&page=${numPag}&per_page=9`)
        console.log(datos);
        const fotos = datos.photos
        console.log(fotos)
        return fotos;
    } catch (error) {
    }
}

const cantidadFotos = async (tag) => {
    try {
        const datos = await connect(`${urlApi}search?query=${tag}&page=1&per_page=9`)
        return Math.ceil(datos.total_results/datos.per_page);
    } catch (error) {
    }
}


//Funcion para pintar las imagenes que se han buscado haciendo uso del input del html
const pintarImagenesBuscar = (listaFotos) => {
    eliminarElementosDOM(contenedor_imagenes);

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    listaFotos.forEach(element => {
        const newFigure = document.createElement("FIGURE");
        
        const newImg = document.createElement("IMG");
        newImg.src = element.src.original;
        newImg.alt = element.alt;
        newImg.id = element.id;
        newImg.classList.add("imagen")

        const newFigcaption = document.createElement("FIGCAPTION");
        newFigcaption.textContent = "Autor: "+element.photographer+". Descripción: "+element.alt;

        const btnFav = document.createElement("BUTTON");
        btnFav.textContent = "Favorito ⭐";
        btnFav.classList.add("btnFavorito"); 
        btnFav.id = element.id;
        btnFav.dataset.foto = JSON.stringify(element);
        
        const btnBasura = document.createElement("BUTTON");
        btnBasura.textContent = "🗑️";
        btnBasura.classList.add("basurilla"); 
        btnBasura.id = element.id;
        btnBasura.dataset.foto = JSON.stringify(element);
        
        const yaFavorito = favoritos.some(fav => fav.id === element.id);
        if (yaFavorito) {
            btnFav.disabled = true;
            btnFav.textContent = "✅ Guardado";
            btnFav.style.color = "black";
        }
        
        newFigure.append(newImg, newFigcaption, btnFav, btnBasura);
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
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const existeFavorito = favoritos.findIndex(fotoLista => fotoLista.id === foto.id);
    if (existeFavorito == -1) {
        console.log("ESA FOTO NO ESTÁ EN FAVORITOS");
    }
    else {
        favoritos.splice(existeFavorito, 1);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
}

const pintarImagenesFavorito = () =>{
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    pintarImagenesBuscar(favoritos);
}


const buscarTagsInicio = async () => {
    let listaFotos = []
    let listaTags = ["Plantas","Comidas","Ciudades"]
    const listaFoto1 = await buscadorFotosPalabra("Plantas",1);
    const listaFoto2 = await buscadorFotosPalabra("Comidas",1);
    const listaFoto3 = await buscadorFotosPalabra("Ciudades",1); 
    
    listaFotos.push(listaFoto1[0],listaFoto2[0],listaFoto3[0])
    pintarTagsInicio(listaFotos, listaTags);
}

const pintarTagsInicio = (listaFotos, listaTags) =>{
    eliminarElementosDOM(contenedor_imagenes);

    listaFotos.forEach(element => {
        const newFigure = document.createElement("FIGURE");

        const newImg = document.createElement("IMG");
        newImg.src = element.src.original;
        newImg.alt = element.alt;
        newImg.classList.add("tagsInicio");
        newImg.id = listaTags[listaFotos.indexOf(element)];

        const newFigcaption = document.createElement("FIGCAPTION");
        newFigcaption.textContent = listaTags[listaFotos.indexOf(element)];
        
        
        newFigure.append(newImg, newFigcaption);
        fragment.append(newFigure);
    });
    contenedor_imagenes.append(fragment);
}

const funcionPaginacion = async (tag, numPag) => {
    eliminarElementosDOM(paginacion);
    
    const cantidadPaginas = await cantidadFotos(tag);
    //const numeroUltimaPagina = Math.max(1, cantidadPaginas);
    
    const indiceBloquePaginas = Math.floor((numPag - 1) / 10);
    const pagInicio = indiceBloquePaginas * 10 + 1;
    const pagFinal = Math.min(pagInicio + 9, cantidadPaginas);

    const botonRetroceder = document.createElement("BUTTON");
    botonRetroceder.textContent = "🡸"
    botonRetroceder.classList.add("boton_paginacion");
    botonRetroceder.dataset.accion = "retroceder";
    botonRetroceder.dataset.pagina = numPag;
    botonRetroceder.dataset.tag = tag;
    if (numPag == 1) botonRetroceder.disabled = true;// controlar numero de pagina
    fragment.append(botonRetroceder);
    
    
    for (let i = pagInicio; i <= pagFinal; i++) {
        const botonPagina = document.createElement("BUTTON");
        botonPagina.textContent = i;
        botonPagina.dataset.accion = "page";
        botonPagina.dataset.pagina = i;
        botonPagina.dataset.tag = tag;
        botonPagina.classList.add("boton_paginacion");
        // marca la página actual
        if (i == numPag) {
            botonPagina.disabled = true;
            botonPagina.id = "actual";
            botonPagina.style.backgroundColor ="blue";
            botonPagina.style.color ="white";
        }
        fragment.append(botonPagina);
    }
    
    
    const botonAvanzar = document.createElement("BUTTON");
    botonAvanzar.textContent = "🡺"
    botonAvanzar.dataset.accion = "avanzar";
    botonAvanzar.dataset.pagina = numPag;
    botonAvanzar.dataset.tag = tag;
    if (numPag === cantidadPaginas) botonAvanzar.disabled = true; // controlar numero de pagina
    botonAvanzar.classList.add("boton_paginacion");
    fragment.append(botonAvanzar);

    paginacion.append(fragment);
}

const eliminarElementosDOM = (elemento) => {
    elemento.innerHTML = "";
}

/*INVOCACIONES*/
//getimgprueba();

if (paginaActual.includes("index.html")) {
    buscarTagsInicio();
}


if (paginaActual.includes("favoritos.html")) {
    pintarImagenesFavorito();
}

});