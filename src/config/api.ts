import { BASE_URL } from "../constants/config";
import { get } from "../utils/request";

export async function getTrust(address: string, type: number) {
    return await get(`${BASE_URL}getTrust/${address}/${type}`).then(res => {
        if (res.data.code === '200') return res.data.data
        return null
    }).catch(error => {
        console.log(error)
        return null
    }
    )
}

export async function getGraph(address?: string) {
    return await get(`${BASE_URL}getGraph/${address}`).then(res => {
        if (res.data.code === '200') return res.data.data
        return null
    }).catch(error => {
        console.log(error)
        return null
    }
    )
}