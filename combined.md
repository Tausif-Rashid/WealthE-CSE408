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
        - [Create Income Slab](#create-income-slab)
        - [Update Income Slab](#create-income-slab)
        - [Delete Income Slab](#create-income-slab)
    2. [Investment Rules](#investment-rules)
        - [Get Investment Rule](#get-investment-rule)
        - [Create Investment Rule](#create-investment-rule)
        - [Update Investment Rule](#create-investment-rule)
        - [Delete Investment Rule](#create-investment-rule)
    2. [Admin Support Mailbox](#admin-support-mailbox)
    3. [Show User Profile to Admin](#show-user-profile-to-admin)
    4. [Show Transaction History to Admin](#show-transaction-history-to-admin)
    5. [Show Loan History to Admin](#show-loan-history-to-admin)
    6. [Show Products & Pricing](#show-products--pricing)
    7. [Edit Price and Tax of product](#edit-price-and-tax-of-product)
    8. [Report Generation](#report-generation)
        - [Get Division List](#get-division-list)
        - [Get Division Report and District List](#get-division-report-and-district-list)
        - [Get District Report and Upazilla List](#get-district-report-and-upazilla-list)
        - [Get Upazilla Report and Union List](#get-upazilla-report-and-union-list)
        - [Get Union Report](#get-union-report)
    9. [Change Union Agent](#change-union-agent)

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

#### Create Income Slab

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/create-income-slab]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    
>  "category": "regular",
>  "slab": {
>    "amount": 750000,
>    "rate": 20
>  }
>}

>```
>
<br>

>### Response
>
>#### Response Code: 201 (`CREATED`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Income slab created successfully."
>}

>```
>

#### Update Income Slab

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/update-income-slab]()                |   `PUT`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    
>  "category": "regular",
>  "slab": {
>    "slab_no": 5,
>    "amount": 750000,
>    "rate": 22.5
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

#### Delete Income Slab

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/delete-income-slab]()                |   `DELETE`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    
>  "category": "regular",
>  "slab": {
>    "slab_no": 5
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
>   "message": "Income slab deleted successfully."
>}

>```


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

#### Create Investment Rule

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/create-investment]()                |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "investment_name": "Mutual Funds",
>   "rate": 15    
>
>}

>```
>
<br>

>### Response
>
>#### Response Code: 201 (`CREATED`)
>
>#### Response Body
>
>```json
>{
>
>   "message": "Investment category created successfully."
>}

>```
>

#### Update Investment Rule

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/update-investment-rule]()                |   `PUT`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    
>   "id": 1003,
>   "rate": 20
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
>   "message": "Investment rule updated successfully."
>}

>```
>

#### Delete Investment Rule

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/admin/delete-investment-rule]()                |   `DELETE`     |

>### Request
>
>#### Request Body
>
>```json
>{
>   "id": 1004
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
>   "message": "Investment deleted successfully."
>}

>```

