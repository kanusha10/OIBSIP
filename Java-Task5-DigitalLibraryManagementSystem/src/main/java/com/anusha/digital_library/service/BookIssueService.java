package com.anusha.digital_library.service;

import com.anusha.digital_library.dto.IssueRequest;
import com.anusha.digital_library.entity.Book;
import com.anusha.digital_library.entity.BookIssue;
import com.anusha.digital_library.entity.IssueStatus;
import com.anusha.digital_library.entity.User;
import com.anusha.digital_library.repository.BookIssueRepository;
import com.anusha.digital_library.repository.BookRepository;
import com.anusha.digital_library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookIssueService {

    private final BookIssueRepository issueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookIssueService(BookIssueRepository issueRepository,
                            BookRepository bookRepository,
                            UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public BookIssue issueBook(IssueRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getQuantity() <= 0) {
            throw new RuntimeException("Book is currently unavailable");
        }

        // Decrease available quantity
        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);

        LocalDate issueDate = LocalDate.now();

        BookIssue issue = new BookIssue();

        issue.setUser(user);
        issue.setBook(book);
        issue.setIssueDate(issueDate);

        // 14-day borrowing period
        issue.setDueDate(issueDate.plusDays(14));

        issue.setFine(BigDecimal.ZERO);
        issue.setStatus(IssueStatus.ISSUED);

        return issueRepository.save(issue);
    }

    public BookIssue returnBook(Long issueId) {

        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue record not found"));

        if (issue.getStatus() == IssueStatus.RETURNED) {
            throw new RuntimeException("Book has already been returned");
        }

        LocalDate returnDate = LocalDate.now();

        issue.setReturnDate(returnDate);
        issue.setStatus(IssueStatus.RETURNED);

        // Calculate overdue days
        long overdueDays = ChronoUnit.DAYS.between(
                issue.getDueDate(),
                returnDate
        );

        BigDecimal fine = BigDecimal.ZERO;

        if (overdueDays > 0) {
            fine = BigDecimal.valueOf(overdueDays * 5);
        }

        issue.setFine(fine);

        // Increase available quantity
        Book book = issue.getBook();
        book.setQuantity(book.getQuantity() + 1);
        bookRepository.save(book);

        return issueRepository.save(issue);
    }

    public List<BookIssue> getIssuesByUser(Long userId) {
        return issueRepository.findByUser_Id(userId);
    }

    public List<BookIssue> getAllIssues() {
        return issueRepository.findAll();
    }

    public List<BookIssue> getCurrentlyIssuedBooks() {

        return issueRepository.findByStatus(IssueStatus.ISSUED);
    }

    public BookIssue markFinePaid(Long issueId) {

        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() ->
                        new RuntimeException("Issue record not found"));

        if (issue.getFine().compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("No fine to pay");
        }

        issue.setFinePaid(true);

        return issueRepository.save(issue);
    }
}