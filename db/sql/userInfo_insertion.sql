
DO $$
DECLARE
    new_user_id INT;
BEGIN
    -- Insert into user_tax_info and get user_id
    INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1234567890', TRUE, FALSE, FALSE, FALSE, 1, 2, 'Dhaka')
	RETURNING id INTO new_user_id;

    -- Use the returned id in second insert
    INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
	VALUES (new_user_id,'tausif','01234556778', '12345667890', '2002-1-1', null, null);

	INSERT INTO public.credentials(
	id, email, password_hash)
	VALUES (new_user_id, 'abc@yahoo.com', 'hashed_pw');

END;
$$;
