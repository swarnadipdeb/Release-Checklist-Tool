package com.tool.release_cheklist.repository;

import com.tool.release_cheklist.entity.Release;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findAllByOrderByDateDesc();
}
