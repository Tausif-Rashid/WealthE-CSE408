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

>### Response - Invalid ID
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

>### Response - Internal Server error
>
>#### Response Code: 500 (`Internal Server Error`)
>
>```json
>{
>    "success": false,
>    "error": "Unexpected Error Occur"
>}
>```
>
<br>
