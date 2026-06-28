package com.tool.release_cheklist.service;

import com.tool.release_cheklist.entity.Release;
import com.tool.release_cheklist.repository.ReleaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReleaseService {

    private final ReleaseRepository repository;

    public ReleaseService(ReleaseRepository repository) {
        this.repository = repository;
    }

    public List<Release> findAll() {
        return repository.findAllByOrderByDateDesc();
    }

    public Release findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Release not found: " + id));
    }

    @Transactional
    public Release create(Release release) {
        release.setCompletedSteps(0);
        return repository.save(release);
    }

    @Transactional
    public Release update(Long id, Release updates) {
        Release existing = findById(id);
        if (updates.getName() != null) {
            existing.setName(updates.getName());
        }
        if (updates.getDate() != null) {
            existing.setDate(updates.getDate());
        }
        if (updates.getAdditionalInfo() != null) {
            existing.setAdditionalInfo(updates.getAdditionalInfo());
        }
        return repository.save(existing);
    }

    @Transactional
    public Release toggleStep(Long id, int stepIndex) {
        Release release = findById(id);
        release.toggleStep(stepIndex);
        return repository.save(release);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
