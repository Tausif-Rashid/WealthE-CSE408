-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.admin
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(50) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nid character varying(20) COLLATE pg_catalog."default",
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT admin_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.asset_bank_account
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    account character varying(20) COLLATE pg_catalog."default",
    amount money,
    bank_name character varying(20) COLLATE pg_catalog."default",
    title character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT asset_bank_account_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.asset_car
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id integer,
    model character varying(20) COLLATE pg_catalog."default",
    engine integer,
    description text COLLATE pg_catalog."default",
    title character varying(20) COLLATE pg_catalog."default",
    cost money,
    acquisition character varying(20) COLLATE pg_catalog."default",
    reg_number character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT asset_car_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.asset_flat
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    title character varying(20) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    cost money,
    date date,
    location character varying(30) COLLATE pg_catalog."default",
    acquisition character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT asset_flat_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.asset_jewelery
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    title character varying(20) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    cost money,
    acquisition character varying(20) COLLATE pg_catalog."default",
    weight numeric,
    CONSTRAINT asset_jewelery_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.asset_plot
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id integer,
    type character varying(20) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    cost money,
    date date,
    acquisition character varying(20) COLLATE pg_catalog."default",
    location text COLLATE pg_catalog."default",
    CONSTRAINT asset_plot_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.credentials
(
    id integer NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT credentials_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.expense
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id integer,
    type character varying(20) COLLATE pg_catalog."default",
    amount money,
    description text COLLATE pg_catalog."default",
    date date,
    CONSTRAINT expense_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.file
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    link text COLLATE pg_catalog."default",
    date date,
    amount money,
    trx_id character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT file_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.income
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id integer,
    is_salary boolean,
    type character varying(20) COLLATE pg_catalog."default",
    title character varying(20) COLLATE pg_catalog."default",
    date date,
    recurrence character varying(10) COLLATE pg_catalog."default",
    amount money,
    profit money,
    exempted_amount money,
    CONSTRAINT income_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.investment
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    title character varying(20) COLLATE pg_catalog."default",
    amount money,
    date date,
    CONSTRAINT investment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.liability_bank_loan
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    bank_name character varying(20) COLLATE pg_catalog."default",
    account character varying(30) COLLATE pg_catalog."default",
    interest numeric,
    amount money,
    remaining money,
    CONSTRAINT liability_bank_loan_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.liability_person_loan
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer,
    lender_name character varying(50) COLLATE pg_catalog."default",
    lender_nid character varying(20) COLLATE pg_catalog."default",
    amount money,
    remaining money,
    interest numeric,
    CONSTRAINT liability_person_loan_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.log_table
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id integer NOT NULL,
    table_name character varying(30) COLLATE pg_catalog."default",
    table_key bigint,
    action character varying(30) COLLATE pg_catalog."default",
    details character varying(40) COLLATE pg_catalog."default",
    CONSTRAINT log_table_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_income
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    category character varying(12) COLLATE pg_catalog."default",
    slab_no integer,
    slab_length money,
    tax_rate numeric,
    CONSTRAINT rule_income_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_income_category
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT rule_income_category_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_investment_type
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying(30) COLLATE pg_catalog."default",
    rate_rebate numeric,
    amount money,
    min_amount money,
    description text COLLATE pg_catalog."default",
    max_amount money,
    CONSTRAINT investment_type_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_log
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    rule_table_name character varying(20) COLLATE pg_catalog."default",
    rule_id integer,
    column_name character varying(20) COLLATE pg_catalog."default",
    old_value character varying(30) COLLATE pg_catalog."default",
    new_value character varying(30) COLLATE pg_catalog."default",
    change_date date,
    CONSTRAINT rule_log_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_rebate
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    max_rebate_amount money,
    max_of_income numeric,
    CONSTRAINT rule_rebate_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_tax_area_list
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    area_name character varying(20) COLLATE pg_catalog."default",
    zone_no integer,
    circle_no integer,
    CONSTRAINT rule_tax_area_list_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rule_tax_zone_min_tax
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    area_name character varying(20) COLLATE pg_catalog."default",
    min_amount money,
    CONSTRAINT rule_tax_zone_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_info
(
    id integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(15) COLLATE pg_catalog."default",
    nid character varying(17) COLLATE pg_catalog."default",
    dob date,
    spouse_name character varying(50) COLLATE pg_catalog."default",
    spouse_tin character varying(12) COLLATE pg_catalog."default",
    CONSTRAINT user_id_tax PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_tax_info
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    tin character varying(12) COLLATE pg_catalog."default",
    is_resident boolean,
    is_ff boolean,
    is_female boolean,
    is_disabled boolean,
    tax_zone integer,
    tax_circle integer,
    area_name character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT user_tax_info_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.asset_bank_account
    ADD CONSTRAINT asset_bank_account_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.asset_car
    ADD CONSTRAINT asset_car_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.asset_flat
    ADD CONSTRAINT asset_flat_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.asset_jewelery
    ADD CONSTRAINT asset_jewelery_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.asset_plot
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.credentials
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS credentials_pkey
    ON public.credentials(id);


ALTER TABLE IF EXISTS public.expense
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.file
    ADD CONSTRAINT file_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.income
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.investment
    ADD CONSTRAINT investment_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.liability_bank_loan
    ADD CONSTRAINT liability_bank_loan_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.liability_person_loan
    ADD CONSTRAINT liability_person_loan_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.log_table
    ADD CONSTRAINT log_table_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.user_info
    ADD CONSTRAINT fk_tax_id FOREIGN KEY (id)
    REFERENCES public.user_tax_info (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS user_id_tax
    ON public.user_info(id);

END;