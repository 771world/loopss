import axios from 'axios'
// import { getToken, setToken, getRefreshToken } from './auth'

const refresh = false

// 刷新 access_token 的接口
const refreshToken = () => {
    // @ts-ignore
    return instance.post('/auth/refresh', { refresh_token: getRefreshToken() }, true)
}

// 创建 axios 实例
const instance = axios.create({
    baseURL: process.env.GATSBY_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 标记是否正在刷新 token
let isRefreshing = false
// 存储待重发请求的数组
let requests: any[] = []

// instance.interceptors.response.use(
//     response => {
//         return response
//     },
//     error => {
//         if (!error.response) {
//             return Promise.reject(error)
//         }
//         if (error.response.code === 401 && !error.config.url.includes('/auth/refresh')) {
//             const { config } = error
//             if (refresh) {
//                 if (!isRefreshing) {
//                     isRefreshing = true
//                     return refreshToken()
//                         .then(res => {
//                             const { access_token } = res.data
//                             setToken(access_token)
//                             config.headers.Authorization = `${access_token}`
//                             // token 刷新后将数组的方法重新执行
//                             requests.forEach(cb => cb(access_token))
//                             requests = [] // 重新请求完清空
//                             return instance(config)
//                         })
//                         .catch(err => {
//                             console.log('Please login again.')
//                             return Promise.reject(err)
//                         })
//                         .finally(() => {
//                             isRefreshing = false
//                         })
//                 } else {
//                     // 返回未执行 resolve 的 Promise
//                     return new Promise(resolve => {
//                         // 用函数形式将 resolve 存入，等待刷新后再执行
//                         requests.push((token: string) => {
//                             config.headers.Authorization = `${token}`
//                             resolve(instance(config))
//                         })
//                     })
//                 }
//             } else {
//                 return Promise.reject('Please login again.')
//             }
//         }
//         return Promise.reject(error)
//     }
// )


/**
 * @description: set token to request header
 * @param {boolean} isNeedToken
 * @return {*}
 */
const setHeaderToken = (isNeedToken: boolean) => {
    // const accessToken = isNeedToken ? getToken() : null
    // if (isNeedToken) {
    //     // api 请求需要携带 access_token
    //     if (!accessToken) {
    //         console.log('不存在 access_token 则跳转回登录页')
    //     }
    //     instance.defaults.headers.common.Authorization = `${accessToken}`
    // }
}

/**
 * @description: get request
 * @param {string} url  
 * @param {any} params  
 * @param {boolean} isNeedToken  
 * @return {*}
 */
export const get = (url: string, params: any = {}, isNeedToken: boolean = false) => {
    setHeaderToken(isNeedToken)
    return instance({
        method: 'get',
        url,
        params,
    })
}

/**
 * @description: post request
 * @param {string} url  
 * @param {any} params  
 * @param {boolean} isNeedToken  
 * @return {*}
 */
export const post = (url: string, params: any = {}, isNeedToken: boolean = false) => {
    setHeaderToken(isNeedToken)
    return instance({
        method: 'post',
        url,
        data: params,
    })
}