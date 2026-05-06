const params = new URLSearchParams(window.location.search)
const id = params.get("id")

const cover = document.getElementById("cover") //portada blur
const image = document.getElementById("image") //imagen principal
const title = document.getElementById("title") //titulo
const sinopsis = document.getElementById("sinopsis") //sinopsis
const episodios = document.getElementById("episodios") //episodios
const pais = document.getElementById("pais") //pais
const genero = document.getElementById("genero") //genero
const ratingText = document.getElementById("rating") //rating
const deleteBtn = document.getElementById("delete-btn") //boton eliminar
const editBtn = document.getElementById("edit-btn") //boton editar
const stars = document.querySelectorAll("#stars span")
const rateBtn = document.getElementById("rate-btn") //boton calificar

let selectedRating = 0 // valor seleccionado por el usuario
// cargar datos de la serie
async function getSerie() {
    try {
        const data = await apiGet(`/series/${id}`)

        const serie = data.data || data

        const imageUrl = `${CONFIG.API_URL}${serie.portada_url}`

        // portada blur
        cover.style.backgroundImage = `url(${imageUrl})`

        // imagen perfil
        image.src = imageUrl

        // info
        title.textContent = serie.titulo
        sinopsis.textContent = serie.sinopsis
        episodios.textContent = serie.episodios
        pais.textContent = serie.pais_origen
        genero.textContent = serie.genero_principal

    } catch (err) {
        alert("Error cargando serie")
    }
}

//cargar rating promedio
async function getRating() {
    try {
        const data = await apiGet(`/series/${id}/ratings`)

        const avg = data.data || 0

        ratingText.textContent = `⭐ ${avg.toFixed(1)}`
    } catch {
        ratingText.textContent = "⭐ 0"
    }
}

// seleccionar estrella (solo visual, no envía)
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value)
        stars.forEach(s => {
            s.classList.toggle("active", parseInt(s.dataset.value) <= selectedRating)
        })
    })

    // hover preview
    star.addEventListener("mouseenter", () => {
        const hoverVal = parseInt(star.dataset.value)
        stars.forEach(s => {
            s.style.color = parseInt(s.dataset.value) <= hoverVal ? "var(--primary)" : "#ccc"
        })
    })

    star.addEventListener("mouseleave", () => {
        // restaurar al estado seleccionado
        stars.forEach(s => {
            s.style.color = parseInt(s.dataset.value) <= selectedRating ? "var(--primary)" : "#ccc"
        })
    })
})

// enviar rating al presionar el botón Calificar
rateBtn.addEventListener("click", async () => {
    if (selectedRating === 0) {
        alert("Por favor selecciona una calificación antes de enviar.")
        return
    }
    try {
        await apiPost(`/series/${id}/ratings`, { puntaje: selectedRating })
        alert(`¡Calificación enviada exitosamente! (${selectedRating})`)
        getRating()
    } catch {
        alert("Error al enviar la calificación. Intenta de nuevo.")
    }
})

//eliminar serie
deleteBtn.addEventListener("click", async () => {
    if (!confirm("¿Seguro que deseas eliminar esta serie?")) return

    try {
        await apiDelete(`/series/${id}`)
        alert("Serie eliminada correctamente. Regresando al inicio")
        window.location.href = "index.html"
    } catch {
        alert("Error al eliminar serie")
    }
})

//editar serie
editBtn.addEventListener("click", () => {
    window.location.href = `form.html?id=${id}`
})

// init
getSerie()
getRating()