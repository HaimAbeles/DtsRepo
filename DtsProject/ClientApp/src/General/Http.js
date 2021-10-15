class Http {

    static Get = (url, data, type = "GET") => {
        if (!!data) {
            if (typeof (data) === "string") {
                url = `${url}?${data}`;
            }
            else {
                url = `${url}?${Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&')}`;
            }
        }

        return fetch(url, {
            credentials: 'include',
            method: type
        })
            .then((response) => {
                return response;
            })
    }

    static Post = (url, data) => {
        return fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        })
            .then((response) => {
                //if (!response.ok) {
                //    throw Error(response.statusText);
                //}
                return response;
            });
    }
}
export default Http;