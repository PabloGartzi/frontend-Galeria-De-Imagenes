document.addEventListener("DOMContentLoaded", () => {
/* VARIABLES*/
const paginaActual = window.location.pathname;

const palabraBuscador = document.querySelector('#buscador');
const contenedor_imagenes = document.querySelector('.contenedor-imagenes');
const indice = document.querySelector('.indice');
const paginacion = document.querySelector(".Paginacion");
const selector = document.querySelector('.selectPosicion');
const popup = document.querySelector('#popup');
const preloader = document.querySelector('#preloader');

let modoActual = "inicio";
let ultimoTag = "";
let ultimaPagina = 1;


const client = 'RQWQAsp0OfX6ei1TGzj7LPE2NronT34Begtc9VizPvO1kY3v9C7IUD2d';
const urlApi = `https://api.pexels.com/v1/`

const fragment = document.createDocumentFragment();

/* EVENTOS*/
document.addEventListener('click', async (ev) => {
    if (paginaActual.includes("favoritos.html")) {
        if (ev.target.matches('.imagen') && popup.childElementCount === 0) {
            const src = ev.target.src;
            const desc = ev.target.alt;
            abrirPopupFavoritos(src, desc);
        }
    }
    if (paginaActual.includes("favoritos.html")) {
        if (ev.target.matches("#cerrar-popup")){
            cerrarPopupFavoritos();
        }
    }
    if (ev.target.matches('#buscarBtn')){
        const palabra = palabraBuscador.value.trim(); //usar para eliminar espacios en blanco al inicio y al final del string
        const palabraValidada = validaPalabra(palabra);       
        if (palabraValidada === null) {
            pintarNoEncontrado();
            return;
        }
        const listaFotos = await buscadorFotosPalabra(palabraValidada, 1);
        //si existe listaFotos entra
        if (listaFotos) {
            pintarImagenesBuscar(listaFotos);
            await funcionPaginacion(palabra, 1);
            modoActual = "busqueda";
            ultimoTag = palabra;
            ultimaPagina = 1;
        }
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
        modoActual = "tag";
        ultimoTag = tag;
        ultimaPagina = 1;
        
    }
    if (ev.target.matches('.boton_paginacion')){
        const accion = ev.target.dataset.accion;
        numPagMax = await cantidadFotos(ev.target.dataset.tag);
        const tag = ev.target.dataset.tag;
        const pagina = parseInt(ev.target.dataset.pagina);
        if(accion == "avanzar"){
            if(pagina < numPagMax){
                const listaFotos = await buscadorFotosPalabra(tag, pagina+1);
                buscarTagsInicio();
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
                buscarTagsInicio();
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
                buscarTagsInicio();
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, pagina);      
            }
        }        
        else if (accion == "inicio") {
            if (pagina >= 1 && pagina <= numPagMax) {
                const listaFotos = await buscadorFotosPalabra(tag, 1);
                buscarTagsInicio();
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, 1);      
            }
        }        
        else if (accion == "final") {
            if (pagina >= 1 && pagina <= numPagMax) {
                const listaFotos = await buscadorFotosPalabra(tag, numPagMax);
                buscarTagsInicio();
                pintarImagenesBuscar(listaFotos);
                await funcionPaginacion(tag, numPagMax);      
            }
        }        
        else{
            console.log("ALGO ESTÁ MAL HECHO. (PAGINACIÓN)")
        }
        ultimaPagina = pagina;
    }

})
document.addEventListener("change", async (ev) => {
    if (modoActual == "inicio") {
        buscarTagsInicio();
    } 
    else {
        buscarTagsInicio();
        const listaFotos = await buscadorFotosPalabra(ultimoTag, 1);
        pintarImagenesBuscar(listaFotos);
        await funcionPaginacion(ultimoTag, 1);
    }
})

/*FUNCIONES*/
/**
 * Esta funcion valida que la palabra ingresada en el input del buscador
 * cumpla con los parametros establecidos (solo letras, numeros y espacios)
 * @param {string} palabra 
 * @returns 
 */
