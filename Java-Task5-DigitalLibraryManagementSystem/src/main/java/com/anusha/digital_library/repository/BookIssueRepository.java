package com.anusha.digital_library.repository;

import com.anusha.digital_library.entity.BookIssue;
import com.anusha.digital_library.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {

    List<BookIssue> findByUser_Id(Long userId);

    List<BookIssue> findByStatus(IssueStatus status);
}