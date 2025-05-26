INSERT INTO public.investment (user_id, title, amount, date)
SELECT
    user_id,
    (ARRAY[
        'Zakat Fund',
        'FDR',
        'Family Shanchaypatra',
        '3-Month Shanchaypatra',
        '5-Years Shanchaypatra'
    ])[floor(random() * 5) + 1] AS title,  -- Fixed: 5 instead of 6
    (ROUND((random() * 2900000 + 20000)::numeric, 2))::money AS amount,
    ('2018-01-01'::date + (random() * 2555)::int) AS date
FROM (
    SELECT u.user_id, g.idx
    FROM generate_series(1, 5) g(idx)
    RIGHT JOIN (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u ON TRUE
    WHERE random() < (CASE WHEN g.idx IS NOT NULL THEN 0.7 ELSE 0.3 END)
) users_with_investments
ORDER BY random()
LIMIT 60;


INSERT INTO public.liability_bank_loan (user_id, bank_name, account, interest, amount, remaining)
SELECT
    user_id,
    bank_name,
    LPAD((random() * 10^12)::bigint::text, 16, '0') AS account,
    ROUND((random() * 8 + 4)::numeric, 2) AS interest, -- Interest rate: 4% to 12%
    (ROUND((random() * 5000000 + 500000)::numeric, 2))::money AS amount,
    LEAST(
        (ROUND((random() * 5000000 + 500000)::numeric, 2))::money,
        (ROUND((random() * 4000000 + 100000)::numeric, 2))::money
    ) AS remaining
FROM (
    SELECT
        u.user_id,
        (ARRAY[
            'Sonali Bank',
            'Janata Bank',
            'Agrani Bank',
            'Rupali Bank',
            'Pubali Bank',
            'IFIC Bank',
            'Prime Bank',
            'Dutch-Bangla Bank',
            'City Bank',
            'HSBC Bangladesh',
            'BRAC Bank',
            'Southeast Bank',
            'NCC Bank',
            'EXIM Bank',
            'Shimanto Bank',
            'IDLC Finance'
        ])[floor(random() * 20) + 1] AS bank_name
    FROM (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u
    CROSS JOIN LATERAL generate_series(1, floor(random() * 3 + 0.5)::int) -- 0 to 2 loans per user
) loan_data;


INSERT INTO public.liability_person_loan (
    user_id, lender_name, lender_nid, amount, remaining, interest
)
SELECT
    user_id,
    lender_name,
    lender_nid,
    amount,
    remaining,
    interest
FROM (
    SELECT
        u.user_id,
        (ARRAY[
            'tausif',
            'abul',
            'babul',
            'kabul',
            'arpita',
            'fairuz',
            'toufik',
            'kowshik',
            'adnan',
            'shovon',
            'soumik',
            'swastika',
            'gourab'
        ])[floor(random() * 13) + 1] AS lender_name,
        LPAD((random() * 10^13)::bigint::text, 13, '0') AS lender_nid,
        (ROUND((random() * 500000 + 10000)::numeric, 2))::money AS amount,
        (ROUND((random() * 400000 + 5000)::numeric, 2))::money AS remaining,
        ROUND((random() * 15 + 5)::numeric, 2) AS interest
    FROM (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u
    CROSS JOIN LATERAL generate_series(1, floor(random() * 3 + 0.5)::int)
) loan_data
WHERE remaining <= amount;