const validaPalabra = (palabra) => {
    let valido = true;
    let regExp = new RegExp(/^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ0-9 ]*$/);
    let validando = regExp.test(palabra);
    if(palabra == ""){
        console.log("Esto esta vacio >:c");
        return null;
    }else if(validando == false){
        console.log("Esto no cumple los parametros");
        return null;
    }
    if(valido == true){
        return palabra;
    }
}
/**
 * Esta funcion realiza una conexion a la API
 * @async
 * @param {string} urlAp 
 * @returns 
 */
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
/**
 * Esta funcion busca fotos en la API
 * @async
 * @param {string} tag 
 * @param {number} numPag 
 * @returns 
 */
const buscadorFotosPalabra = async (tag, numPag) => {
    try {
        cargando(true);
        const datos = await connect(`${urlApi}search?query=${tag}&orientation=${selector.value}&page=${numPag}&per_page=21`)
        const fotos = datos.photos
        return fotos;
    } catch (error) {
    }
    finally{
        cargando(false);
    }
}
/**
 * funcion que calcula la cantidad de fotos que hay en la busqueda
 * @async
 * @param {string} tag 
 * @returns 
 */
const cantidadFotos = async (tag) => {
    try {
        const datos = await connect(`${urlApi}search?query=${tag}&orientation=${selector.value}&page=1&per_page=21`)
        return Math.ceil(datos.total_results/datos.per_page);
    } catch (error) {
    }
}
/**
 * function para pintar las imagenes que se han buscado con la funcion de buscarFotosPalabra
 * @param {Array<Object>} listaFotos 
 */
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
/**
 * Funcion para guardar en localStorage las fotos favoritas
 * @param {Object} foto 
 */
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
/**
 * Funcion para eliminar fotos de favoritos y del localStorage
 * @param {Object} foto 
 */
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
/**
 * Funcion para pintar las imagenes que traemos del local storage a favoritos
 */
const pintarImagenesFavorito = () =>{
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    currentPhotos = favoritos;
    pintarImagenesBuscar(favoritos, "Normal");
}
/**
 * Funcion para pintar los tags en el inicio
 * @async
 */
const buscarTagsInicio = async () => {
    let listaFotos = []
    let listaTags = ["Plantas","Comidas","Ciudades"]
    const listaFoto1 = await buscadorFotosPalabra("Plantas",1);
    const listaFoto2 = await buscadorFotosPalabra("Comidas",1);
    const listaFoto3 = await buscadorFotosPalabra("Ciudades",1); 
    
    listaFotos.push(listaFoto1[0],listaFoto2[0],listaFoto3[0])
    pintarTagsInicio(listaFotos, listaTags);
}
/**
 * funcion que pinta los tags en el inicio
 * @param {Array<Object>} listaFotos 
 * @param {Array<string>} listaTags 
 */
const pintarTagsInicio = (listaFotos, listaTags) =>{
    eliminarElementosDOM(indice);
    listaFotos.forEach(element => {
        const newFigure = document.createElement("FIGURE");
        const newImg = document.createElement("IMG");
        newImg.src = element.src.original;
        newImg.alt = element.alt;
        newImg.classList.add("tagsInicio");
        newImg.id = listaTags[listaFotos.indexOf(element)];

        const newFigcaption = document.createElement("FIGCAPTION");
        newFigcaption.textContent = listaTags[listaFotos.indexOf(element)];
        newFigcaption.dataset.foto_inicio = JSON.stringify(element);
        newFigcaption.id = listaTags[listaFotos.indexOf(element)];

        newFigure.append(newImg, newFigcaption);
        fragment.append(newFigure);
    });
    indice.append(fragment);
}
/**
 * funcion de paginacion 
 * creamos las paginacion dinamicamente
 * @async
 * @param {string} tag 
 * @param {number} numPag 
 */
