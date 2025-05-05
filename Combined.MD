# <div align="center">WealthE API Documentation</div>

### <div align="center"> Group 7 (A2) </div>

<div align="center">1. 2005050 - Nabila Tabassum </div>
<div align="center">2. 2005052 - Tausif Rashid </div>
<div align="center">3. 2005056 - Azmal Karim </div>

----------------------------------------------

## Index

1. [User Module](#user-module) 
    1. [Income Module](#income-module)
        1. [Employment Income](#employment-income)
        2. [Other Income](#other-income)
    2. [Expense Module](#expense-module)
    3. [Asset & Liability Module](#asset-liability-module)
## User Module

### Income Module
### Employment Income

### Get List
| API Endpoint             | HTTP Method |
| ------------------------ | :---------: |
| [/user/employment/]()    |   `GET`     |
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
| [/user/employment/add]() |   `POST`    |

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
>
>       
> }
> ```

---

## Expense Module

## Asset & Liability Module


