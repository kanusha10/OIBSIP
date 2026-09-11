package com.anusha.digital_library.service;

import com.anusha.digital_library.dto.ReservationRequest;
import com.anusha.digital_library.entity.Book;
import com.anusha.digital_library.entity.BookReservation;
import com.anusha.digital_library.entity.User;
import com.anusha.digital_library.repository.BookRepository;
import com.anusha.digital_library.repository.BookReservationRepository;
import com.anusha.digital_library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookReservationService {

    private final BookReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookReservationService(
            BookReservationRepository reservationRepository,
            BookRepository bookRepository,
            UserRepository userRepository) {

        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public BookReservation reserveBook(ReservationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getQuantity() > 0) {
            throw new RuntimeException(
                    "Book is available. You can issue it directly."
            );
        }

        // Check whether this user already has an active reservation
        boolean alreadyReserved =
                reservationRepository.existsByUser_IdAndBook_IdAndActiveTrue(
                        request.getUserId(),
                        request.getBookId()
                );

        if (alreadyReserved) {
            throw new RuntimeException(
                    "You have already reserved this book"
            );
        }

        // Create new reservation
        BookReservation reservation = new BookReservation();

        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setReservationDate(LocalDate.now());
        reservation.setActive(true);

        return reservationRepository.save(reservation);
    }

    public List<BookReservation> getUserReservations(Long userId) {
        return reservationRepository.findByUser_Id(userId);
    }
}