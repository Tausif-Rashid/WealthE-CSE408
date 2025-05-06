# <div align="center">WealthE API Documentation</div>

### <div align="center"> Group 7 (A2) </div>

<div align="center">1. 1905002 - Nafis Tahmid </div>
<div align="center">2. 1905008 - Shattik Islam Rhythm </div>
<div align="center">3. 1905026 - Wasif Hamid </div>

----------------------------------------------

## Index

1. [Register/ Login Module](#registerlogin-module)
    1. [Login](#login)
    2. [Register](#register)
        - [Get Tax Zone List](#get-tax-zone-list)
        - [Get Tax Circle List](#get-tax-circle-list)
    3. [Submit Registration Request](#submit-registration-request)
    4. [Personal Info](#personal-info)
    5. [Update Personal Info](#update-personal-info)

2. [Admin Module](#admin-module)
    1. [Income Rules](#income-rules)
        - [Get Income Slab](#get-income-slab)
        - [Edit Income Slab](#edit-income-slab)
        - [Get Categories](#get-categories)
        - [Edit Categories](#edit-categories)
    2. [Investment Rules](#investment-rules)
        - [Get Investment Rule](#get-investment-rule)
        - [Edit Investment Rule](#edit-investment-rule)
    3. [Tax Zone Rules](#tax-zone-rules)
        - [Get Tax Zone Rules](#get-tax-zone-rules)
        - [Edit Tax Zone Rules](#edit-tax-zone-rules)
    4. [Rebate Rules](#rebate-rules)
        - [Get Rebate Rules](#get-rebate-rules)
        - [Edit Rebate Rules](#edit-rebate-rules)
    4. [Admin File Section](#admin-file-section)
        - [Get Return List](#get-return-list)
        - [View Return](#view-return)
        - [Get Individual Return](#get-individual-return)
        - [Update Tax Status](#update-tax-status)


---

## Register/Login Module

### Login

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/login]()                |   `POST`     |


>### Request
>
>#### Request Body
>
>```json
>{
>
>    "id": "azmal@gmail.com",
>    "password": "abcd1234"
>}
>```
>
<br>

>### Response - Success
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>    "success": true,
>    "role": "user",
>    "token": "123abc123"
>}
>```
>
<br>

> [!NOTE]
> Subsequent requests while logged in must contain this token.
<br>

>### Response - Wrong ID or Password
>
>#### Response Code: 401 (`Unauthorized`)
>
>#### Response Body
>
>```json
>{
>    "success": false,
>    "error": "Invalid ID or password"
>}
>```
>
-------------

### Register


#### Get Tax Zone List

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/register/zones]()                |   `GET`     |

>#### Request
>
>##### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>#### Response : Success
>
>##### Response Code: 200 (`OK`)
>
>##### Response Body
>
>```json
>{
>    "taxZones": [
>                        "Tax Zone 1", 
>                        "Tax Zone 2",
>                        "Tax Zone 15"
>                   ]
>}
>```
>

#### Get Tax Circle List

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/register/circle]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "taxZone" : "Tax Zone 2"
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>    "taxCircles": [
>                        "Tax Circle 75", 
>                        "Tax Circle 76",
>                        "Tax Circle 78"
>                   ]
>}
>```
>


### Submit Registration Request

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/register/submit]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    "email": "nabila@gmail.com",
>    "name": "Nabila Tabassum",
>    "nid": 1234567890,
>    "tin": 232345456767,
>    "mobile": 0123456789,
>    "taxZone": 15,
>    "taxCircle": 78,
>    "dob": "02-02-1990",
>    "spouse": "",
>    "spouseTIN": null,
>    "isResidential": true,
>    "benefittedPerson": {
>           "isFF": false,
>           "isFemale": true,
>           "isDisabled": false               
>}
>    
>    
>    
>}
>```
>
<br>

<br>

>### Response - Success
>
>#### Response Code: 201 (`Created`)
>
>#### Response Body
>
>```json
>{
>    "success": true,
>    "token": "1234cdb32"
>}
>```
>
<br>

>### Response - Invalid Input
>
>#### Response Code: 422 (`Unprocessable Entity`)
>
>#### Response Body
>
>```json
>{
>    "success": false,
>    "error": "Invalid {field}"
>}
>```
>

<br>

### Personal Info

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/profile]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   
>    
>}
>```
>
<br>

<br>

>### Response - Success
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>    "email": "nabila@gmail.com",
>    "name": "Nabila Tabassum",
>    "nid": 1234567890,
>    "tin": 232345456767,
>    "mobile": 0123456789,
>    "taxZone": 15,
>    "taxCircle": 78,
>    "dob": "02-02-1990",
>    "spouse": "",
>    "spouseTIN": null,
>    "isResidential": true,
>    "benefittedPerson": {
>           "isFF": false,
>           "isFemale": true,
>           "isDisabled": false               
>}
>    
>    
>    
>}
>````
>
<br>

### Update Personal Info

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/update-profile]()                |   `PUT`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "taxCircle": 76,
>   "benefittedPerson": {
>       "isFF": true    
>} 
>    
>}
>```
>
<br>

<br>

>### Response - Success
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>    
>}
>````
>
<br>




## Admin Module


### Income Rules

#### Get Income Slab

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-income-slab]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>    "categories": {
>        "regular": [
>            { "slab_no": 1, "amount": 350000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ],
>        "elderly": [
>            { "slab_no": 1, "amount": 400000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ],
>        "disabled": [
>            { "slab_no": 1, "amount": 500000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },        
>       ],
>        "ff": [
>            { "slab_no": 1, "amount": 450000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ]
>  }
>}

>```
>

#### Edit Income Slab

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/edit-income-slab]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    "categories": {
>        "regular": [
>            { "slab_no": 1, "amount": 350000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ],
>        "elderly": [
>            { "slab_no": 1, "amount": 400000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ],
>        "disabled": [
>            { "slab_no": 1, "amount": 500000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },        
>       ],
>        "ff": [
>            { "slab_no": 1, "amount": 450000, "rate": 0 },
>            { "slab_no": 2, "amount": 100000, "rate": 5 },
>            { "slab_no": 3, "amount": 250000, "rate": 10 },
>            { "slab_no": 4, "amount": 500000, "rate": 15 },
>        ]
>  }
>}

>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Income slab updated successfully."
>}

>```
>

#### Get Categories

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-categories]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}

>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "categories" : ["regular",
>                   "disabled",
>                   "ff",
>                    "elderly"]
>}

>```
>


#### Edit Categories

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/edit-categories]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>   "categories" : ["regular",
>                   "disabled",
>                   "ff",
>                   "elderly",
>                   "female"]
>}
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Category updated successfully."
>}

>```
>





### Investment Rules

#### Get Investment Rule

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-investment-rule]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>  "investment_options": [
>    {
>      "id": 1001,
>      "investment_name": "5 year Bangladesh Sanchaypatra",
>      "rate": 15
>    },
>    {
>      "id": 1002,
>      "investment_name": "6 month Bangladesh Sanchaypatra",
>      "rate": 12
>    },
>    {
>      "id": 1003,
>      "investment_name": "Donation to Zakat Fund",
>      "rate": 15
>    }
>  ]
>}


>```
>

#### Edit Investment Rule

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/edit-investment]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>  "investment_options": [
>    {
>      "id": 1001,
>      "investment_name": "5 year Bangladesh Sanchaypatra",
>      "rate": 12.5
>    },
>    {
>      "id": 1002,
>      "investment_name": "6 month Bangladesh Sanchaypatra",
>      "rate": 12
>    },
>    {
>      "id": 1003,
>      "investment_name": "Donation to Zakat Fund",
>      "rate": 15
>    },
>    {
>      "id": null,
>      "investment_name": "Mutual Funds",
>      "rate": 15
>    }
>  ]
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Investment category updated successfully."
>}

>```
>

### Tax Zone Rules

#### Get Tax Zone Rules

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-taxzone-rule]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>  "specialZones": [
>    {
>      "id": 1001,
>      "Zone Name": "Dhaka North City Corporation",
>      "taxZone": [1,2],
>      "minimumTax": 5000
>    },
>    {
>      "id": 1002,
>      "Zone Name": "Dhaka South City Corporation",
>      "taxZone": [15,16],
>      "minimumTax": 5000
>    },
>    {
>      "id": 1003,
>      "Zone Name": "Gazipur City Corporation",
>      "taxZone": [27],
>      "minimumTax": 4000
>    },
>  ]
>}


>```
>

#### Edit Tax Zone Rules

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/edit-taxzone-rule]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>  "specialZones": [
>    {
>      "id": 1001,
>      "Zone Name": "Dhaka North City Corporation",
>      "taxZone": [1,2,4],
>      "minimumTax": 5000
>    },
>    {
>      "id": 1002,
>      "Zone Name": "Dhaka South City Corporation",
>      "taxZone": [15,16],
>      "minimumTax": 5000
>    },
>    {
>      "id": 1003,
>      "Zone Name": "Gazipur City Corporation",
>      "taxZone": [27],
>      "minimumTax": 4500
>    },
>    {
>      "id": null,
>      "Zone Name": "Sylhet City Corporation",
>      "taxZone": [35],
>      "minimumTax": 4000
>    }
>  ]
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Tax Zone Rule updated successfully."
>}

>```
>

### Rebate Rules

#### Get Rebate Rules

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-rebate-rule]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>   "maximumRebate": 1000000,
>   "defaultRate": 15,
>   "maximum_of_income": 3
>
>}


>```
>

#### Edit Rebate Rules

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/edit-rebate-rule]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "maximumRebate": 1000000,
>   "defaultRate": 12.5,
>   "maximum_of_income": 5
>
>}


>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Tax Rebate Rule updated successfully."
>}

>```
>


### Admin File Section

#### Get Return List

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-return-list]()                |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>{
>
>}
>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>  "tax_returns": [
>    {
>      "id": 443223455,
>      "TIN": 123456789,
>      "tax_amount": 15000,
>      "date": "2024-06-30",
>      "return_pdf_url": "https://example.com/returns/123456789_2024.pdf"
>    },
>    {
>      "id": 441232455,
>      "TIN": 987654321,
>      "tax_amount": 22000,
>      "date": "2024-09-15",
>      "return_pdf_url": "https://example.com/returns/987654321_2024.pdf"
>    },
>    {
>      "id": 123323121,
>      "TIN": 456789123,
>      "tax_amount": 18500,
>      "date": "2025-03-20",
>      "return_pdf_url": "https://example.com/returns/456789123_2025.pdf"
>    }
>  ]
>}



>```
>

#### View Return

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/view-return]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "id": 443223455
>
>}


>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>      "id": 443223455,
>      "TIN": 123456789,
>      "tax_amount": 15000,
>      "date": "2024-06-30",
>      "return_pdf_url": "https://example.com/returns/123456789_2024.pdf"
>}
>```
>

#### Get Individual Return

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/get-return]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "TIN" : 123456568
>
>}


>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>  "tax_returns": [
>    {
>      "id": 443223455,
>      "TIN" : 123456568,
>      "tax_amount": 15000,
>      "date": "2024-06-30",
>      "return_pdf_url": "https://example.com/returns/123456789_2024.pdf"
>    },
>    {
>      "id": 441232455,
>      "TIN" : 123456568,
>      "tax_amount": 12000,
>      "date": "2023-09-15",
>      "return_pdf_url": "https://example.com/returns/987654321_2023.pdf"
>    },
>    {
>      "id": 123323121,
>      "TIN" : 123456568,
>      "tax_amount": 8500,
>      "date": "2022-08-20",
>      "return_pdf_url": "https://example.com/returns/456789123_2022.pdf"
>    }
>  ]
>}
>
>

#### Update Tax Status

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/update-tax-status]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "id": 123323121,
>   "isApproved": false,
>   "complaint": "Asset is not compatible with previous years data."
>
>}


>```
>
<br>

>### Response
>
>#### Response Code: 200 (`OK`)
>
>#### Response Body
>
>```json
>{
>   "message": "feedback sent successfully"
>}
>
>


