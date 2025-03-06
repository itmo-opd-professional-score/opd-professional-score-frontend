import axios from "axios";
import apiConf from "../api/apiConf.ts";

export default class ApiResolverUtil {
    endpoint = ""

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    async request(url: string, method: string, data?: unknown, jwt?: string) {
        url = `${apiConf.endpoint}/${this.endpoint}/${url}`
        return await (new Promise((resolve, reject) => axios({
            url,
            method,
            data,
            headers: {
                "Authorization": `Bearer ${jwt}`,
            }
        }).then(async (response: unknown) => {
            resolve(response)
        }).catch(async (error: unknown) => {
            reject(error)
        })))
    }
}