# node-rest-api


# OpenSSL
Needs a https folder in the root directory containing OpenSSL files cert.pem and key.pem.
To add these files install OpenSSL (if not already installed) and run this following command in the https directory:
> openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem