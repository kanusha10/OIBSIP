package com.anusha.digital_library.controller;

import com.anusha.digital_library.dto.IssueRequest;
import com.anusha.digital_library.entity.BookIssue;
import com.anusha.digital_library.service.BookIssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class BookIssueController {

    private final BookIssueService issueService;

    public BookIssueController(BookIssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    public ResponseEntity<BookIssue> issueBook(
            @RequestBody IssueRequest request) {

        return ResponseEntity.ok(
                issueService.issueBook(request)
        );
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<BookIssue> returnBook(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.returnBook(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookIssue>> getUserIssues(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                issueService.getIssuesByUser(userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<BookIssue>> getAllIssues() {

        return ResponseEntity.ok(
                issueService.getAllIssues()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<BookIssue>> getCurrentlyIssuedBooks() {

        return ResponseEntity.ok(
                issueService.getCurrentlyIssuedBooks()
        );
    }

    @PutMapping("/{id}/pay-fine")
    public ResponseEntity<BookIssue> payFine(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueService.markFinePaid(id)
        );
    }
}