BEGIN;

WITH new_user AS (
INSERT INTO public.user_tax_info(
	tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
	VALUES ('1234567890', TRUE, FALSE, FALSE, FALSE, 1, 2, 'Dhaka')
	RETURNING id
)

INSERT INTO public.user_info(
	id, name, phone, nid, dob, spouse_name, spouse_tin)
SELECT id,'tausif','01234556778', '12345667890', '2002-1-1', null, null
FROM new_user;



INSERT INTO public.credentials(
	id, email, password_hash)
SELECT id, 'abc@yahoo.com', 'hashed'
FROM new_user;

END;