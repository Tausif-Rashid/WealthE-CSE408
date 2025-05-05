# WealthE-CSE408

### <div align="center"> Group 7 (A2) </div>

<div align="center">1. 2005050 - Nabila Tabassum </div>
<div align="center">2. 2005052 - Tausif Rashid </div>
<div align="center">3. 2005056 - Azmal Karim </div>

----------------------------------------------

## User Module
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
>       "success": true,
>       "message": "Tax History is shown successfully",
>       "Previous Return": [
>           { 
>               "tid": 12345,
>               "title": "Tax Return of 2023",
>               "Status": "Pending for approval"
>           },
>           { 
>               "tid": 12346,
>               "title": "Tax Return of 2022",
>               "Status": "Submitted"
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


