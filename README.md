
# Needed That Data API

API services to get venezuelan data that I needed (or not) from official providers. For example, USD rates from BCV or person information based on their ID ("cedula") from CNE.

Made with Express.js and typescript

## Getting Started

First, install all the dependencies:

```bash
npm install

# or

yarn
```

Then build the JS files and run the server by doing

```bash
npm run build
npm run start

# or

yarn build
yarn start
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

### Watch mode for development
You can also use the watch mode by running:

```bash
npm run dev

# or

yarn dev
```

  

This will build the JS files, start the TS watch compilation mode and then run the server.

  

Any change in a TS file will be automatically build into JS files

 
 ## API Reference

<!-- api-start -->
### **Person Information by their CID number**

Get a person's name, state, municipality and parish where they vote based on their CID ("Cédula de identidad") according the information on voter registration (CNE "Registro Electoral").

The person's RIF is also provided. Although, it is calculated.

| Parameter | Type     | Description               | Example               |
| --------- | -------- | ------------------------- | ------------------------- |
| `nat`       | `string` | **Required** nationality type | `V` or `E`
| `num`       | `string` | **Required** ID number | `25123456`


```http
GET /v1/cne/search/cid?nat=V&num=12123123
```

- Response

```json
{
  "name": "DEYANIRA DEL CARMEN GUANARE",
  "state": "EDO. ARAGUA",
  "municipality": "MP. JOSE R REVENGA",
  "parish": "CM. EL CONSEJO",
  "rif": "V12123123-5"
}
```
- Error Responses

```json
{
  "error": {
    "code": "not-found",
    "message": "No data record was found for provided parameters"
  }
}
```

```json
{
  "error": {
    "code": "invalid-argument",
    "message": "'num' argument (cedula number) is missing or invalid (must be in numeric format '1234567')"
  }
}
```
---
### **Current BCV rates in VES**

Get current rates of USD and EUR in VES from BCV webpage.

`bcvDate` refers to the date of last update provided by BCV
`currentTimestamp` refers to the time when the request is responded

```http
GET /v1/bcv/rates
```

- Response

```json
{
  "currency": "VES",
  "rates": {
    "usd": 8.2113,
    "eur": 7.96643903
  },
  "bcvDate": "2022-10-11",
  "currentTimestamp": "2022-10-11T02:08:39.569Z"
}
```

- Error Response

```json
{
  "error": {
    "code": "internal",
    "message": "There was an error fetching the data from BCV"
  }
}
```


<!-- api-end -->
  

## Demo

To be deployed soon...