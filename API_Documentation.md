# <div align="center">WealthE API Documentation</div>

### <div align="center"> Group 7 (A2) </div>

<div align="center"> 2005050 - Nabila Tabassum </div>
<div align="center"> 2005052 - Tausif Rashid </div>
<div align="center"> 2005056 - Azmal Karim </div>

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
2. [User Module](#user-module) 
    1. [Income Module](#income-module)
        1. [Employment Income](#employment-income)
        2. [Other Income](#other-income)
        3. [Get Income Summary](#get-income-summary)
    2. [Expense Module](#expense-module)
    3. [Asset & Liability Module](#asset--liability-module)
        1. [Asset Module](#asset-module)
        2. [Liability Module](#liability-module)
    4. [Invesment](#investment)
            - [Previous Invesment List](#investment-list)
            - [Edit Investment](#edit-investment)
            - [Delete Investment](#delete-investment)
            - [Liquidate Investment](#liquidate-investment)
            - [Add Investment](#add-investment)
                - [Add Particular Investment](#add-selected-investment)
    5. [Tax Estimation](#tax-estimation)
    6. [Tax Rebate Plan](#tax-rebate-plans)
        - [Select Option for Rebate Plan](#select-options-from-rebate-plan)
    7. [Tax Return](#tax-return)
        - [Tax Return Page-1](#tax-return-page-1)
            - [Edit Particular Income](#edit-particular-income-amount)
        - [Tax Return Page-2](#tax-return-page-2)
        - [Payment](#payment)
            - [Get Access Token](#get-bkash-access-token)
            - [Initiate Payment](#initiate-bkash-payment)
            - [Execute Payment](#execute-bkash-payment)
            - [Query Payment](#query-bkash-payment)
        - [Return Form](#return-form)
        - [Submit Return Form](#submit-tax-return-form)
    8. [History](#history)
        - [Download Previous Return](#download-previous-tax-return-from-history)
3. [Admin Module](#admin-module)
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
    5. [Admin File Section](#admin-file-section)
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
---

## User Module

### Income Module
---
### Employment Income

### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/employment/]()    |   `GET`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>  
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>   "employment_income_list": [
>           {
>               "id": "EI001",
>               "title": "Basic Salary",
>               "amount": 10000,
>               "date": "2023-01-01",
>           },
>           {
>               "id": "EI002",
>               "title": "Travel Allowance",
>               "amount": 10000,
>               "date": "2023-01-01",
>           },
>           {
>               "id": "EI003",
>               "title": "House Rent Allowance",
>               "amount": 10000,
>               "date": "2023-01-01",
>           }
>       ], 
> }
> ```

---

### Add Employment

| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/employment/add]() |   `POST`    |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "type" : "basic salary",
>   "amount" : 10000,
>   "exempted" : 2000,
>   "date" : "2023-01-01",
>   "recurrence" : "monthly",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
>       
> }
> ```

---

### Update Employment

| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/employment/edit]() |   `POST`    |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id" : "EI001",
>   "type" : "basic salary",
>   "amount" : 10000,
>   "exempted" : 2000,
>   "date" : "2023-01-01",
>   "recurrence" : "monthly",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
>       
> }
> ```

---
### Delete Employment

| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/employment/delete]() |   `POST`    |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id" : "EI001",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
>       
> }
> ```

---
### Other Income
---
### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/other/]()    |   `GET`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>   "other_income_list": [
>           {
>               "type": "Other",
>               "title": "Freelancing",
>               "amount": 10000,
>               "Profit": ,
>               "date": "2025-01-01",
>           },
>           {
>               "type": "Rent",
>               "title": "House Rent",
>               "amount": 15000,
>               "Profit": ,
>               "date": "2025-01-01",
>           },
>           {
>               "type": "Agriculture",
>               "title": "Jute",
>               "amount": 20000,
>               "Profit": 5000,
>               "date": "2025-06-01",
>           },
>       ],
> }
> ```
---
### Add Other Income
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/other/add]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "type" : "Agriculture",
>   "title" : "Jute",
>   "amount" : 10000,
>   "profit" : 2000,
>   "date" : "2024-08-01",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Update Other Income
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/other/edit]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id" : "OI001",
>   "type" : "Agriculture",
>   "title" : "Jute",
>   "amount" : 12000,
>   "profit" : 3000,
>   "date" : "2024-08-01",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Delete Other Income
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/other/delete]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id" : "OI001",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Get Income Summary
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/income/summary]()    |   `GET`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
>    {
>    "total_income": 85200.50,
>    "monthly_income": {
>        "2025-01": 7200.00,
>        "2025-02": 6800.00,
>        "2025-03": 7900.00,
>        "2025-04": 7800.00
>    },
>    "income_by_type": {
>        "employment": 60000.00,
>        "freelancing": 12000.50,
>        "rental": 10000.00,
>        "agriculture": 3200.00
>    },
>    "chart_data": [
>        {
>        "month": "2025-01",
>        "employment": 5000.00,
>        "freelancing": 1200.00,
>        "rental": 800.00,
>        "agriculture": 200.00
>        },
>        {
>        "month": "2025-02",
>        "employment": 5000.00,
>        "freelancing": 1000.00,
>        "rental": 600.00,
>        "agriculture": 200.00
>        },
>        {
>        "month": "2025-03",
>        "employment": 5100.00,
>        "freelancing": 1600.00,
>        "rental": 1000.00,
>        "agriculture": 200.00
>        },
>        {
>        "month": "2025-04",
>        "employment": 5000.00,
>        "freelancing": 1800.50,
>        "rental": 800.00,
>        "agriculture": 200.00
>        }
>    ],
>    "last_updated": "2025-05-05T14:30:00Z"
>    }
> ```
---

## Expense Module
---
### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/expense/]()    |   `GET`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>   "expense_list": [
>           {
>               "type": "Utility",
>               "title": "Electricity Bill",
>               "description": "march bill",
>               "amount": 1000,
>               "date": "2025-04-01",
>           },
>           {
>               "type": "Rent",
>               "title": "House Rent",
>               "amount": 25000,
>               "description": "January Rent",
>               "date": "2025-01-01",
>           },
>           {
>               "type": "Transport",
>               "title": "Bus Fare",
>               "amount": 2000,
>               "description": "Bus fare for 2 months",
>               "date": "2025-06-01",
>           },
>       ],
>   "categories": [
>       "utilities",
>       "transportation",
>       "education",
>       "tds",
>       "rent",
>       "healthcare",
>       "entertainment",
>       "other"
>     ]
> }
> ```
---
### Add Expense
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/expense/add]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "type": "Transport",
>   "title": "Bus Fare",
>   "amount": 2000,
>   "description": "Bus fare for 2 months",
>   "date": "2025-06-01",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Edit Expense
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/expense/edit]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "EX001",
>   "type": "Transport",
>   "title": "Bus Fare",
>   "amount": 2000,
>   "description": "Bus fare for 2 months",
>   "date": "2025-06-01",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Delete Expense
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/expense/delete]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "EX001",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Get Expense Summary
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/expense/summary]()    |   `GET`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
>   {
>     "total_expense": 43250.75,
>     "monthly_expense": {
>       "2025-01": 10200.00,
>       "2025-02": 9800.00,
>       "2025-03": 11500.75,
>       "2025-04": 11750.00
>     },
>     "expense_by_type": {
>       "utilities": 4200.00,
>       "transportation": 3800.50,
>       "education": 9000.00,
>       "tds": 3000.25,
>       "rent": 16000.00,
>       "groceries": 4500.00,
>       "other": 1750.00
>     },
>     "chart_data": [
>       {
>         "month": "2025-01",
>         "utilities": 1000.00,
>         "transportation": 900.00,
>         "education": 2000.00,
>         "tds": 800.00,
>         "rent": 4000.00,
>         "groceries": 1000.00,
>         "other": 500.00
>       },
>       {
>         "month": "2025-02",
>         "utilities": 1200.00,
>         "transportation": 1000.00,
>         "education": 1800.00,
>         "tds": 700.25,
>         "rent": 4000.00,
>         "groceries": 800.00,
>         "other": 300.00
>       },
>       {
>         "month": "2025-03",
>         "utilities": 1000.00,
>         "transportation": 1000.50,
>         "education": 2500.00,
>         "tds": 900.00,
>         "rent": 4000.00,
>         "groceries": 700.00,
>         "other": 1400.25
>       },
>       {
>         "month": "2025-04",
>         "utilities": 1000.00,
>         "transportation": 900.00,
>         "education": 2700.00,
>         "tds": 600.00,
>         "rent": 4000.00,
>         "groceries": 2000.00,
>         "other": 550.00
>       }
>     ],
>     "last_updated": "2025-05-05T14:30:00Z"
>   }
> ```
---

## Asset & Liability Module

### Asset Module
---

### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/asset/]()    |   `GET`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>    
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>   "asset_list": [
>           {   "id": "AS001",
>               "type": "Non-agricultural-property",
>               "title": "residential plot",
>               "cost": 200000,
>               "description": "residential plot ",
>               "date": "2001-06-01",
>               "acquisition": "inheritance",
>               "location": {
>                   "road": "123 Main St, Mirpur",
>                   "city": "Dhaka",
>                   "zip": "1212"
>               },
>               "reg_numer": "",
>               "engine": ,
>               "interest": "",
>               "weight": ,
>           },
>           {   "id": "AS002",
>               "type": "Agricultural-property",
>               "title": "jute field",
>               "cost": 200000,
>               "description": "jute field in village", 
>               "date": "2001-06-01",
>               "acquisition": "purchase",
>               "location": {
>                   "road": "Haripur, Bogura",
>                   "city": "Bogura",
>                   "zip": "1812"
>               },
>               "reg_numer": "",
>               "engine": ,
>               "interest": "",
>               "weight": ,
>           },
>           {   "id": "AS003",
>               "type": "vehicle",
>               "title": "toyota corolla",
>               "cost": 100000,
>               "description": "Model 2017, 4 door sedan, color: black", 
>               "date": "2018-06-01",
>               "acquisition": "purchase",
>               "location": {
>                   "road": "",
>                   "city": "",
>                   "zip": ""
>               },
>               "reg_numer": "DHA Ka 1234",
>               "engine": 1500,
>               "interest": "",
>               "weight": 1200,
>           },
>   ],
>   "categories": [
>       "Non-agricultural-property",
>       "Agricultural-property",
>       "vehicle",
>       "jewelry",
>       "sanchaypatra",
>     ]
> }
> ```
---

### Add Asset
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/asset/add]()    |   `POST`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   "type": "Non-agricultural-property",
>   "title": "residential plot",
>   "cost": 200000,
>   "description": "residential plot ",
>   "date": "2001-06-01",
>   "acquisition": "inheritance",
>   "location": {
>       "road": "123 Main St, Mirpur",
>       "city": "Dhaka",
>       "zip": "1212"
>   },
>   "reg_numer": "",
>   "engine": ,
>   "interest": "",
>   "weight": ,
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Edit Asset
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/asset/edit]()    |   `POST`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "AS001",
>   "type": "Agricultural-property",
>   "title": "jute field",
>   "cost": 200000,
>   "description": "jute field in village", 
>   "date": "2001-06-01",
>   "acquisition": "purchase",
>   "location": {
>       "road": "Haripur, Bogura",
>       "city": "Bogura",
>       "zip": "1812"
>   },
>   "reg_numer": "",
>   "engine": ,
>   "interest": "",
>   "weight": ,
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Delete Asset
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/asset/delete]()    |   `POST`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "AS001",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Sell Asset
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/asset/sell]()    |   `POST`     |
> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "AS001",
>   "amount": 200000,
>   "date": "2025-01-01",
>   "description": "sold for profit",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---

### Liability Module
---
### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/liability/]()    |   `GET`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>   "liability_list": [
>           {
>               "id": "LI001",
>               "type": "Loan",
>               "title": "Brac Bank",
>               "amount": 50000,
>               "description": "Loan for laptop purchase",
>               "date": "2022-06-01",
>               "interest": 0.05,
>           },
>           {
>               "id": "LI002",
>               "type": "Loan",
>               "title": "Sonali Bank",
>               "amount": 500000,
>               "description": "Loan for house purchase",
>               "date": "2023-06-01",
>               "interest": 0.05,
>           },
>   ],
> }
> ```
---



### Add Liability
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/liability/add]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "type": "Loan",
>   "title": "Brac Bank",
>   "amount": 50000,
>   "description": "Loan for laptop purchase",
>   "date": "2001-06-01",
>   "interest": 0.05,
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---

### Edit Liability
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/liability/edit]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "LI001",
>   "type": "Loan",
>   "title": "Brac Bank",
>   "amount": 50000,
>   "description": "Loan for laptop purchase",
>   "date": "2001-06-01",
>   "interest": 0.05,
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---

### Delete Liability
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/liability/delete]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "LI001",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---

### Credit Liability
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/liability/credit]()    |   `POST`     |

> ### Request
>
> #### Request Body
>
> ```json
> {
>   "id": "LI001",
>   "amount": 5000,
>   "date": "2025-01-01",
>   "description": "Loan payment",
> }
> ```

</br>

> ### Response - Success
>
> #### Response Code : 200 (`OK`)
>
> #### Response Body
>
> ```json
> {
>
> }
> ```
---
### Investment

### Investment List

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>    }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>
>    ```json
>   {
>       "Investments": [
>           {
>               "iid": 123456789,    
>               "date": "2022-10-31T11:00:00Z",
>               "Objects": [
>                   {
>                       "name": "Family Shanchaypatra",
>                       "amount": 50000,
>                       "duration": "5 years"
>                   }
>               ]
>           },
>           {
>               "iid": 123456789,
>               "date": "2022-10-31T11:00:00Z",
>               "Objects": [
>                   {
>                       "name": "Fixed deposite",
>                       "amount": 50000,
>                       "duration": "2 years"                
>                   }
>               ]
>           },
>           {
>               "iid": 123456789,
>               "date": "2022-10-31T11:00:00Z",
>               "Objects": [
>                   {
>                       "name": "Contribution to Zakat Fund",
>                       "amount": 10000,
>                       "duration": ""                
>                   }
>               ]
>           }
>       ]
>   }
>    ```
>

---

### Edit Investment

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment/edit/123456789]() |   `PATCH`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    "Edit Investments": 
>           {
>               "Objects": [
>                   {
>                       "amount": 50000
>                   }
>               ]
>           },
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
>    "message": "Investment updated successfully",
>    "iid": 123456789
>}
>```
>
<br>
-----------------

### Delete Investment

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment/edit/123456789]() |   `DELETE`     |

>### Request
>
>#### Request Body
>
>```json
>{
>    "Delete Investments": 
>           {
>               "Objects": [
>                   {
>                       "name": "Contribution to Zakat Fund",
>                       "amount": 10000,
>                       "duration": ""         
>                   }
>               ]
>           },
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
>    "message": "Investment deleted successfully",
>    "iid": 123456789
>}
>```
>
<br>
-----------------

### Liquidate Investment

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment/edit/123456789]() |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>   {
>       "bank_account_id": 987654321
>    
>   }
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
>    "message": "Investment liquidated successfully",
>    "iid": 123456789,
>    "transferred_amount": 50000,
>    "account_balance": 150000
>}
>```
>
<br>

> [!NOTE]
> The investment must be in a liquidable state (e.g., not locked or matured).
<br>

>### Response - Invalid Liquidation
>
>#### Response Code: 422 (`Business rule prevents action`)
>
>```json
>{
>    "success": false,
>    "error": "Liquidation not allowed for this investment",
>    "iid": 123456789
>}
>```
>
<br>
-----------------

>### Add Investment

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment/add]() |   `GET`     |

>### Request
>
>#### Request Body
>
>```json
>   {
>         
>   }
>```
>
<br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>
>    ```json
>   {
>       "Select Investment Type": [
>           {
>               "type": "5 Years Shanchaypatra"    
>           },
>           {
>               "type": "3 Months Shanchaypatra"    
>           },
>           {
>               "type": "Contribution to Zakat fund"    
>           },
>           {
>               "type": "Fixed Deposite"    
>           }
>       ]
>   }
>    ```
>

---

>### Add Selected Investment

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/investment/add/contribution_to_zakat_fund]() |   `POST`     |

>### Request
>
>#### Request Body
>
>   ```json
>   {  
>       "iid": 123456789,
>       "date": "2022-10-31T11:00:00Z",
>       "Object": [
>           {  
>               "amount": 5000, 
>               "duration": ""
>           }
>       ]
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
>    "message": "Investment added successfully",
>    "iid": 123456789,
>    "type": "Contribution to Zakat Fund"
>}
>```
>
<br>

>### Response - Bad Request
>
>#### Response Code: 400 (`Bad Request`)
>
>```json
>{
>    "success": false,
>    "error": "Missing some field"
>}
>```
>
<br>

--------------
### Tax Estimation

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_estimation]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>


>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>
>    ```json
>   {
>       "Estimated Tax (With necessary Calculation)": [
>           {
>                 "total_income": 1000000,
>                 "total_taxable_income": 600000,
>                 "total_investments": 500000,
>                 "tax_rebate_on_investments": 30000,
>                 "net_income_tax": 12000,
>                 "currency": "BDT"
>           }
>       ]
>   }
>    ```
>
<br>

>### Response - Bad Request
>
>#### Response Code: 400 (`Bad Request`)
>
>```json
>   {
>        "success": false,
>        "error": "Missing or invalid income or investment values"
>   }
>```
>
<br>
---------------

### Tax Rebate Plans

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_rebate_plan]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>
>    ```json
>   {
>       "Tax Rebate": [
>           { 
>               "Objects": [
>                   {
>                       "name": "Shanchaypatra",
>                       "amount": ,
>                       "interest": "7.5%"
>                   }
>               ],
>               "Rebate Maximum":
>           },
>           {
>               "Objects": [
>                   {
>                       "name": "Zakat Fund",
>                       "amount": ,
>                       "interest": "0%"                
>                   }
>               ],
>               "Rebate Maximum":
>           },
>           {
>               "Objects": [
>                   {
>                       "name": "Fixed Deposite",
>                       "amount": ,
>                       "interest": "5%"                
>                   }
>               ],
>               "Rebate Maximum":
>           }
>       ]
>   }
>    ```
>
<br>

### Select Options from Rebate Plan

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_rebate_plan/select_plan]() |   `POST`     |

>### Request
>
>#### Request Body
>
>   ```json
>   {  
>       "Tax Rebate Selection": [
>           { 
>               "Objects": [
>                   {
>                       "name": "Shanchaypatra",
>                       "amount": 500000,
>                       "interest": "7.5%"
>                   }
>               ],
>               "Objects": [
>                   {
>                       "name": "Zakat Fund",
>                       "amount": 20000,
>                       "interest": "0%"
>                   }
>               ],
>           }
>       ]
>}
>```
>
<br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>    ```json
>   {
>       "success": true,
>       "message": "Tax Rebate amount calculated successfully",
>       "Selected Tax Rebate": [
>           { 
>               "Objects": [
>                   {
>                       "name": "Shanchaypatra",
>                       "amount": 500000,
>                       "interest": "7.5%"
>                   }
>               ],
>               "Rebate Maximum": 75000
>           },
>           {
>               "Objects": [
>                   {
>                       "name": "Zakat Fund",
>                       "amount": 20000,
>                       "interest": "0%"                
>                   }
>               ],
>               "Rebate Maximum": 7500
>           }
>       ],
>       "Total Invested Amount": 520000,
>       "Maximum Tax Rebate": 82500
>}
>```
>
<br>
-----------------------------------------

### Tax Return

### Tax Return Page-1

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_return/tax_return_page1]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>#### Response Body
>    ```json
>   {
>       "Particulars of Total Income": [
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Employment",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Financial Asset",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Agriculture",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Rent",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Business",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Capital Gain",
>                       "amount": 500000
>                   }
>               ]
>           },
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Other Sources",
>                       "amount": 500000
>                   }
>               ]
>           }
>       ],
>       "Total Income": 1000000,
>       "Total Exempted Income": 400000
>}
>```
>
<br>

>### Edit Particular Income Amount

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_return/tax_return_page1/edit_income]() |   `POST`     |

>### Request
>
>#### Request Body
>
>   ```json
>   {  
>       "Edit Employment Income": [
>           { 
>               "Objects": [
>                   {
>                       "type": "Income from Employment",
>                       "amount": 500000
>                   }
>               ]
>           }
>       ]
>}
>```
>
<br>


>### Response 
>
>#### Response Code: 200 (`Okay`)

>#### Response Body
>
>```json
>   {
>        "success": true,
>        "message": "Income from employment amount changed successfully"
>   }
>```
>
<br>

>### Response - Bad Request
>
>#### Response Code: 400 (`Bad Request`)

>#### Response Body
>
>```json
>   {
>        "success": false,
>        "error": "Invalid amount for Income From employment"
>   }
>```
>
<br>

> ### Tax Return Page-2

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_return/tax_return_page2]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>    ```json
>   {
>       "Tax Details": [
>           { 
>               "Name": "Gross Tax Before Tax Rebate",    
>               "Computational details": [
>                   {
>                       "name": "Tax on regular income",
>                       "amount": 148900
>                   },
>                   {
>                       "name": "Tax on income u/s 163",
>                       "amount": 5000
>                   }
>               ],
>               "Total Amount": 153900
>           },
>           { 
>               "Name": "Tax Rebate",    
>               "Computational details": [
>                   {
>                       "name": "On Investment",
>                       "amount": 44835
>                   },
>                   {
>                       "name": "Other Rebate",
>                       "amount": 0
>                   }
>               ],
>               "Total Amount": 44835
>           },
>           { 
>               "Name": "Net Tax after tax Rebate",    
>               "Total Amount": 109065
>           },
>           { 
>               "Name": "Minimum Tax",    
>               "Computational details": [
>                   {
>                       "name": "TDS related to 163",
>                       "amount": 0
>                   },
>                   {
>                       "name": "For Location on Income",
>                       "amount": 5000
>                   }
>               ],
>               "Total Amount": 5000
>           },
>           { 
>               "Name": "Surcharge",    
>               "Computational details": [
>                   {
>                       "name": "Net Wealth Surcharge",
>                       "amount": 0
>                   }
>               ],
>               "Total Amount": 0
>           }
>       ],
>       "Total Payable Amount": 109065
>}
>```
>
<br>

--------------------------------------------

> ### Payment
>
> ### Get bKash Access Token

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/user/payment/bkash/token]()  |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>   {
>       "app_key": "your_app_key",
>       "app_secret": "your_app_secret"
>   }
>```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/json
>
>#### Response Body
>```json
>   {
>       "id_token": "eyJhbGciOiJIUzI1NiIsInR...",
>       "token_type": "Bearer",
>       "expires_in": "3600"
>   }
>```
>


> [!NOTE]
> Use `id_token` from the response in the **Authorization header** for all future bKash API calls:
>
<br>

> ### Initiate bKash Payment

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/user/payment/bkash/initiate]() |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>  "amount": "500.00",
>  "currency": "BDT",
>  "intent": "sale",
>  "payerReference": "USER123",
>  "merchantInvoiceNumber": "INV0001"
>}
>```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/json
>
>#### Response Body
>```json
>{
>  "paymentID": "TRX123456789",
>  "bkashURL": "https://bkash.com/payment/redirect/abc123",
>  "status": "Initiated"
>}
>```
>
<br>

---

> ### Execute bKash Payment

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/user/payment/bkash/execute]() |   `POST`     |

>### Request
>
>#### Request Body
>
>```json
>{
>  "paymentID": "TRX123456789"
>}
>```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/json
>
>#### Response Body
>```json
>{
>  "transactionStatus": "Completed",
>  "trxID": "B123XYZ456",
>  "amount": "500.00",
>  "paymentTime": "2025-05-06T12:34:56+06:00"
>}
>```
>
<br>

---

> ### Query bKash Payment

| API Endpoint              | HTTP Method |
| ------------------------- | :---------: |
| [/payment/bkash/query]() |   `GET`     |

>### Request
>
>#### Query Parameters
>
>`paymentID=TRX123456789`
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/json
>
>#### Response Body
>```json
>{
>  "transactionStatus": "Completed",
>  "trxID": "B123XYZ456",
>  "amount": "500.00",
>  "payerReference": "USER123"
>}
>```
>
<br>


------------------------------------------------

> ### Return Form

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_return/tax_return_form]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/pdf
>
>#### Content-Disposition: attachment; filename="tax_return_form.pdf"
>
>#### Response Body
>    ```json
>   {
>       
>   }
>```
>
<br>

-------------------------------------------------------

>### Submit Tax Return Form

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/tax_return/submit]() |   `POST`     |

>### Request
>
>### Content-Type: multipart/form-data

>#### Request Body
>
>    ```json
>   {
>       "file": "tax_return_2024.pdf",
>       "title": "Tax Return of 2024",
>       "type": "pdf file"
>
>   }
>    ```
>
</br>

>### Response 
>
>#### Response Code: 200 (`Okay`)

>#### Response Body
>
>```json
>   {
>        "success": true,
>        "message": "Pdf file submitted successfully",
>        "submission id": 123456,
>        "status": "pending for approval"
>   }
>```
>
<br>

>### Response - Not Found
>
>#### Response Code: 404 (`Not Found`)

>#### Response Body
>
>```json
>   {
>        "success": false,
>        "error": "Pdf file not Found"
>   }
>```
>
<br>

-----------------------------------------

### History

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/history]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Response Body
>    ```json
>   {
>       "Previous Return": [
>           { 
>               "tid": 12345,
>               "title": "Tax Return of 2023",
>               "Status": "Pending for approval",
>               "download_url": "/user/history/2023/download"
>           },
>           { 
>               "tid": 12346,
>               "title": "Tax Return of 2022",
>               "Status": "Submitted",
>               "download_url": "/user/history/2022/download"
>           }
>       ]
>}
>```
>
<br>

### Download Previous Tax Return From History

| API Endpoint              | HTTP Method |
| --- | :---: |
| [/user/history/2023/download]() |   `GET`     |

>### Request
>
>#### Request Body
>
>    ```json
>   {
>
>   }
>    ```
>
</br>

>### Response
>
>#### Response Code : 200 (`OK`)
>
>#### Content-type : application/pdf
>
>#### Content-Disposition: attachment; filename="tax_return_2023.pdf"
>
>#### Response Body
>    ```json
>   {
>       
>   }
>```
>
<br>
---

## Admin Module
---

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
>```
---
<br>


