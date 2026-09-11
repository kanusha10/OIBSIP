package com.anusha.atm;

import java.util.ArrayList;
import java.util.Scanner;

public class ATM {

    private Bank bank;
    private Scanner scanner;
    private Account currentAccount;
    private ArrayList<Transaction> transactions;

    public ATM(Bank bank) {
        this.bank = bank;
        this.scanner = new Scanner(System.in);
        this.transactions = new ArrayList<>();
    }

    public void start() {

        System.out.println("=================================");
        System.out.println("       WELCOME TO ATM");
        System.out.println("=================================");

        if (!login()) {
            System.out.println("Too many incorrect attempts.");
            System.out.println("Access denied.");
            return;
        }

        showMenu();
    }

    private boolean login() {

        int attempts = 0;

        while (attempts < 3) {

            System.out.print("Enter User ID: ");
            String userId = scanner.nextLine();

            System.out.print("Enter PIN: ");
            String pin = scanner.nextLine();

            Account account = bank.getAccount(userId);

            if (account != null && account.getPin().equals(pin)) {
                currentAccount = account;

                System.out.println("\nLogin successful!");
                System.out.println("Welcome, " + userId + "!");
                return true;
            }

            attempts++;

            System.out.println("Invalid User ID or PIN.");

            if (attempts < 3) {
                System.out.println("Attempts remaining: " + (3 - attempts));
            }
        }

        return false;
    }

    private void showMenu() {

        while (true) {

            System.out.println("\n=================================");
            System.out.println("          ATM MENU");
            System.out.println("=================================");
            System.out.println("1. Transaction History");
            System.out.println("2. Withdraw");
            System.out.println("3. Deposit");
            System.out.println("4. Transfer");
            System.out.println("5. Quit");
            System.out.println("=================================");

            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine();

            switch (choice) {

                case "1":
                    showTransactionHistory();
                    break;

                case "2":
                    withdraw();
                    break;

                case "3":
                    deposit();
                    break;

                case "4":
                    transfer();
                    break;

                case "5":
                    System.out.println("\nThank you for using our ATM.");
                    System.out.println("Goodbye!");
                    return;

                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }

    private void showTransactionHistory() {

        System.out.println("\n========== TRANSACTION HISTORY ==========");

        if (transactions.isEmpty()) {
            System.out.println("No transactions in the current session.");
        } else {
            for (Transaction transaction : transactions) {
                System.out.println(transaction);
            }
        }

        System.out.println("=========================================");
        System.out.printf("Current Balance: ₹%.2f%n", currentAccount.getBalance());
    }

    private void withdraw() {

        System.out.print("\nEnter withdrawal amount: ");

        try {
            double amount = Double.parseDouble(scanner.nextLine());

            if (amount <= 0) {
                System.out.println("Invalid amount.");
                return;
            }

            if (currentAccount.getBalance() < amount) {
                System.out.println("Insufficient Funds");
                return;
            }

            currentAccount.setBalance(
                    currentAccount.getBalance() - amount
            );

            transactions.add(
                    new Transaction(
                            "WITHDRAW",
                            amount,
                            "Cash withdrawal"
                    )
            );

            System.out.println("Withdrawal successful.");
            System.out.printf("Remaining Balance: ₹%.2f%n",
                    currentAccount.getBalance());

        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
        }
    }

    private void deposit() {

        System.out.print("\nEnter deposit amount: ");

        try {
            double amount = Double.parseDouble(scanner.nextLine());

            if (amount <= 0) {
                System.out.println("Invalid amount.");
                return;
            }

            currentAccount.setBalance(
                    currentAccount.getBalance() + amount
            );

            transactions.add(
                    new Transaction(
                            "DEPOSIT",
                            amount,
                            "Cash deposit"
                    )
            );

            System.out.println("Deposit successful.");
            System.out.printf("Updated Balance: ₹%.2f%n",
                    currentAccount.getBalance());

        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
        }
    }

    private void transfer() {
        System.out.print("\nEnter recipient account ID: ");
        String recipientId = scanner.nextLine();

        System.out.print("Enter transfer amount: ");

        try {
            double amount = Double.parseDouble(scanner.nextLine());

            double oldBalance = currentAccount.getBalance();

            if (bank.transfer(currentAccount, recipientId, amount)) {

                transactions.add(
                        new Transaction(
                                "TRANSFER",
                                amount,
                                "Transfer to account " + recipientId
                        )
                );

                System.out.println("Transfer successful.");
                System.out.printf("Transferred: ₹%.2f%n", amount);
                System.out.printf("Remaining Balance: ₹%.2f%n",
                        currentAccount.getBalance());

            } else {
                currentAccount.setBalance(oldBalance);
            }

        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
        }
    }
}