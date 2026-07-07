export const api = {
    getData: () => fetch('/api/data').then(r => r.json()),
    
    getItems: () => fetch('/api/items').then(r => r.json()),
    addItem: (item) => fetch('/api/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    }).then(r => r.json()),
    updateItem: (id, data) => fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteItem: (id) => fetch(`/api/items/${id}`, { method: 'DELETE' }).then(r => r.json()),
    
    getShopping: () => fetch('/api/shopping').then(r => r.json()),
    addShopping: (item) => fetch('/api/shopping', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    }).then(r => r.json()),
    updateShopping: (id, data) => fetch(`/api/shopping/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteShopping: (id) => fetch(`/api/shopping/${id}`, { method: 'DELETE' }).then(r => r.json()),

    getRoommates: () => fetch('/api/roommates').then(r => r.json()),
    addRoommate: (member) => fetch('/api/roommates', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(member)
    }).then(r => r.json()),
    updateRoommate: (id, data) => fetch(`/api/roommates/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteRoommate: (id) => fetch(`/api/roommates/${id}`, { method: 'DELETE' }).then(r => r.json()),

    getLogs: () => fetch('/api/logs').then(r => r.json()),
    addLog: (log) => fetch('/api/logs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(log)
    }).then(r => r.json())
};
