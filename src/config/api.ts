import { BASE_URL } from "../constants/config";
import { get, post } from "../utils/request";

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

export async function getEventList(queryType?: number, creator?: string, myAddress?: string) {
    return await post(
        `${BASE_URL}getEvent/getEventLog`,
        {
            queryType: queryType,
            creator: creator,
            myAddress: myAddress
        }
    ).then(res => {
        if (res.data.code === '200') return res.data.data
        return null
    }).catch(error => {
        console.log(error)
        return null
    }
    )
}

export async function getEventDetail(eventId: number) {
    return await get(`${BASE_URL}getEvent/getEventDetail/${eventId}`).then(res => {
        if (res.data.code === '200') return res.data.data
        return null
    }).catch(error => {
        console.log(error)
        return null
    }
    )
}
