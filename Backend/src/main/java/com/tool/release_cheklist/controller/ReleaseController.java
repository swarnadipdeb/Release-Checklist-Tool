package com.tool.release_cheklist.controller;

import com.tool.release_cheklist.entity.Release;
import com.tool.release_cheklist.service.ReleaseService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/releases")
public class ReleaseController {

    private final ReleaseService service;

    public ReleaseController(ReleaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Release> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Release> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Release> create(@Valid @RequestBody CreateRequest request) {
        Release release = new Release();
        release.setName(request.name());
        release.setDate(request.date());
        release.setAdditionalInfo(request.additionalInfo());
        Release created = service.create(release);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Release> update(@PathVariable Long id, @Valid @RequestBody UpdateRequest request) {
        Release updates = new Release();
        updates.setName(request.name());
        updates.setDate(request.date());
        updates.setAdditionalInfo(request.additionalInfo());
        return ResponseEntity.ok(service.update(id, updates));
    }

    @PatchMapping("/{id}/steps/{stepIndex}")
    public ResponseEntity<Release> toggleStep(@PathVariable Long id, @PathVariable int stepIndex) {
        return ResponseEntity.ok(service.toggleStep(id, stepIndex));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    record CreateRequest(
            @NotBlank String name,
            @NotNull LocalDate date,
            String additionalInfo
    ) {}

    record UpdateRequest(
            String name,
            LocalDate date,
            String additionalInfo
    ) {}
}
