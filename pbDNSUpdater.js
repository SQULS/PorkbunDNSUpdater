const ipUrl = 'https://api.ipify.org?format=json';
const secretApiKey = '';
const apiKey = '';
const domain = ''
const domainUrl = 'https://porkbun.com/api/json/v3/dns/retrieve/' + domain;
const apiUrl = 'https://porkbun.com/api/json/v3/dns/edit/' + domain + '/';
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
                    secretapikey: secretApiKey,
                    apikey: apiKey,
                }),
            };

            if (data && externalIp !== data.ip) {
                externalIp = data.ip;
                console.log('New IP: ' + data.ip);
                return fetch(domainUrl, options);
            } else {
                throw new Error('Message: IP has not changed');
            }
        })
        .then((response) => response.json())
        .then((data) => {
            let records = data.records;
            let fetchPromises = [];

            records.forEach(function (record) {
                if (record.type === 'A') {
                    const options = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            "Content-Type": 'application/json;charset=UTF-8',
                        },
                        body: JSON.stringify({
                            secretapikey: secretApiKey,
                            apikey: apiKey,
                            name: record.name.substring(0, 3) === 'www' ? 'www' : '',
                            type: record.type,
                            content: externalIp
                        }),
                    };
                    fetchPromises.push(fetch(apiUrl + record.id, options));
                }
            });

            return Promise.all(fetchPromises); // Wait for all fetch requests to complete
        })
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((dataArray) => {
            dataArray.forEach((data) => {
                if (data.status === 'ERROR') {
                    clearInterval(process);
                    runFetch();
                } else {
                    console.log('Message: ' + data.status);
                }
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
}

const process = setInterval(runFetch, 3600000);
