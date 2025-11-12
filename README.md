# Galería de Imágenes
Repositorio: [frontend‑Galería‑De‑Imagenes](https://github.com/PabloGartzi/frontend-Galeria-De-Imagenes)
Autores: Pablo García // Zahir Rivera

## Descripción
Este proyecto es una aplicación front‑end de galería de imágenes que permite visualizar y gestionar una colección de imágenes en un entorno web. Incluye una página principal de visualización y otra de favoritos, junto con estilos personalizados y script JavaScript para la lógica de la interfaz.

## Características principales
- Página de inicio (`index.html`) con galería de imágenes dinámicas.
- Página de “Favoritos” (`favoritos.html`) para marcar y filtrar aquellas imágenes preferidas.
- Estilos en CSS para diseño responsivo y atractivo visual.
- Lógica en JavaScript para interacción (marcar/desmarcar favoritos, persistencia local si corresponde).
- Estructura de proyecto clara: carpetas `assets/images/`, `css/`, `js/` para organización de recursos.
- Enfoque en experiencia de usuario sencilla, rendimiento adecuado y buen mantenimiento del código.

## Tecnologías utilizadas
- API de Pexels
- HTML5
- CSS3
- JavaScript
- Estructura de carpetas estándar para recursos (imágenes, estilos, scripts)
- Uso de buenas prácticas de separación de responsabilidades (estructura, presentación, comportamiento)

## Requisitos de uso
- Un navegador moderno compatible con HTML5, CSS3 y JavaScript.
- Clonar o descargar el repositorio.
- Abrir `index.html` en el navegador para iniciar la galería.
- (Obligatorio) Cambiar la clave para la autorización de la API en el `main.js` (linea 18).
- (Opcional) Si se usa almacenamiento local de favoritos: permitir acceso al almacenamiento local del navegador.

## Instalación y puesta en marcha  
1. Clona el repositorio:
   ```bash
   git clone https://github.com/PabloGartzi/frontend-Galeria-De-Imagenes.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd frontend-Galeria-De-Imagenes
   ```
3. Abre `index.html` en tu navegador preferido.
4. Si deseas, abre también `favoritos.html` para ver la sección de favoritos.

## Estructura del proyecto
```
frontend-Galeria-De-Imagenes/
│
├─ assets/
│   └─ images/
│        └─ main.css     # Imagen de carga
│
├─ css/
│   └─ main.css          # Hojas de estilo para la interface
│
├─ js/
│   └─ main.js           # Scripts JavaScript para la funcionalidad
│
├─ index.html            # Página de inicio de la galería
└─ favoritos.html        # Página de favoritos
```

## Buenas prácticas & notas de desarrollo
- El código está organizado para facilitar su lectura y mantenimiento.
- Se recomienda usar nombres de clases y funciones significativos para ampliar la galería o integrar nuevas funcionalidades.
- Si se desea expandir: implementar paginación, carga asíncrona de imágenes, filtro por etiquetas, integración con API externa, diseño adaptativo completo, etc.
- Validar compatibilidad entre navegadores si se añade funcionalidad avanzada.
- Mantener los recursos (imágenes, scripts) optimizados para mejorar tiempos de carga.

## Licencia
Este proyecto se distribuye bajo la [MIT License](https://opensource.org/licenses/MIT) (o la licencia que prefieras).
(Tu puedes especificar la licencia real que aplicas: MIT, GPL, etc.)

## Contribución
Si deseas colaborar o reportar problemas, puedes abrir un *issue* en el repositorio o proponer un *pull request*. Agradecemos los comentarios para mejorar la aplicación.

## Contacto
Puedes contactarme a través de mi perfil de GitHub: [Pablo García](https://github.com/PabloGartzi)
Estoy abierto a sugerencias, mejoras o adaptaciones del proyecto a otros contextos.