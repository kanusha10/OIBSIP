package com.anusha.digital_library.dto;

public class IssueRequest {

    private Long userId;
    private Long bookId;

    public IssueRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}