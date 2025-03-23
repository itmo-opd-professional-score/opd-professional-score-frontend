import axios, {type AxiosInstance} from "axios";
import apiConf from "./api/apiConf.ts";

const http: AxiosInstance = axios.create({
    baseURL: apiConf.endpoint,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-type": "application/json; charset=utf-8",
    },
})

export default http