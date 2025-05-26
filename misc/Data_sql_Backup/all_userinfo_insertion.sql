--user2
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000001', TRUE, FALSE, FALSE, FALSE, 1, 1, 'Dhaka')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'abul', '01700000001', '9000000001', '1990-01-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'abul@example.com', 'hashed_pw_1');

END;
$$;

--user3
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000002', TRUE, FALSE, TRUE, FALSE, 2, 2, 'Chittagong')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'adibah', '01700000002', '9000000002', '1991-01-01', 'Spouse_2', '1111111112');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'adibah@example.com', 'hashed_pw_2');

END;
$$;

--user4
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000003', TRUE, TRUE, FALSE, TRUE, 3, 3, 'Sylhet')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'kabul', '01700000003', '9000000003', '1992-01-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'kabul@example.com', 'hashed_pw_3');

END;
$$;

--user5
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000004', TRUE, FALSE, TRUE, FALSE, 4, 1, 'Khulna')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'arpita', '01700000004', '9000000004', '1960-01-01', 'Spouse_4', '1111111114');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'arpita@example.com', 'hashed_pw_4');

END;
$$;

--user6
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000005', TRUE, TRUE, FALSE, TRUE, 5, 2, 'Rajshahi')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'toufik', '01700000005', '9000000005', '1950-01-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'toufik@example.com', 'hashed_pw_5');

END;
$$;

--user7
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000006', TRUE, FALSE, TRUE, FALSE, 1, 3, 'Barisal')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'fairuz', '01700000006', '9000000006', '1995-01-01', 'Spouse_6', '1111111116');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'fairuz@example.com', 'hashed_pw_6');

END;
$$;

--user8
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000007', TRUE, TRUE, FALSE, TRUE, 2, 1, 'Comilla')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'kowshik', '01700000007', '9000000007', '1996-01-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'kowshik@example.com', 'hashed_pw_7');

END;
$$;

--user9
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000008', TRUE, FALSE, TRUE, FALSE, 3, 2, 'Mymensingh')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'swastika', '01700000008', '9000000008', '1957-01-01', 'Spouse_8', '1111111118');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'swastika@example.com', 'hashed_pw_8');

END;
$$;

--user10
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000009', TRUE, TRUE, FALSE, TRUE, 4, 3, 'Rangpur')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'tanim', '01700000009', '9000000009', '1998-01-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'tanim@example.com', 'hashed_pw_9');

END;
$$;

--user11
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000010', TRUE, FALSE, FALSE, FALSE, 5, 1, 'Jessore')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'shovon', '01700000010', '9000000010', '1999-01-01', 'Spouse_10', '1111111120');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'shovon@example.com', 'hashed_pw_10');

END;
$$;

--user12
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000011', TRUE, FALSE, FALSE, TRUE, 1, 1, 'Dhaka')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'soumik', '01700000011', '9000000011', '1990-02-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'soumik@example.com', 'hashed_pw_11');

END;
$$;

--user13
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1000000012', TRUE, TRUE, FALSE, FALSE, 2, 2, 'Chittagong')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'rifat', '01700000012', '9000000012', '1990-03-01', 'Spouse_12', '1111111122');

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'rifat@example.com', 'hashed_pw_12');

END;
$$;

--user14
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('10000000013', TRUE, FALSE, FALSE, FALSE, 3, 2, 'Dhaka')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'gourab', '01700000014', '9000000014', '1997-03-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'gourab@example.com', 'hashed_pw_13');

END;
$$;

--user15
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('10000000014', TRUE, FALSE, TRUE, FALSE, 3, 2, 'Dhaka')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id, 'rafia', '01700000015', '9000000015', '1997-02-01', NULL, NULL);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'rafia@example.com', 'hashed_pw_14');

END;
$$;
