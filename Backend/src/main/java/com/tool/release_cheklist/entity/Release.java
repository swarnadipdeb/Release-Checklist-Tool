package com.tool.release_cheklist.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "releases")
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String additionalInfo;

    // Bitmask: bit i set means step i is completed (steps 0-6)
    @Column(nullable = false)
    private Integer completedSteps;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum Status {
        PLANNED, ONGOING, DONE
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.completedSteps == null) {
            this.completedSteps = 0;
        }
        this.status = Status.PLANNED;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // -- Computed helpers --

    public void toggleStep(int stepIndex) {
        if (stepIndex < 0 || stepIndex > 6) {
            throw new IllegalArgumentException("Step index must be 0-6");
        }
        if (this.completedSteps == null) {
            this.completedSteps = 0;
        }
        this.completedSteps ^= (1 << stepIndex);
        computeStatus();
    }

    public boolean isStepCompleted(int stepIndex) {
        if (this.completedSteps == null) return false;
        return (this.completedSteps & (1 << stepIndex)) != 0;
    }

    private void computeStatus() {
        if (this.completedSteps == null || this.completedSteps == 0) {
            this.status = Status.PLANNED;
        } else if ((this.completedSteps & 0x7F) == 0x7F) {
            this.status = Status.DONE;
        } else {
            this.status = Status.ONGOING;
        }
    }

    // -- Getters and Setters --

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @JsonFormat(pattern = "yyyy-MM-dd")
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getAdditionalInfo() { return additionalInfo; }
    public void setAdditionalInfo(String additionalInfo) { this.additionalInfo = additionalInfo; }

    public Integer getCompletedSteps() { return completedSteps; }
    public void setCompletedSteps(Integer completedSteps) { this.completedSteps = completedSteps; }

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
