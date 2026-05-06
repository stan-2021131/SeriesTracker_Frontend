const CONFIG = {
    API_URL: "http://localhost:3005"
}

async function apiGet(endpoint) {
    const res = await fetch(`${CONFIG.API_URL}${endpoint}`)
    if (res.status == 404) return { data: [] }
    if (!res.ok) throw new Error(`Error en el api ${res.status}`)
    return res.json()
}

async function apiPost(endpoint, body) {
    const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        throw new Error(`Error en POST ${res.status}`)
    }
    return res.json()
}

async function apiDelete(endpoint) {
    const res = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error(`Error en DELETE ${res.status}`)
    }
}