# <div align="center">WealthE API Documentation</div>

### <div align="center"> Group 7 (A2) </div>

<div align="center"> 2005050 - Nabila Tabassum </div>
<div align="center"> 2005052 - Tausif Rashid </div>
<div align="center"> 2005056 - Azmal Karim </div>

----------------------------------------------

## Index

1. [User Module](#user-module) 
    1. [Income Module](#income-module)
        1. [Employment Income](#employment-income)
        2. [Other Income](#other-income)
        3. [Get Income Summary](#get-income-summary)
    2. [Expense Module](#expense-module)
    3. [Asset & Liability Module](#asset--liability-module)
        1. [Asset Module](#asset-module)
        2. [Liability Module](#liability-module)
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