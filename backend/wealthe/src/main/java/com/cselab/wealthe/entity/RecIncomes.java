package com.cselab.wealthe.entity;

import java.sql.Date;
import java.time.LocalDate;

public class RecIncomes {
    private Long id;
    private Long userId;
    private Boolean isSalary;
    private String type;
    private String title;
    private LocalDate date;
    private String recurrence;
    private Double amount;
    private Double profit;
    private Double exemptedAmount;
    private Long recurrenceParent;

    // Default constructor
    public RecIncomes() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getIsSalary() {
        return isSalary;
    }

    public void setIsSalary(Boolean isSalary) {
        this.isSalary = isSalary;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getRecurrence() {
        return recurrence;
    }

    public void setRecurrence(String recurrence) {
        this.recurrence = recurrence;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public Double getExemptedAmount() {
        return exemptedAmount;
    }

    public void setExemptedAmount(Double exemptedAmount) {
        this.exemptedAmount = exemptedAmount;
    }

    public Long getRecurrenceParent() {
        return recurrenceParent;
    }

    public void setRecurrenceParent(Long recurrenceParent) {
        this.recurrenceParent = recurrenceParent;
    }

    @Override
    public String toString() {
        return "RecIncomes{" +
                "id=" + id +
                ", userId=" + userId +
                ", isSalary=" + isSalary +
                ", type='" + type + '\'' +
                ", title='" + title + '\'' +
                ", date=" + date +
                ", recurrence='" + recurrence + '\'' +
                ", amount=" + amount +
                ", profit=" + profit +
                ", exemptedAmount=" + exemptedAmount +
                ", recurrenceParent=" + recurrenceParent +
                '}';
    }
}
