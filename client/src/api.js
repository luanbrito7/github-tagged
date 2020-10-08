import axios from 'axios'

class Api {
    constructor() {
        this.client = axios.create({
			baseURL: 'http://localhost:8080/',
			"Content_Type": "application/json"
        })
    }

    get(url, params = []) {
        let token = localStorage.getItem('token');
        const paramString = params.join('/');
        return this.client.get(url, {
            headers: {
                token: token
            },
            params: {
                params: paramString
            }
        });
    }

    put(url, data) {
        let token = localStorage.getItem('token');
        return this.client.put(url, data, { headers: { token: token }});
    }

    post(url, data) {
        let token = localStorage.getItem('token');
        return this.client.post(url, data, { headers: { token: token }});
    }
}

let api = new Api()

export default api;