DO $$
BEGIN
    -- User 1
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (16, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 50000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (16, FALSE, 'rent', 'Rent from flat_A', '2025-01-10', 'monthly', 20000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (16, FALSE, 'interest', 'Shanchaypotro', '2024-12-05', 'monthly', 2500.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (16, FALSE, 'interest', 'From loan', '2025-01-23', NULL, 3000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (16, TRUE, 'salary', 'December Pay', '2024-12-01', 'monthly', 50000.00, 0, 0);

    -- User 2
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (2, FALSE, 'agriculture', 'Jute Field', '2025-01-13', NULL, 80000.00,  20000.00, 0);
    
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (2, FALSE, 'rent', 'from flat_b', '2025-01-17', 'monthly', 15000.00,  0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (2, FALSE, 'rent', 'from flat_b', '2024-12-17', 'monthly', 15000.00,  0, 0);
    
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (2, FALSE, 'gift', 'from user_13', '2024-11-29', NULL, 15000.00,  0, 0);

    -- User 3
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (3, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 52000.00, 0, 0);
    
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (3, FALSE, 'interest', 'from user_12 loan', '2025-01-23', NULL, 5000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (3, FALSE, 'rent', 'from flat_c', '2025-01-23', 'monthly', 5000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (3, TRUE, 'salary', 'December Pay', '2024-12-01', 'monthly', 52000.00, 0, 0);

    -- User 4
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (4, FALSE, 'rent', 'Flat Rent', '2025-01-10', 'monthly', 25000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (4, TRUE, 'salary', 'january pay', '2025-01-10', 'monthly', 25000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (4, FALSE, 'agriculture', 'paddy field', '2025-01-10', NULL, 250000.00, 100000.00, 0);

    -- User 5
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (5, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 48000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (5, TRUE, 'salary', 'December Pay', '2024-12-01', 'monthly', 48000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (5, TRUE, 'salary', 'November Pay', '2024-11-01', 'monthly', 48000.00, 0, 0);

    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (5, TRUE, 'salary', 'October Pay', '2024-10-01', 'monthly', 48000.00, 0, 0);

    -- User 6
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (6, FALSE, 'interest', 'from shanchaypatra', '2025-01-20', 'monthly',10000.00, 0, 0);

    -- User 7
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (7, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 53000.00, 0, 0);

    -- User 8
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (8, FALSE, 'agriculture', 'mango garden', '2025-01-15', NULL, 70000.00, 7000.00, 0);

    -- User 9
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (9, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 51000.00, 0, 0);

    -- User 10
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (10, FALSE, 'rent', 'field X rent', '2025-01-10', 'yearly', 90000.00, 0, 0);

    -- User 11
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (11, TRUE, 'salary', 'january Pay', '2025-01-01', 'monthly', 55000.00, 0, 0);

    -- User 12
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (12, FALSE, 'interest', 'interest from fdr', '2025-01-20', NULL, 6000.00, 0, 0);

    -- User 13
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (13, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 56000.00, 0, 0);

    -- User 14
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (14, FALSE, 'gift', 'Wedding Gift', '2025-06-10', NULL, 150000.00, 0, 0);

    -- User 15
    INSERT INTO public.income(user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount)
    VALUES (15, TRUE, 'salary', 'January Pay', '2025-01-01', 'monthly', 57000.00, 0, 0);

END;
$$;
