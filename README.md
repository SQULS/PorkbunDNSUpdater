# Porkbun DNS Updater

Service that checks current external IP and updates DNS records with Porkbun accordingly.

## Setup

In order to utilise the Fetch() API that this service uses you will need Node.js 19 or higher installed on your server.

The Porkbun API documentation can be found [here](https://porkbun.com/api/json/v3/documentation).

Run ```npm install``` in order to install *dotenv*.

Copy ```.env.example``` to ```.env``` and populate with your Porkbun API key and secret key.
In the third environment variable called ```DOMAINS``` add a comma separated list of the domains you want to update.

Run ```node pbDNSUpdater.js```

You may want to use a NPM module such as *PM2* or *Forever* to run this service perpetually.

### Node Versions < 19
This is script will work with some modifications.
Install ```node-fetch``` at version 2.

```npm install node-fetch@2```

And import it into the _pbDNSUpdater.js_ by adding the following line to the top of the file:

```const fetch = require('node-fetch');```

The service will not resolve to using the library.