const funcionPaginacion = async (tag, numPag) => {
    eliminarElementosDOM(paginacion);
    const cantidadPaginas = await cantidadFotos(tag);
    const pagInicio = Math.max(numPag -5, 1);
    const pagFinal = Math.min(numPag + 5, cantidadPaginas);

    const mMin = document.createElement("BUTTON");
    mMin.textContent = "🡸🡸"
    mMin.classList.add("boton_paginacion");
    mMin.dataset.accion = "inicio";
    mMin.dataset.pagina = numPag;
    mMin.dataset.tag = tag;
    if (numPag == 1) mMin.disabled = true;
    fragment.append(mMin);
    
    const botonRetroceder = document.createElement("BUTTON");
    botonRetroceder.textContent = "🡸"
    botonRetroceder.classList.add("boton_paginacion");
    botonRetroceder.dataset.accion = "retroceder";
    botonRetroceder.dataset.pagina = numPag;
    botonRetroceder.dataset.tag = tag;
    if (numPag == 1) botonRetroceder.disabled = true;
    fragment.append(botonRetroceder);
    
    for (let i = pagInicio; i <= pagFinal; i++) {
        const botonPagina = document.createElement("BUTTON");
        botonPagina.textContent = i;
        botonPagina.dataset.accion = "page";
        botonPagina.dataset.pagina = i;
        botonPagina.dataset.tag = tag;
        botonPagina.classList.add("boton_paginacion");

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
    if (numPag == cantidadPaginas) botonAvanzar.disabled = true;
    botonAvanzar.classList.add("boton_paginacion");
    fragment.append(botonAvanzar);

    const mMax = document.createElement("BUTTON");
    mMax.textContent = "🡺🡺"
    mMax.dataset.accion = "final";
    mMax.dataset.pagina = numPag;
    mMax.dataset.tag = tag;
    if (numPag == cantidadPaginas) mMax.disabled = true;
    mMax.classList.add("boton_paginacion");
    fragment.append(mMax);

    paginacion.append(fragment);
}
/**
 * funcion que abre el popup en favoritos
 * @param {string} src 
 * @param {string} descripcion 
 */
const abrirPopupFavoritos = (src, descripcion) => {
    popup.style.display = 'none';
    popup.style.position = 'fixed';

    const contornoPopup = document.createElement('div');
    contornoPopup.classList.add('contorno');

    const img = document.createElement('img');
    img.src = src;
    img.id = 'img-popup';
    img.alt = descripcion;

    const desc = document.createElement('p');
    desc.id = 'descripcion-popup';
    desc.textContent = descripcion;

    const btnCerrar = document.createElement('button');
    btnCerrar.id = 'cerrar-popup';
    btnCerrar.textContent = 'X';
    contornoPopup.append(img, desc, btnCerrar);

    popup.append(contornoPopup);
    popup.style.display = 'flex';
}
/**
 * funcion para cerrar el popup de favoritos
 */
const cerrarPopupFavoritos =() => {
    popup.style.display = 'none';
    eliminarElementosDOM(popup);
}
/**
 * funcion para eliminar elementos del DOM
 * @param {HTMLElement} elemento 
 */
const eliminarElementosDOM = (elemento) => {
    elemento.innerHTML = "";
}
const pintarNoEncontrado = () => {
    eliminarElementosDOM(contenedor_imagenes);
    const mensaje = document.createElement("p");
    mensaje.textContent = "NO CUMPLE CON LOS PARAMETROS";
    mensaje.classList.add("error");
    contenedor_imagenes.append(mensaje);
}
/**
 * funcion para mostrar y ocultar el preloader
 * @param {boolean} mostrar 
 */
const cargando = (mostrar = false) => {
    if (mostrar) {
        preloader.classList.remove('mostrar');
    } else {
        preloader.classList.add('mostrar');
    }
}

/*INVOCACIONES*/

if (paginaActual.includes("index.html") || paginaActual === "/") {
    buscarTagsInicio();
}
if (paginaActual.includes("favoritos.html")) {    
    pintarImagenesFavorito();
}

});
