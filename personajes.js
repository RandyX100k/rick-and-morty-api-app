document.addEventListener('DOMContentLoaded', () => {
    let personajes = [];
    let info = {};
    let currentUrl = 'https://rickandmortyapi.com/api/character';
    //SELECTORES
    const filter_personaje = document.querySelector('#filter_personaje');
    const container_personajes = document.querySelector('#personajes');
    const select = document.querySelector('#filter');
    const qty_personajes = document.querySelector('#qty_personajes');
    const paginacion = document.querySelector('#paginacion');

    //eventos
    filter_personaje.addEventListener('input', Buscar_Personaje);
    select.addEventListener('change', FiltrarPorEstado);

    //renderizar cuando carga el html
    cargarPagina(currentUrl);

    async function cargarPagina(url) {
        try {
            const result = await fetch(url)
                .then(result => result.json())
                .then(data => {
                    personajes = data.results;
                    info.next = data.info.next;
                    info.prev = data.info.prev;
                    RenderizarDatos(personajes);
                    RenderizarPaginacion();
                });
        } catch (error) {
            console.log(error);
        }
    }

    function Buscar_Personaje(e) {
        procesarResultado(e.target.value.toLowerCase());
    }

    function FiltrarPorEstado(e) {
        const value_search = e.target.value;
        let results;
        if (value_search === "none") {
            results = personajes;
        } else {
            results = personajes.filter(value => value.status.toLowerCase() === value_search.toLowerCase());
        }
        RenderizarDatos(results);
    }

    function procesarResultado(name_search) {
        const result = personajes.filter(value => value.name.toLowerCase().includes(name_search));
        RenderizarDatos(result);
    }

    function RenderizarDatos(results = []) {
        container_personajes.innerHTML = '';
        results.forEach(result => {
            const { image, name, species, status } = result;

            const col = document.createElement('div');
            col.classList.add('col-md-3', 'mb-4');

            const estadoClass = status === 'Alive' ? 'estado-alive'
                : status === 'Dead' ? 'estado-dead'
                    : 'estado-unknown';

            col.innerHTML = `
                <div class="card-personaje">
                    <img src="${image}" alt="${name}">
                    <h4>${name}</h4>
                    <p>${species}</p>
                    <p class="${estadoClass}">${status}</p>
                </div>
            `;

            container_personajes.appendChild(col);
        });

        qty_personajes.textContent = `Cantidad de personajes: ${results.length}`;
    }

    function RenderizarPaginacion() {
        paginacion.innerHTML = '';

        if (info.prev) {
            const anterior = document.createElement('button');
            anterior.textContent = 'Anterior';
            anterior.addEventListener('click', () => {
                cargarPagina(info.prev);
                currentUrl = info.prev;
            });
            paginacion.appendChild(anterior);
        }

        if (info.next) {
            const siguiente = document.createElement('button');
            siguiente.textContent = 'Siguiente';
            siguiente.addEventListener('click', () => {
                cargarPagina(info.next);
                currentUrl = info.next;
            });
            paginacion.appendChild(siguiente);
        }
    }
});