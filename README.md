[![Logo](src/images/logo-corners-h60.png)](https://kontoj.galaksio.tech)

[![Donate PayPal.Me](https://img.shields.io/badge/Donate-PayPal.Me-8bd7bc?style=for-the-badge&logo=paypal&logoColor=white&)](https://www.paypal.me/AntoineTURMEL)
[![GitHub Release](https://img.shields.io/github/v/release/galaksiotech/kontoj?style=for-the-badge&logo=github&label=last%20release&color=%23273773)](https://github.com/galaksiotech/kontoj)


A web tool to help create accounts on web services, based on a JSON file.

## Documentation Language:
- [English](README.md)
- [Français](docs/README-fr.md)

## How to use Kontoj v2.0:
### Load your services list:
- Copy [src/services.example.json](src/services.example.json) from project
- Fill your services details inside this file (you can validate your file using this schema: [src/services.schema.json](src/services.schema.json), you can also edit the file using [web json-editor](https://pmk65.github.io/jedemov2/dist/demo.html))
- In Kontoj, browse for your services.json file to load the list of services.

### Autoload a services list:
- You can autoload a services list file by putting it on the root (src) of Kontoj and specify it in the config.json file
example:
```json
"autoload": "myfile.json"
```

> [!NOTE]
> **In a future version, it will be possible to save the JSON file inside the browser.**

### Autofill
You can autofill fields using [valid CSS selectors](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#parameters), you can see an example in services.example.json file & see the list of possible fields in services.schema.json file.

> [!IMPORTANT]
> Autofill is provided by an « Userscript », you will need a browser extension like [Violentmonkey](https://violentmonkey.github.io/get-it/) or [Tampermonkey](https://www.tampermonkey.net/) to install [Kontoj Companion](/src/js/kontoj_companion.user.js).

### Generate and fill emails/passwords
- On the top bar, you can fill the Last Name/First Name, Email of the person
- You can either check manually each service, check service group or select user Group in top bar
- You can use the « Fill » ![Fill](/docs/images/magic.png) button to copy the mail address into each email fields of selected services and generate a password (based on rules defined in JSON file) for each service selected
- You can use the « Generate mail » ![Generate Mail](/docs/images/envelope-plus.png) button to generate a mail body with all credentials
- You can use the « Password » ![Password](/docs/images/key-fill.png) button to generate a password (based on rules defined in JSON file) for the selected service
- You can choose mail generation between "body" (Generally compatible with all service/software) of "html-body" (Compatible with Mozilla Thunderbird) using the « Settings » ![Settings](/docs/images/sliders.png) button.

### Login & Create Account
- You can go to the login page of the service by clicking on the service name or the service logo
- Using « Create Account » ![Create Account](/docs/images/person-fill.png) button you can go to the create account page of the service

> [!TIP]
> **If you have Kontoj Companion installed & the service have autofill fields, clicking on the « Create Account » ![Create Account](/docs/images/person-plus-fill.png) will automatically fill fields.**

### Service Status
You can specify an url for the service status page, it can be opened in an iframe if the website allows it. To access it, click on the Service Status button: ![Service Status](/docs/images/reception-4.png)


### Kontoj Companion

The current main purpose of Kontoj Companion is to help you fill credentials and create account seamlessly.

You can display more information on how to install by clicking the « Kontoj Companion » button: ![Kontoj Companion](/docs/images/robot.png)

You can configure:
- The rule for credentials stored deletion (credentials are stored in the extension eg. TamperMonkey) ;
    - ```-1``` : Credentials are deleted when you click on create account icon on Kontoj.
    - ```0``` : Credentials are never deleted.
    - ```positive value``` eg. 5 : Credentials are deleted after X minutes.

> [!NOTE]
> **By default, deletion is done after 5 minutes.**

As of v2.0, configuration is done on the extension menu, example in TamperMonkey:
![TamperMonkey Config](/src/images/tampermonkey_config.png)


### Live Demo

Load services & fill mail/password

https://github.com/user-attachments/assets/c3cd1286-d035-4188-a3ca-76588cf52765

Kontoj Companion with autofill

https://github.com/user-attachments/assets/4b715256-8fb2-4e72-9a3e-d1a974fb38a6

Generated mail
![Mail body](src/images/demo_mail_v1.png)

## Dev instructions:
- Install nodejs/npm
- npm install
- npx gulp
- npx serve src

It's possible to prefill firstname, lastname, email and group on Kontoj launch by adding this to config.json file:
```json
    "dev": {
        "autofillFirstname": "Maurice",
        "autofillLastname": "Moss",
        "autofillEmail": "maurice.moss@reynholm-industries.com",
        "autofillGroup": "it"
    }
```

## Licence

Kontoj is under [MIT Licence](/LICENSE)