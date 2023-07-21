const ipUrl = 'https://api.ipify.org?format=json';
const apiUrl = 'https://porkbun.com/api/json/v3/dns/edit/DOMAIN/ID';
let externalIp = '';

function runFetch() {
    fetch(ipUrl)
        .then((response) => response.json())
        .then((data) => {
            const options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                    secretapikey: 'SECRET_API_KEY',
                    apikey: 'API_KEY',
                    name: 'www',
                    type: 'A',
                    content: data.ip
                }),
            };

            if (data && externalIp !== data.ip) {
                externalIp = data.ip;
                return fetch(apiUrl, options);
            } else {
                throw new Error('Message: IP has not changed');
            }
        })
        .then((response) => {
            // Additional error handling for response
            if (!response || !response.json) {
                throw new Error('Error: Invalid response or not a JSON object');
            }
            return response.json();
        })
        .then((data) => {

            if (data.status == 'ERROR') {
                clearInterval(process);
                runFetch();
            } else {
                console.log('Message: ' + data.status);
            }

        })
        .catch((error) => {
            console.log(error.message);
        });
}

const process = setInterval(runFetch, 3600000);
