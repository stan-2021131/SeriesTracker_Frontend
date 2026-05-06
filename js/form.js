const params = new URLSearchParams(window.location.search)
const id = params.get("id")

const form = document.getElementById("series-form")  //referencia al formulario
const titleInput = document.getElementById("title")  //referencia a titulo de la serie
const imageInput = document.getElementById("image")  //referencia a la imagen
const sinopsisInput = document.getElementById("sinopsis") //referencia a sinopsis
const episodiosInput = document.getElementById("episodios")  //referencia a episodios
const countryInput = document.getElementById("country")  //referencia a pais
const genreInput = document.getElementById("genre")  //referencia a genero
const formTitle = document.getElementById("form-title") //referencia a titulo del formulario
const formSubtitle = document.getElementById("form-subtitle") //referencia a subtitulo del formulario
const cancelBtn = document.getElementById("cancel-btn") //referencia a boton cancelar

const isEdicion = id != null //true si viene con id para edición

async function getSerie() {
    if (!isEdicion) return //si no es edicion, no se hace nada

    try {
        const data = await apiGet(`/series/${id}`) //llama a la api para obtener la serie
        const serie = data.data || data //si no tiene data, se asume que es el objeto directo

        //llena los campos con los datos de la serie
        titleInput.value = serie.titulo
        sinopsisInput.value = serie.sinopsis
        episodiosInput.value = serie.episodios
        countryInput.value = serie.pais_origen
        genreInput.value = serie.genero_principal

    } catch (error) {
        alert("Error cargando serie para editar")
        window.location.href = "index.html"
    }
}

function uiSetup() {
    if (isEdicion) { //si es edicion, cambia el titulo y subtitulo del formulario
        formTitle.textContent = "Editar Serie"
        formSubtitle.textContent = "Actualiza los datos de la serie"
    } else {
        formTitle.textContent = "Agregar Nueva Serie"
        formSubtitle.textContent = "Completa los datos para agregar una serie"
    }
    cancelBtn.addEventListener("click", () => { // cuando se hace clic en cancelar, vuelve a la pagina principal
        window.location.href = "index.html"
    })
}

form.addEventListener("submit", async (e) => {
    e.preventDefault() //previene el comportamiento por defecto del formulario
    const formData = new FormData()
    formData.append("titulo", titleInput.value) //crea el objeto serie con los datos del formulario
    formData.append("sinopsis", sinopsisInput.value)
    formData.append("episodios", episodiosInput.value)
    formData.append("pais_origen", countryInput.value)
    formData.append("genero_principal", genreInput.value)
    if (imageInput.files[0]) { //Si hay imagen se agregar en la data del formulario
        formData.append("imagen", imageInput.files[0])
    }
    try {
        if (isEdicion) {
            await apiPut(`/series/${id}`, formData) //llama a la api para editar la serie
            alert("Serie actualizada correctamente")
        } else {
            await apiPostForm("/series", formData) //llama a la api para agregar la serie
            alert("Serie agregada correctamente")
        }
        window.location.href = "index.html" //vuelve a la pagina principal
    } catch (error) {
        alert("Error al guardar la serie")
    }
})

//inicializar la aplicacion
uiSetup()
getSerie()