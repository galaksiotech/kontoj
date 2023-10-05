# Kontoj

![Logo](src/images/logo-corners-h100.png)

[![Donate PayPal.Me](https://img.shields.io/badge/Donate-PayPal.Me-8bd7bc?style=for-the-badge&logo=paypal)](https://www.paypal.me/AntoineTURMEL)

A web tool to help create accounts on web services, based on a JSON file.

## Documentation Language:
- [English](README.md)
- [Français](docs/README-fr.md)

## How to use Kontoj v1.5:
### Load your services list:
- Copy [src/services.example.json](src/services.example.json) from project
- Fill your services details inside this file (you can validate your file using this schema: [src/services.schema.json](src/services.schema.json), you can also edit the file using [web json-editor](https://pmk65.github.io/jedemov2/dist/demo.html))
- In Kontoj, browse for your services.json file to load the list of services.

💡 **NOTE: In future version, it will be possible to save the JSON file inside the browser.**

### Autofill
Starting in v1.1, you can autofill fields using jQuery selectors, you can see an example in services.example.json file & see the list of possible fields in services.schema.json file.

Autofill is provided by an « Userscript », you will need a browser extension like [Violentmonkey](https://violentmonkey.github.io/get-it/) or [Tampermonkey](https://www.tampermonkey.net/) to install [Kontoj Companion](/src/js/kontoj_companion.user.js).

### Generate and fill emails/passwords
- On the top bar, you can fill the Last Name/First Name, Email of the person
- You can either check manually each service, check service group or select user Group in top bar
- You can use the « Fill » 🪄 button to copy the mail address into each email fields of selected services and generate a password (based on rules defined in JSON file) for each service selected
- You can use the « Generate mail » 📨 button to generate a mail body with all credentials
- You can use the « Password » 🔑 button to generate a password (based on rules defined in JSON file) for the selected service
- You can choose mail generation between "body" (Generally compatible with all service/software) of "html-body" (Compatible with Mozilla Thunderbird) using the « Settings » 🛠️ button.

### Login & Create Account
- You can go to the login page of the service by clicking on the service name or the service logo
- Using « Create Account » 👤 button you can go to the create account page of the service

💡 **NOTE: If you have Kontoj Companion installed & the service have autofill fields, clicking on the « Create Account » 👤 will automatically fill fields.**

### Live Demo

Load services & fill mail/password
![Demo](src/images/demo_v1.gif)

Generated mail
![Mail body](src/images/demo_mail_v1.png)

## Dev instructions:
- Install nodejs/npm
- npm install
- npx serve src

## Licence

Kontoj is under [MIT Licence](/LICENSE)