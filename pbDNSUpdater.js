const ipUrl = 'https://api.ipify.org?format=json';
const apiUrl = 'https://porkbun.com/api/json/v3/dns/edit/DOMAIN/ID';
let externalIp = '';
let failCount = 0;

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
                    secretapikey: '',
                    apikey: '',
                    name: 'www',
                    type: 'A',
                    content: data.ip
                }),
            };

            if (externalIp !== data.ip) {
                externalIp = data.ip;
                return fetch(apiUrl, options);
            } else {
                throw new Error('IP has not changed');
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status == 'ERROR') {
                if (failCount < 2) {
                    clearInterval(process);
                    runFetch();
                    failCount++;
                } else {
                    clearInterval(process);
                    console.log('Exiting due to error: ' + data.message);
                    return;
                }
            }
        })
        .catch((error) => {});
}

const process = setInterval(runFetch, 5000);
