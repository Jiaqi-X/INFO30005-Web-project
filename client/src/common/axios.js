import _axios from "axios";

// get the back end url 
const axios = baseURL =>{
    const instance = _axios.create({
        baseURL: baseURL || 'http://localhost:8080'
    })
    return instance
}

export {axios}

export default axios();