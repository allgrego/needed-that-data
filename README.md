
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

Create a `.env` file by copying the info from `.env.example`.

```bash
# Windows
copy .env.example .env

# Linux
cp .env.example .env
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

### **Monitor Dolar USD lastest rate in VES**

Get current rates of USD in VES from Monitor Dolar Vzla webpage.

`usd` the VES/USD rate. Equivalent to USD 1
`monitorDate` refers to the date of update provided by Monitor Dolar
`currentTimestamp` refers to the time when the request is responded

```http
GET /v1/monitor-dolar/rates/last
```

- Response

```json
{
  "currency": "VES",
  "usd": 9.04,
  "monitorDate": "2022-10-21T13:00:00.000Z",
  "currentTimestamp": "2022-10-22T08:15:45.375Z"
}
```

- Error Response

```json
{
  "error": {
    "code": "internal",
    "message": "There was an error fetching the data from Monitor Dolar"
  }
}
```

### **USD rate history in VES from Monitor Dolar**

Get the last 10 rates of USD in VES from Monitor Dolar Vzla webpage from newest to oldest.

`usd` the VES/USD rate. Equivalent to USD 1
`date` refers to the date of update provided by Monitor Dolar
`currentTimestamp` refers to the time when the request is responded

```http
GET /v1/monitor-dolar/rates
```

- Response

```json
{
  "currency": "VES",
  "rates": [
    {
      "usd": 9.19,
      "date": "2022-10-28T13:00:00.000Z"
    },
    {
      "usd": 9.2,
      "date": "2022-10-27T17:00:00.000Z"
    },
    {
      "usd": 9.2,
      "date": "2022-10-27T13:00:00.000Z"
    },
    {
      "usd": 9.23,
      "date": "2022-10-26T17:00:00.000Z"
    },
    {
      "usd": 9.24,
      "date": "2022-10-26T13:00:00.000Z"
    },
    {
      "usd": 9.21,
      "date": "2022-10-25T17:00:00.000Z"
    },
    {
      "usd": 9.19,
      "date": "2022-10-25T13:00:00.000Z"
    },
    {
      "usd": 9.17,
      "date": "2022-10-24T17:00:00.000Z"
    },
    {
      "usd": 9.11,
      "date": "2022-10-24T13:00:00.000Z"
    },
    {
      "usd": 9.04,
      "date": "2022-10-21T17:00:00.000Z"
    }
  ],
  "currentTimestamp": "2022-10-28T16:42:23.434Z"
}
```

- Error Response

```json
{
  "error": {
    "code": "internal",
    "message": "There was an error fetching the data from Monitor Dolar"
  }
}
```

<!-- api-end -->
  

## Deployment

The app is deployed on [Needed That Data](https://needed-that-data.herokuapp.com/). Give it a try!

If an API Key is required send me an email at `allgrego14@gmail.com` and I will share it with you
