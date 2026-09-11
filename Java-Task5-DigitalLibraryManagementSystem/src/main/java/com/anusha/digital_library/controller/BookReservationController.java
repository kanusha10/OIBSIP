package com.anusha.digital_library.controller;

import com.anusha.digital_library.dto.ReservationRequest;
import com.anusha.digital_library.entity.BookReservation;
import com.anusha.digital_library.service.BookReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class BookReservationController {

    private final BookReservationService reservationService;

    public BookReservationController(
            BookReservationService reservationService) {

        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<BookReservation> reserveBook(
            @RequestBody ReservationRequest request) {

        return ResponseEntity.ok(
                reservationService.reserveBook(request)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookReservation>> getUserReservations(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                reservationService.getUserReservations(userId)
        );
    }
}