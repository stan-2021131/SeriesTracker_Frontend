const CONFIG = {
    API_URL: "http://localhost:3005"
}

async function apiGet(endpoint) {
    try {
        const res = await fetch(`${CONFIG.API_URL}${endpoint}`)
        if (!res.ok) throw new Error(`Error en el api ${res.status}`)
        return res.json()
    } catch (error) {
        console.log(error);
        alert(error.message)
    }
}