package com.anusha.digital_library.controller;

import com.anusha.digital_library.entity.ContactQuery;
import com.anusha.digital_library.service.ContactQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactQueryController {

    private final ContactQueryService queryService;

    public ContactQueryController(ContactQueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping
    public ResponseEntity<ContactQuery> submitQuery(
            @RequestBody ContactQuery query) {

        return ResponseEntity.ok(
                queryService.submitQuery(query)
        );
    }

    @GetMapping
    public ResponseEntity<List<ContactQuery>> getAllQueries() {

        return ResponseEntity.ok(
                queryService.getAllQueries()
        );
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ContactQuery> markResolved(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                queryService.markResolved(id)
        );
    }
}