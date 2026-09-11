# ATM Interface

## Project Overview

A console-based ATM Interface developed using Java and Object-Oriented Programming principles. The application allows users to securely log in and perform common banking transactions such as deposits, withdrawals, transfers, and viewing transaction history.

## Features

* User ID and PIN authentication
* Maximum of 3 incorrect login attempts
* Transaction history
* Cash withdrawal
* Cash deposit
* Account-to-account money transfer
* Insufficient funds validation
* Invalid amount validation
* Current balance display
* Transaction tracking using `ArrayList`
* Multiple accounts managed using `HashMap`

## Technologies Used

* Java
* Object-Oriented Programming
* ArrayList
* HashMap
* Switch-case
* Exception Handling
* LocalDateTime

## Project Structure

```text
Java-Task3-ATMInterface
└── src
    └── main
        └── java
            └── com
                └── anusha
                    └── atm
                        ├── ATM.java
                        ├── Account.java
                        ├── Bank.java
                        ├── Main.java
                        └── Transaction.java
```

## Classes

### Main

Entry point of the application. Creates the `Bank` and `ATM` objects and starts the application.

### ATM
Handles user authentication, menu options, deposits, withdrawals, transfers, and transaction history.

### Account
Stores account information such as User ID, PIN, and balance.

### Bank
Maintains multiple accounts and handles account-to-account transfers.

### Transaction
Stores transaction type, amount, description, and date/time.

## Sample Accounts

| User ID | PIN  | Initial Balance |
| ------- | ---- | --------------: |
| A1001   | 1234 |         ₹10,000 |
| A1002   | 5678 |          ₹8,000 |
| A1003   | 1111 |          ₹5,000 |


## Learning Outcomes
This project demonstrates practical implementation of:

* Encapsulation
* Classes and objects
* Constructors
* Collections
* Exception handling
* Conditional statements
* Switch-case
* Method-based program design
* Basic banking transaction logic
* Object-Oriented programming principles
