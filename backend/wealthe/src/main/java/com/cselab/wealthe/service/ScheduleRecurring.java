package com.cselab.wealthe.service;


import com.cselab.wealthe.entity.RecIncomes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleRecurring {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    // Run daily at 2 AM (you can adjust this cron expression)

//   @Scheduled(fixedRate = 10000)
    @Scheduled(cron = "0 0 2 * * *")
    public void updateDateTable() {
        System.out.println("Running scheduled date update: " + LocalDate.now());

       LocalDate from = LocalDate.of(2024, 10, 1);
       LocalDate to = LocalDate.of(2025, 7, 28);

       long days = ChronoUnit.DAYS.between(from, to);
       System.out.println("Days ago: " + days);

        LocalDate today = LocalDate.now();
        //Get all recurring incomes where parent=null and insert new
        String recurringIncomeSql = "SELECT id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount, recurrence_parent FROM income WHERE recurrence IS NOT NULL";
        List<RecIncomes> recurringIncomes = jdbcTemplate.query(recurringIncomeSql, new BeanPropertyRowMapper<>(RecIncomes.class));

        for (RecIncomes income : recurringIncomes) {
            //System.out.println(income);

            if(income.getRecurrenceParent()==null){
                //System.out.println("Income ID: " + income.getId() + ", Amount: " + income.getAmount());
                // Here you can add logic to insert the new recurring income into the database
                // For example, you might want to create a new RecIncomes object and save it
                // jdbcTemplate.update("INSERT INTO income (...) VALUES (...)", ...);

                String recurrenceType = income.getRecurrence();
                System.out.println("Found a recurring "+ recurrenceType);

                if(income.getDate()==null)
                    continue;
                // Convert Date to LocalDate
//                LocalDate date_of_income1 = income.getDate().toInstant()
//                        .atZone(ZoneId.systemDefault())
//                        .toLocalDate();
//                System.out.println(date_of_income1);
                LocalDate date_of_income = income.getDate();
                // Calculate days
                long daysBetween = ChronoUnit.DAYS.between(date_of_income, today);

                String sqlIns = "INSERT INTO income (user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount, recurrence_parent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                if(recurrenceType.equalsIgnoreCase("daily")) {
                    // Insert a new record for daily recurrence
                    System.out.println("Inserting new daily income");
                    jdbcTemplate.update(sqlIns,
                            income.getUserId(), income.getIsSalary(), income.getType(), income.getTitle(), today, "daily", income.getAmount(), income.getProfit(), income.getExemptedAmount(), income.getId());
                } else if(recurrenceType.equalsIgnoreCase("weekly") && daysBetween!=0 && daysBetween%7==0) {
                    // Insert a new record for weekly recurrence
                    System.out.println("Inserting new weekly income");
                    jdbcTemplate.update(sqlIns,
                            income.getUserId(), income.getIsSalary(), income.getType(), income.getTitle(), today, "weekly", income.getAmount(), income.getProfit(), income.getExemptedAmount(), income.getId());
                } else if(recurrenceType.equalsIgnoreCase("monthly") && daysBetween!=0 && daysBetween%30==0) {
                    // Insert a new record for monthly recurrence
                    System.out.println("Inserting new monthly income");
                    jdbcTemplate.update(sqlIns,
                            income.getUserId(), income.getIsSalary(), income.getType(), income.getTitle(), today, "monthly", income.getAmount(), income.getProfit(), income.getExemptedAmount(), income.getId());
                } else if(recurrenceType.equalsIgnoreCase("annual") && daysBetween!=0 && daysBetween%365==0) {
                    // Insert a new record for annual recurrence
                    System.out.println("Inserting new annual income");
                    jdbcTemplate.update( sqlIns,
                            income.getUserId(), income.getIsSalary(), income.getType(), income.getTitle(), today, "annual", income.getAmount(), income.getProfit(), income.getExemptedAmount(), income.getId());
                }

            }
        }
    }
}
