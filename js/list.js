const container = document.getElementById("series-container") //Contenedor de series
const searchInput = document.querySelector(".search-input") //Barra de búsqueda
const searchBtn = document.querySelector(".search-button") //Botón de buscar
const sortSelect = document.getElementById("sort") //Botón de ordenar
const orderSelect = document.getElementById("order") //Botón de orden
const prevBtn = document.getElementById("prev-page") //Botón de página anterior
const nextBtn = document.getElementById("next-page") //Botón de página siguiente
const pageInfo = document.getElementById("page-info") //Información de página

let paginaActual = 1
const limite = 6
let consultaActual = ""
let ordenActual = "id"
let direccionActual = "asc"

function query() {
    return `/series?page=${paginaActual}&limit=${limite}&q=${consultaActual}&sort=${ordenActual}&order=${direccionActual}`
}

async function getSeries() {
    try {
        const data = await apiGet(query())

        const list = data.data || data

        if (list.length === 0) {
            container.innerHTML = `<p>No se encontraron series</p>`
            return
        }

        container.innerHTML = list.map(s => `
      <div class="card">
        <img src="${CONFIG.API_URL}${s.portada_url}">
        <div class="card-content">
          <h3>${s.titulo}</h3>
          <p>${s.sinopsis}</p>
          <button data-id="${s.id}">Ver detalles</button>
        </div>
      </div>
    `).join("")

        pageInfo.textContent = `Página ${paginaActual}`

    } catch (err) {
        console.error(err)
        container.innerHTML = "<p>Error cargando series</p>"
    }
}

// navegación
container.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = e.target.dataset.id
        window.location.href = `detail.html?id=${id}`
    }
})

//búsqueda
searchBtn.addEventListener("click", () => {
    consultaActual = searchInput.value
    paginaActual = 1
    getSeries()
})

// ordenamiento
sortSelect.addEventListener("change", () => {
    ordenActual = sortSelect.value
    getSeries()
})

orderSelect.addEventListener("change", () => {
    direccionActual = orderSelect.value
    getSeries()
})

// paginación
nextBtn.addEventListener("click", () => {
    paginaActual++
    getSeries()
})

prevBtn.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--
        getSeries()
    }
})

getSeries()