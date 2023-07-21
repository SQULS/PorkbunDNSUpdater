# Porkbun DNS Updater

Service that checks current external IP and updates DNS records with Porkbun accordingly.

## Setup

In order to utilise the Fetch() API that this service uses you will need Node.js 19 or higher installed on your server.

The Porkbun API documentation can be found [here](https://porkbun.com/api/json/v3/documentation).

To retrieve a list of domains and record IDs from your account call the following API passing your credentials.

```https://porkbun.com/api/json/v3/dns/retrieve/DOMAIN/ID```

JSON options to send:
```
{
    "secretapikey": "SECRET_API_KEY",
    "apikey": "API_KEY"
}
```

Example response:
```
{
"status": "SUCCESS",
"records": [
    {
        "id": "106926652",
        "name": "example.com",
        "type": "A",
        "content": "1.1.1.1",
        "ttl": "600",
        "prio": "0",
        "notes": ""
    },
    {
        "id": "106926659",
        "name": "www.example.com",
        "type": "A",
        "content": "1.1.1.1",
        "ttl": "600",
        "prio": "0",
        "notes": ""
    }
]
}
```

## To Do

* Get list of records to process from API
* Use environment variables
