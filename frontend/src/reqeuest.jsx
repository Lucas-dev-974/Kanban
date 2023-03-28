const Formater = (data) => {
    const formdata = new FormData()
    Object.keys(data).forEach(_data => formdata.append(_data, data[_data]) )
    return formdata
}

export const request = async (url, method, data) => {
    const host = 'http://localhost:8000/'
    return fetch(host + url, { method: method, body: data != null ? Formater(data) : null})
}