INSERT INTO public.asset_bank_account (user_id, account, amount, bank_name, title)
SELECT 
    user_id,
    LPAD((random() * 10^16)::bigint::text, 16, '0'), -- Generate a 16-digit number as string
    (ROUND((random() * 50000 + 1000)::numeric, 2))::money AS amount,
    (ARRAY['Sonali Bank',
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
            'IDLC Finance'])[floor(random() * 7) + 1],
    (ARRAY['Savings', 'Checking', 'Investment', 'Current'])[floor(random() * 4) + 1]
FROM (
    SELECT u.user_id, g.seq
    FROM generate_series(1, 3) g(seq)
    RIGHT JOIN (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u
    ON TRUE
    WHERE random() < (CASE WHEN g.seq IS NOT NULL THEN 0.7 ELSE 0.3 END)
) AS users_with_optional_accounts;



INSERT INTO public.asset_car (
    user_id, model, engine, description, title, cost, acquisition, reg_number
)
SELECT 
    user_id,
    (ARRAY['Toyota Corolla', 'Honda Civic', 'Ford Mustang', 'BMW 3 Series', 'Mercedes C-Class',
           'Tesla Model 3', 'Hyundai Elantra', 'Volkswagen Golf', 'Audi A4', 'Nissan Altima'])[floor(random() * 10) + 1],
    (floor(random() * 800 + 1200))::int AS engine_cc,
    'Used car in good condition with low mileage.',
    (ARRAY['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible'])[floor(random() * 5) + 1],
    (ROUND((random() * 30000 + 10000)::numeric, 2))::money AS cost,
    (ARRAY['Purchased', 'Leased'])[floor(random() * 2) + 1],
    upper(
        CHR(65 + (random() * 26)::int) ||
        CHR(65 + (random() * 26)::int) ||
        '-' ||
        (floor(random() * 10))::text ||
        (floor(random() * 10))::text ||
        '-' ||
        CHR(65 + (random() * 26)::int) ||
        CHR(65 + (random() * 26)::int) ||
        (floor(random() * 10))::text ||
        (floor(random() * 10))::text
    ) AS reg_number
FROM (
    SELECT user_id, 
           CASE WHEN user_id = 7 THEN 2 ELSE 1 END AS car_count -- only user_id 7 gets 2 cars
    FROM generate_series(2, 16) AS user_id
) users_with_cars
CROSS JOIN LATERAL generate_series(1, CASE WHEN car_count = 2 THEN 2 ELSE 1 END)
ORDER BY random();



INSERT INTO public.asset_flat (
    user_id, title, description, cost, date, location, acquisition
)
SELECT
    user_id,
    (ARRAY['Apartment', 'Flat', 'Residence', 'Condo'])[floor(random() * 4) + 1],
    'A residential flat located in ' || location || ', well-maintained with modern amenities.',
    (ROUND((random() * 20000000 + 5000000)::numeric, 2))::money,
    '2020-01-01'::date + (random() * 1600)::int,
    location,
    (ARRAY['Purchased', 'Inherited', 'Gifted'])[floor(random() * 3) + 1]
FROM (
    SELECT
        u.user_id,
        generate_series(1, floor(random() * 3)::int) AS num_flats,
        (ARRAY['Dhaka', 'Chittagong', 'Khulna', 'Barisal', 'Rajshahi', 'Rangpur', 'Mymensingh', 'Sylhet'])[floor(random() * 8) + 1] AS location
    FROM (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u
) flats_per_user
WHERE num_flats >= 1;


INSERT INTO public.asset_jewelery (
    user_id, title, description, cost, acquisition, weight
)
SELECT
    user_id,
    (ARRAY[
        'Gold Chain', 'Diamond Ring', 'Silver Earrings', 'Platinum Bracelet',
        'Pearl Necklace', 'Ruby Pendant', 'Emerald Ring', 'Gold Bangle',
        'Diamond Studs', 'Jade Brooch'
    ])[floor(random() * 10) + 1] AS title,
    'A high-quality piece of jewelery made of ' ||
    lower((ARRAY['Gold', 'Silver', 'Platinum', 'Diamond', 'Pearl', 'Ruby', 'Emerald', 'Jade'])[floor(random() * 8) + 1]) ||
    ', suitable for special occasions.',
    (ROUND((random() * 200000 + 10000)::numeric, 2))::money AS cost,
    (ARRAY['Purchased', 'Gifted', 'Inherited', 'Handmade'])[floor(random() * 4) + 1] AS acquisition,
    ROUND((random() * 50 + 1)::numeric, 2) AS weight -- weight between 1 and 51 grams
FROM (
    SELECT u.user_id, g.idx
    FROM generate_series(1, 3) AS g(idx)
    RIGHT JOIN (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u ON TRUE
    WHERE random() < (CASE WHEN g.idx IS NOT NULL THEN 0.6 ELSE 0.3 END)
) users_with_optional_jewelery
ORDER BY random()
LIMIT 40;


INSERT INTO public.asset_plot (
    user_id, type, description, cost, date, acquisition, location
)
SELECT
    user_id,
    type,
    'Land plot located in ' || location || ', suitable for ' || lower(type) || ' use.' AS description,
    cost,
    date,
    acquisition,
    location
FROM (
    SELECT
        u.user_id,
        (ARRAY['Residential', 'Commercial', 'Agricultural', 'Industrial'])[floor(random() * 4) + 1] AS type,
        (ROUND((random() * 50000000 + 5000000)::numeric, 2))::money AS cost,
        ('2010-01-01'::date + (random() * 3650)::int) AS date,
        (ARRAY['Purchased', 'Inherited', 'Gifted', 'Leased'])[floor(random() * 4) + 1] AS acquisition,
        (ARRAY[
            'Dhaka', 'Chittagong', 'Khulna', 'Barisal',
            'Rajshahi', 'Rangpur', 'Mymensingh', 'Sylhet'
        ])[floor(random() * 8) + 1] AS location
    FROM (
        SELECT unnest(ARRAY[16,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) AS user_id
    ) u
    CROSS JOIN LATERAL generate_series(1, floor(random() * 3 + 0.5)::int)
) plots_data
ORDER BY user_id;