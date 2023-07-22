require('dotenv').config();

const ipUrl = 'https://api.ipify.org?format=json';
const secretApiKey = process.env.SECRETKEY;
const apiKey = process.env.APIKEY;
const domainsString = process.env.DOMAIN;
const domains = domainsString.split(',');
const domainBaseUrl = 'https://porkbun.com/api/json/v3/dns/retrieve/';
const apiBaseUrl = 'https://porkbun.com/api/json/v3/dns/edit/';
let externalIp = '';

function runFetch() {
    fetch(ipUrl)
        .then((response) => response.json())
        .then((data) => {
            let domainData = [];
            if (data && externalIp !== data.ip) {
                externalIp = data.ip;
                console.log('New IP: ' + data.ip);
                domains.forEach(function (domain) {

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
                    domainData.push(fetch(domainBaseUrl + domain, options));
                })
            } else {
                throw new Error('Message: IP has not changed');
            }

            return Promise.all(domainData);
        })
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((dataArray) => {

            let fetchPromises = [];

            dataArray.forEach(function (domainData, index) {
                let records = domainData.records;

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
                        fetchPromises.push(fetch(apiBaseUrl + domains[index] + '/'  + record.id, options));
                    }
                });
            })

            return Promise.all(fetchPromises);
        })
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((dataArray) => {
            dataArray.forEach((data) => {
                if (data.status === 'ERROR') {
                    clearInterval(updateProcess);
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

const updateProcess = setInterval(runFetch, 5000);
