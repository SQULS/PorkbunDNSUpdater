# Porkbun DNS Updater

Service that checks current external IP and updates DNS records with Porkbun accordingly.

## Setup

In order to utilise the Fetch() API that this service uses you will need Node.js 19 or higher installed on your server.

The Porkbun API documentation can be found [here](https://porkbun.com/api/json/v3/documentation).

Run ```npm install``` in order to install *dotenv*.

Copy ```.env.example``` to ```.env``` and populate with your Porkbun API key and secret key.
In the third environment variable called ```DOMAIN``` add a comma separated list of the domains you want to update.
