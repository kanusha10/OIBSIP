package com.anusha.digital_library.service;

import com.anusha.digital_library.entity.ContactQuery;
import com.anusha.digital_library.repository.ContactQueryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactQueryService {

    private final ContactQueryRepository queryRepository;

    public ContactQueryService(ContactQueryRepository queryRepository) {
        this.queryRepository = queryRepository;
    }

    public ContactQuery submitQuery(ContactQuery query) {

        query.setCreatedAt(LocalDateTime.now());
        query.setResolved(false);

        return queryRepository.save(query);
    }

    public List<ContactQuery> getAllQueries() {
        return queryRepository.findAll();
    }

    public ContactQuery markResolved(Long id) {

        ContactQuery query = queryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Query not found"));

        query.setResolved(true);

        return queryRepository.save(query);
    }
}