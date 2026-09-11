package com.anusha.atm;

import java.util.HashMap;
import java.util.Map;

public class Bank {

    private Map<String, Account> accounts;

    public Bank() {
        accounts = new HashMap<>();

        // Sample accounts
        accounts.put("A1001", new Account("A1001", "1234", 10000));
        accounts.put("A1002", new Account("A1002", "5678", 8000));
        accounts.put("A1003", new Account("A1003", "1111", 5000));
    }

    public Account getAccount(String userId) {
        return accounts.get(userId);
    }

    public boolean transfer(Account sender, String recipientId, double amount) {

        Account recipient = accounts.get(recipientId);

        if (recipient == null) {
            System.out.println("Recipient account not found.");
            return false;
        }

        if (sender.getUserId().equals(recipientId)) {
            System.out.println("Cannot transfer to the same account.");
            return false;
        }

        if (amount <= 0) {
            System.out.println("Invalid transfer amount.");
            return false;
        }

        if (sender.getBalance() < amount) {
            System.out.println("Insufficient Funds");
            return false;
        }

        sender.setBalance(sender.getBalance() - amount);
        recipient.setBalance(recipient.getBalance() + amount);

        return true;
    }
}