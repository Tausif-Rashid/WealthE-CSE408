INSERT INTO public.expense (user_id, type, amount, description, date)
SELECT 
    user_id,
    (ARRAY['utilities', 'transportation', 'education', 'tds', 'rent', 'healthcare', 'entertainment', 'other'])[floor(random() * 8) + 1],
    (ROUND((random() * 1000 + 50)::numeric, 2))::money AS amount,
    'Sample expense #' || seq || ' for user ' || user_id,
    '2024-08-01'::date + (random() * 180)::int
FROM (
    SELECT u.user_id, g.seq
    FROM generate_series(1, 5) g(seq)
    CROSS JOIN (
        SELECT DISTINCT user_id 
        FROM (SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id) u
    ) u
) AS users_with_seq
ORDER BY random();