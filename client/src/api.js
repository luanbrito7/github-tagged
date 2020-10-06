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
        console.log(token)
        const paramString = params.join('/');
        console.log(paramString)
        return this.client.get(url, {
            headers: {
                token: token
            },
            params: {
                params: paramString
            }
        });
    }
}

let api = new Api()

export default api;