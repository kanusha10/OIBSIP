package com.anusha.digital_library.repository;

import com.anusha.digital_library.entity.BookReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookReservationRepository
        extends JpaRepository<BookReservation, Long> {

    List<BookReservation> findByUser_Id(Long userId);

    List<BookReservation> findByBook_IdAndActiveTrue(Long bookId);

    boolean existsByUser_IdAndBook_IdAndActiveTrue(
            Long userId,
            Long bookId
    );
}