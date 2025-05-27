INSERT INTO public.rule_tax_zone_min_tax (area_name, min_amount)
VALUES 
    ('Dhaka', 5000),
    ('Gazipur', 4000),
    ('Mymensingh', 4000),
    ('Rest', 3000);

INSERT INTO public.rule_income (category, slab_no, slab_length, tax_rate)
VALUES 
    ('regular', 1, 350000, 0),
    ('regular', 2, 100000, 5),
    ('regular', 3, 400000, 10),
    ('regular', 4, 500000, 15),
    ('regular', 5, 500000, 20),
    ('regular', 6, 2147483647, 25),

 ('female', 1, 400000, 0),
    ('female', 2, 100000, 5),
    ('female', 3, 400000, 10),
    ('female', 4, 500000, 15),
    ('female', 5, 500000, 20),
    ('female', 6, 2147483647, 25),

 ('elderly', 1, 400000, 0),
    ('elderly', 2, 100000, 5),
    ('elderly', 3, 400000, 10),
    ('elderly', 4, 500000, 15),
    ('elderly', 5, 500000, 20),
    ('elderly', 6, 2147483647, 25),

 ('disabled', 1, 475000, 0),
    ('disabled', 2, 100000, 5),
    ('disabled', 3, 400000, 10),
    ('disabled', 4, 500000, 15),
    ('disabled', 5, 500000, 20),
    ('disabled', 6, 2147483647, 25),
 
    ('ff', 1, 500000, 0),
    ('ff', 2, 100000, 5),
    ('ff', 3, 400000, 10),
    ('ff', 4, 500000, 15),
    ('ff', 5, 500000, 20),
    ('ff', 6, 2147483647, 25);

INSERT INTO public.rule_income_category(name)
VALUES 
    ('Salary'),
    ('Rent'),
    ('Agriculture'),
    ('Interest'),
    ('Gift');

INSERT INTO public.rule_rebate(max_rebate_amount, max_of_income)
VALUES 
    (1000000, 3);

INSERT INTO public.rule_investment_type(title, rate_rebate, min_amount, max_amount, description )
VALUES 
    ('3 month Sanchaypatra', 15, 100000, 1000000, 'Short-term government savings certificate for 3-month period.'),
    ('6 month Sanchaypatra', 15, 100000, 3000000, 'Short-term government savings certificate for 6-month period.'),
    ('1 year Sanchaypatra', 15, 100000, 4500000, 'Long-term government savings certificate for 12-month period.'),
    ('Zakat', 15, 0, 2147483647, 'Donation to Zakat fund will help the poor of the country.'),
    ('FDR', 15, 0, 2147483647, 'Fixed Deposit purchased from Bank.');

CREATE TABLE IF NOT EXISTS public.rule_expense_category
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT rule_expense_category_pkey PRIMARY KEY (id)
);

INSERT INTO public.rule_expense_category(name)
VALUES 
    ('Groceries'),
    ('Utility'),
    ('Rent'),
    ('Educational Expense'),
    ('Medical Expense'),
    ('Transportation'),
    ('Clothing'),
    ('Purchase'),
    ('Donation');

INSERT INTO public.rule_expense_category(name)
VALUES 
    ('Groceries'),
    ('Utility'),
    ('Rent'),
    ('Educational Expense'),
    ('Medical Expense'),
    ('Transportation'),
    ('Clothing'),
    ('Purchase'),
    ('Donation');

INSERT INTO public.admin(name, email, nid, password_hash)
VALUES 
    ('nabila', 'nabila@gmail.com', '12345678990', 'Pn78aRt5@adg&Gh'),
    ('azmal', 'azmal@gmail.com', '43245682135', 'Gb^4fg5SJi98Lo'),
    ('tausif', 'tausif@gmail.com', '45893217536', 'Bn87MNre2@asdE');

INSERT INTO public.rule_tax_area_list(area_name, zone_no, circle_no)
SELECT 
    CASE
        WHEN zone_no BETWEEN 1 AND 15 THEN 'Dhaka'
        WHEN zone_no = 16 THEN 'Mymensingh'
        WHEN zone_no = 17 THEN 'Sylhet'
        WHEN zone_no BETWEEN 20 AND 23 THEN 'Chittagong'
        WHEN zone_no = 24 THEN 'Gazipur'
        WHEN zone_no = 25 THEN 'Khulna'
        WHEN zone_no = 26 THEN 'Comilla'
        WHEN zone_no = 27 THEN 'Rajshahi'
        WHEN zone_no = 28 THEN 'Barisal'
        WHEN zone_no = 29 THEN 'Bogra'
        WHEN zone_no = 30 THEN 'Rangpur'
        WHEN zone_no = 31 THEN 'Narayanganj'
    END AS area_name,
    zone_no,
    generate_series((zone_no - 1) * 22 + 1, zone_no * 22) AS circle_no
FROM generate_series(1, 31) AS zone_no;

DELETE FROM public.rule_tax_area_list
WHERE area_name IS NULL;
