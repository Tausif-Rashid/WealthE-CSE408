--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-23 13:48:29

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 265 (class 1255 OID 16938)
-- Name: log_rule_income(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_rule_income() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.slab_length IS DISTINCT FROM NEW.slab_length THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_income', OLD.id, 'slab_length', OLD.slab_length::TEXT, NEW.slab_length::TEXT, CURRENT_TIMESTAMP);
    END IF;

    IF OLD.tax_rate IS DISTINCT FROM NEW.tax_rate THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_income', OLD.id, 'tax_rate', OLD.tax_rate::TEXT, NEW.tax_rate::TEXT, CURRENT_TIMESTAMP);
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_rule_income() OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 16939)
-- Name: log_rule_investment_type(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_rule_investment_type() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.rate_rebate IS DISTINCT FROM NEW.rate_rebate THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_investment_type', OLD.id, 'rate_rebate', OLD.rate_rebate::TEXT, NEW.rate_rebate::TEXT, CURRENT_TIMESTAMP);
    END IF;

    IF OLD.min_amount IS DISTINCT FROM NEW.min_amount THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_investment_type', OLD.id, 'min_amount', OLD.min_amount::TEXT, NEW.min_amount::TEXT, CURRENT_TIMESTAMP);
    END IF;

    IF OLD.max_amount IS DISTINCT FROM NEW.max_amount THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_investment_type', OLD.id, 'max_amount', OLD.max_amount::TEXT, NEW.max_amount::TEXT, CURRENT_TIMESTAMP);
    END IF;


    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_rule_investment_type() OWNER TO postgres;

--
-- TOC entry 263 (class 1255 OID 16936)
-- Name: log_rule_rebate(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_rule_rebate() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.max_rebate_amount IS DISTINCT FROM NEW.max_rebate_amount THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_rebate', OLD.id, 'max_rebate_amount', OLD.max_rebate_amount::TEXT, NEW.max_rebate_amount::TEXT, CURRENT_TIMESTAMP);
    END IF;

	IF OLD.max_of_income IS DISTINCT FROM NEW.max_of_income THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_rebate', OLD.id, 'max_of_income', OLD.max_of_income::TEXT, NEW.max_of_income::TEXT, CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_rule_rebate() OWNER TO postgres;

--
-- TOC entry 264 (class 1255 OID 16937)
-- Name: log_rule_tax_zone_min_tax(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_rule_tax_zone_min_tax() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.area_name IS DISTINCT FROM NEW.area_name THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_tax_zone_min_tax', OLD.id, 'area_name', OLD.area_name::TEXT, NEW.area_name::TEXT, CURRENT_TIMESTAMP);
    END IF;

    IF OLD.min_amount IS DISTINCT FROM NEW.min_amount THEN
        INSERT INTO change_log (rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date)
        VALUES ('rule_tax_zone_min_tax', OLD.id, 'min_amount', OLD.min_amount::TEXT, NEW.min_amount::TEXT, CURRENT_TIMESTAMP);
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_rule_tax_zone_min_tax() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 244 (class 1259 OID 16863)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    name character varying(50),
    email character varying(50) NOT NULL,
    nid character varying(20),
    password_hash text NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16862)
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.admin ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 16806)
-- Name: asset_bank_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_bank_account (
    id integer NOT NULL,
    user_id integer,
    account character varying(20),
    amount money,
    bank_name character varying(20),
    title character varying(20)
);


ALTER TABLE public.asset_bank_account OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16805)
-- Name: asset_bank_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asset_bank_account ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asset_bank_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16767)
-- Name: asset_car; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_car (
    id bigint NOT NULL,
    user_id integer,
    model character varying(20),
    engine integer,
    description text,
    title character varying(20),
    cost money,
    acquisition character varying(20),
    reg_number character varying(20)
);


ALTER TABLE public.asset_car OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16766)
-- Name: asset_car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asset_car ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asset_car_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 16793)
-- Name: asset_flat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_flat (
    id integer NOT NULL,
    user_id integer,
    title character varying(20),
    description text,
    cost money,
    date date,
    location character varying(30),
    acquisition character varying(20)
);


ALTER TABLE public.asset_flat OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16792)
-- Name: asset_flat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asset_flat ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asset_flat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16780)
-- Name: asset_jewelery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_jewelery (
    id integer NOT NULL,
    user_id integer,
    title character varying(20),
    description text,
    cost money,
    acquisition character varying(20),
    weight numeric
);


ALTER TABLE public.asset_jewelery OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16779)
-- Name: asset_jewelery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asset_jewelery ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asset_jewelery_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16754)
-- Name: asset_plot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_plot (
    id bigint NOT NULL,
    user_id integer,
    type character varying(20),
    description text,
    cost money,
    date date,
    acquisition character varying(20),
    location text
);


ALTER TABLE public.asset_plot OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16753)
-- Name: asset_plot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asset_plot ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asset_plot_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16717)
-- Name: credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credentials (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);


ALTER TABLE public.credentials OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16741)
-- Name: expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense (
    id bigint NOT NULL,
    user_id integer,
    type character varying(20),
    amount money,
    description text,
    date date
);


ALTER TABLE public.expense OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16740)
-- Name: expense_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.expense ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expense_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 16871)
-- Name: file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file (
    id integer NOT NULL,
    user_id integer,
    link text,
    date date,
    amount money,
    trx_id character varying(30)
);


ALTER TABLE public.file OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16870)
-- Name: file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.file ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16730)
-- Name: income; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.income (
    id bigint NOT NULL,
    user_id integer,
    is_salary boolean,
    type character varying(20),
    title character varying(20),
    date date,
    recurrence character varying(10),
    amount money,
    profit money,
    exempted_amount money
);


ALTER TABLE public.income OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16729)
-- Name: income_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.income ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.income_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 16843)
-- Name: investment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investment (
    id integer NOT NULL,
    user_id integer,
    title character varying(30),
    amount money,
    date date
);


ALTER TABLE public.investment OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16842)
-- Name: investment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.investment ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 242 (class 1259 OID 16855)
-- Name: rule_investment_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_investment_type (
    id integer NOT NULL,
    title character varying(30),
    rate_rebate numeric,
    min_amount money,
    description text,
    max_amount money
);


ALTER TABLE public.rule_investment_type OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16854)
-- Name: investment_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_investment_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.investment_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 16817)
-- Name: liability_bank_loan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liability_bank_loan (
    id integer NOT NULL,
    user_id integer,
    bank_name character varying(20),
    account character varying(30),
    interest numeric,
    amount money,
    remaining money
);


ALTER TABLE public.liability_bank_loan OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16816)
-- Name: liability_bank_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.liability_bank_loan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.liability_bank_loan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 16830)
-- Name: liability_person_loan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.liability_person_loan (
    id integer NOT NULL,
    user_id integer,
    lender_name character varying(50),
    lender_nid character varying(20),
    amount money,
    remaining money,
    interest numeric
);


ALTER TABLE public.liability_person_loan OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16829)
-- Name: liability_person_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.liability_person_loan ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.liability_person_loan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 258 (class 1259 OID 16920)
-- Name: user_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_log (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    item_table_name character varying(30),
    action character varying(30),
    details character varying(40),
    item_id text
);


ALTER TABLE public.user_log OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 16919)
-- Name: log_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.log_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 16947)
-- Name: rule_expense_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_expense_category (
    id integer NOT NULL,
    name character varying(20)
);


ALTER TABLE public.rule_expense_category OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 16946)
-- Name: rule_expense_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_expense_category ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_expense_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 16884)
-- Name: rule_income; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_income (
    id integer NOT NULL,
    category character varying(12),
    slab_no integer,
    slab_length money,
    tax_rate numeric
);


ALTER TABLE public.rule_income OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 16892)
-- Name: rule_income_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_income_category (
    id integer NOT NULL,
    name character varying(20)
);


ALTER TABLE public.rule_income_category OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16891)
-- Name: rule_income_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_income_category ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_income_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 247 (class 1259 OID 16883)
-- Name: rule_income_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_income ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_income_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 260 (class 1259 OID 16931)
-- Name: rule_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_log (
    id bigint NOT NULL,
    rule_table_name character varying(20),
    rule_id integer,
    rule_column_name character varying(20),
    old_value character varying(30),
    new_value character varying(30),
    change_date date
);


ALTER TABLE public.rule_log OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 16930)
-- Name: rule_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 16904)
-- Name: rule_rebate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_rebate (
    id integer NOT NULL,
    max_rebate_amount money,
    max_of_income numeric
);


ALTER TABLE public.rule_rebate OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16903)
-- Name: rule_rebate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_rebate ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_rebate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 16914)
-- Name: rule_tax_area_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_tax_area_list (
    id integer NOT NULL,
    area_name character varying(20),
    zone_no integer,
    circle_no integer
);


ALTER TABLE public.rule_tax_area_list OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16913)
-- Name: rule_tax_area_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_tax_area_list ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_tax_area_list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 252 (class 1259 OID 16898)
-- Name: rule_tax_zone_min_tax; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rule_tax_zone_min_tax (
    id integer NOT NULL,
    area_name character varying(20),
    min_amount money
);


ALTER TABLE public.rule_tax_zone_min_tax OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16897)
-- Name: rule_tax_zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rule_tax_zone_min_tax ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rule_tax_zone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 16707)
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    phone character varying(15),
    nid character varying(17),
    dob date,
    spouse_name character varying(50),
    spouse_tin character varying(12)
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16702)
-- Name: user_tax_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tax_info (
    id integer NOT NULL,
    tin character varying(12),
    is_resident boolean,
    is_ff boolean,
    is_female boolean,
    is_disabled boolean,
    tax_zone integer,
    tax_circle integer,
    area_name character varying(20)
);


ALTER TABLE public.user_tax_info OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16701)
-- Name: user_tax_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_tax_info ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_tax_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5098 (class 0 OID 16863)
-- Dependencies: 244
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admin (id, name, email, nid, password_hash) OVERRIDING SYSTEM VALUE VALUES (1, 'nabila', 'nabila@gmail.com', '12345678990', 'Pn78aRt5@adg&Gh');
INSERT INTO public.admin (id, name, email, nid, password_hash) OVERRIDING SYSTEM VALUE VALUES (2, 'azmal', 'azmal@gmail.com', '43245682135', 'Gb^4fg5SJi98Lo');
INSERT INTO public.admin (id, name, email, nid, password_hash) OVERRIDING SYSTEM VALUE VALUES (3, 'tausif', 'tausif@gmail.com', '45893217536', 'Bn87MNre2@asdE');


--
-- TOC entry 5088 (class 0 OID 16806)
-- Dependencies: 234
-- Data for Name: asset_bank_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (78, 16, '2567896431572012', '£24,274.05', 'Agrani Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (79, 16, '4460040152638134', '£41,127.82', 'Prime Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (80, 16, '0026827630353783', '£1,485.51', 'Agrani Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (81, 2, '7796321268206057', '£22,956.12', 'Pubali Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (82, 2, '7951048631225552', '£40,792.68', 'Rupali Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (83, 3, '9664728888354144', '£21,084.94', 'IFIC Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (84, 3, '7313033390165633', '£22,789.03', 'Agrani Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (85, 3, '0564769139163237', '£20,313.48', 'Sonali Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (86, 4, '4553955069526094', '£47,105.58', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (87, 4, '9336249208530146', '£18,328.60', 'Prime Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (88, 5, '2872124827136424', '£42,860.56', 'Sonali Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (89, 5, '5141846386899784', '£18,386.37', 'IFIC Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (90, 5, '5051754777202011', '£41,749.50', 'Janata Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (91, 6, '0182943906114421', '£29,520.30', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (92, 6, '8105245642974366', '£47,258.88', 'Agrani Bank', 'Current');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (93, 6, '3324201040169816', '£23,920.82', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (94, 7, '0714982762676919', '£18,811.24', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (95, 7, '6110241615843530', '£29,691.43', 'Agrani Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (96, 8, '3489205360401680', '£23,691.25', 'Prime Bank', 'Current');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (97, 8, '0415604300368175', '£41,436.76', 'IFIC Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (98, 9, '5030917687405916', '£32,485.89', 'Pubali Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (99, 9, '0278354827456160', '£20,414.60', 'Prime Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (100, 9, '6290457140990351', '£27,772.73', 'Janata Bank', 'Current');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (101, 10, '4107891306389026', '£11,099.39', 'Agrani Bank', 'Current');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (102, 10, '5396495479975023', '£38,506.02', 'Agrani Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (103, 10, '9222406480728482', '£39,844.24', 'Pubali Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (104, 12, '7474444691540465', '£38,909.54', 'Prime Bank', 'Savings');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (105, 13, '6230780784902812', '£42,397.19', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (106, 13, '6425402806013014', '£47,977.94', 'Janata Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (107, 13, '9727285685639120', '£12,915.09', 'Pubali Bank', 'Checking');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (108, 15, '1005250593308671', '£29,678.15', 'IFIC Bank', 'Investment');
INSERT INTO public.asset_bank_account (id, user_id, account, amount, bank_name, title) OVERRIDING SYSTEM VALUE VALUES (109, 15, '0548660973894570', '£1,483.17', 'IFIC Bank', 'Investment');


--
-- TOC entry 5082 (class 0 OID 16767)
-- Dependencies: 228
-- Data for Name: asset_car; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (33, 16, 'Toyota Corolla', 1238, 'Used car in good condition with low mileage.', 'Sedan', '£11,459.73', 'Purchased', 'BB-00-BB00');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (34, 3, 'Honda Civic', 1330, 'Used car in good condition with low mileage.', 'Sedan', '£14,887.26', 'Purchased', 'EE-11-EE11');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (35, 4, 'Ford Mustang', 1375, 'Used car in good condition with low mileage.', 'SUV', '£16,586.00', 'Purchased', 'GG-22-GG22');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (36, 9, 'BMW 3 Series', 1454, 'Used car in good condition with low mileage.', 'SUV', '£19,548.41', 'Purchased', 'II-33-II33');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (37, 14, 'Mercedes C-Class', 1537, 'Used car in good condition with low mileage.', 'Coupe', '£22,662.44', 'Purchased', 'LL-44-LL44');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (38, 2, 'Tesla Model 3', 1609, 'Used car in good condition with low mileage.', 'Coupe', '£25,339.64', 'Leased', 'NN-55-NN55');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (39, 5, 'Hyundai Elantra', 1689, 'Used car in good condition with low mileage.', 'Hatchback', '£28,338.69', 'Leased', 'QQ-66-QQ66');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (40, 7, 'Hyundai Elantra', 1722, 'Used car in good condition with low mileage.', 'Hatchback', '£29,578.05', 'Leased', 'RR-66-RR66');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (41, 12, 'Hyundai Elantra', 1733, 'Used car in good condition with low mileage.', 'Hatchback', '£30,010.93', 'Leased', 'RR-66-RR66');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (42, 8, 'Hyundai Elantra', 1733, 'Used car in good condition with low mileage.', 'Hatchback', '£30,024.10', 'Leased', 'RR-66-RR66');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (43, 10, 'Volkswagen Golf', 1776, 'Used car in good condition with low mileage.', 'Hatchback', '£31,621.76', 'Leased', 'TT-77-TT77');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (44, 7, 'Volkswagen Golf', 1835, 'Used car in good condition with low mileage.', 'Hatchback', '£33,847.45', 'Leased', 'VV-77-VV77');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (45, 13, 'Audi A4', 1857, 'Used car in good condition with low mileage.', 'Convertible', '£34,645.49', 'Leased', 'VV-88-VV88');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (46, 11, 'Nissan Altima', 1927, 'Used car in good condition with low mileage.', 'Convertible', '£37,288.84', 'Leased', 'YY-99-YY99');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (47, 6, 'Nissan Altima', 1947, 'Used car in good condition with low mileage.', 'Convertible', '£38,049.80', 'Leased', 'YY-99-YY99');
INSERT INTO public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) OVERRIDING SYSTEM VALUE VALUES (48, 15, 'Nissan Altima', 1961, 'Used car in good condition with low mileage.', 'Convertible', '£38,559.85', 'Leased', 'ZZ-99-ZZ99');


--
-- TOC entry 5086 (class 0 OID 16793)
-- Dependencies: 232
-- Data for Name: asset_flat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (17, 16, 'Residence', 'A residential flat located in Barisal, well-maintained with modern amenities.', '£14,713,511.14', '2021-10-19', 'Barisal', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (18, 16, 'Apartment', 'A residential flat located in Khulna, well-maintained with modern amenities.', '£6,016,669.17', '2022-02-26', 'Khulna', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (19, 3, 'Condo', 'A residential flat located in Dhaka, well-maintained with modern amenities.', '£5,690,443.45', '2023-05-19', 'Dhaka', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (20, 3, 'Apartment', 'A residential flat located in Chittagong, well-maintained with modern amenities.', '£20,226,195.93', '2024-02-17', 'Chittagong', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (21, 4, 'Apartment', 'A residential flat located in Rajshahi, well-maintained with modern amenities.', '£23,168,022.54', '2021-01-05', 'Rajshahi', 'Purchased');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (22, 4, 'Residence', 'A residential flat located in Mymensingh, well-maintained with modern amenities.', '£24,779,754.88', '2020-07-06', 'Mymensingh', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (23, 5, 'Apartment', 'A residential flat located in Dhaka, well-maintained with modern amenities.', '£20,770,081.33', '2021-01-23', 'Dhaka', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (24, 6, 'Residence', 'A residential flat located in Barisal, well-maintained with modern amenities.', '£17,582,686.80', '2023-03-12', 'Barisal', 'Purchased');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (25, 7, 'Apartment', 'A residential flat located in Sylhet, well-maintained with modern amenities.', '£22,613,646.45', '2020-03-23', 'Sylhet', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (26, 8, 'Flat', 'A residential flat located in Sylhet, well-maintained with modern amenities.', '£9,351,452.21', '2024-05-03', 'Sylhet', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (27, 8, 'Condo', 'A residential flat located in Sylhet, well-maintained with modern amenities.', '£22,430,099.28', '2021-05-04', 'Sylhet', 'Purchased');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (28, 9, 'Residence', 'A residential flat located in Khulna, well-maintained with modern amenities.', '£10,753,703.75', '2020-06-17', 'Khulna', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (29, 10, 'Condo', 'A residential flat located in Barisal, well-maintained with modern amenities.', '£15,671,257.91', '2020-04-08', 'Barisal', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (30, 10, 'Condo', 'A residential flat located in Dhaka, well-maintained with modern amenities.', '£12,606,741.63', '2023-07-15', 'Dhaka', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (31, 11, 'Flat', 'A residential flat located in Barisal, well-maintained with modern amenities.', '£19,064,558.46', '2021-08-30', 'Barisal', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (32, 11, 'Condo', 'A residential flat located in Rajshahi, well-maintained with modern amenities.', '£15,194,305.44', '2023-12-18', 'Rajshahi', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (33, 12, 'Residence', 'A residential flat located in Khulna, well-maintained with modern amenities.', '£5,019,832.77', '2024-04-09', 'Khulna', 'Gifted');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (34, 12, 'Apartment', 'A residential flat located in Barisal, well-maintained with modern amenities.', '£16,002,360.07', '2024-04-19', 'Barisal', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (35, 13, 'Flat', 'A residential flat located in Rajshahi, well-maintained with modern amenities.', '£10,808,884.43', '2021-11-03', 'Rajshahi', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (36, 14, 'Flat', 'A residential flat located in Rangpur, well-maintained with modern amenities.', '£14,359,100.52', '2021-08-05', 'Rangpur', 'Inherited');
INSERT INTO public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) OVERRIDING SYSTEM VALUE VALUES (37, 15, 'Condo', 'A residential flat located in Rangpur, well-maintained with modern amenities.', '£15,591,139.97', '2021-11-25', 'Rangpur', 'Gifted');


--
-- TOC entry 5084 (class 0 OID 16780)
-- Dependencies: 230
-- Data for Name: asset_jewelery; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (1, 3, 'Gold Chain', 'A high-quality piece of jewelery made of gold, suitable for special occasions.', '£14,381.15', 'Purchased', 2.10);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (2, 11, 'Diamond Ring', 'A high-quality piece of jewelery made of gold, suitable for special occasions.', '£30,976.47', 'Purchased', 6.24);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (3, 13, 'Diamond Ring', 'A high-quality piece of jewelery made of gold, suitable for special occasions.', '£34,267.40', 'Purchased', 7.07);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (4, 8, 'Diamond Ring', 'A high-quality piece of jewelery made of silver, suitable for special occasions.', '£46,023.93', 'Purchased', 10.01);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (5, 16, 'Silver Earrings', 'A high-quality piece of jewelery made of silver, suitable for special occasions.', '£57,857.32', 'Purchased', 12.96);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (6, 9, 'Silver Earrings', 'A high-quality piece of jewelery made of silver, suitable for special occasions.', '£58,353.80', 'Purchased', 13.09);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (7, 8, 'Silver Earrings', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£63,137.61', 'Gifted', 14.28);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (8, 8, 'Silver Earrings', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£63,609.39', 'Gifted', 14.40);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (9, 14, 'Silver Earrings', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£67,941.64', 'Gifted', 15.49);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (10, 12, 'Silver Earrings', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£68,521.80', 'Gifted', 15.63);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (11, 14, 'Platinum Bracelet', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£72,713.20', 'Gifted', 16.68);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (12, 2, 'Platinum Bracelet', 'A high-quality piece of jewelery made of platinum, suitable for special occasions.', '£75,798.31', 'Gifted', 17.45);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (13, 10, 'Ruby Pendant', 'A high-quality piece of jewelery made of pearl, suitable for special occasions.', '£111,161.53', 'Inherited', 26.29);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (14, 11, 'Ruby Pendant', 'A high-quality piece of jewelery made of pearl, suitable for special occasions.', '£126,304.70', 'Inherited', 30.08);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (15, 14, 'Ruby Pendant', 'A high-quality piece of jewelery made of pearl, suitable for special occasions.', '£126,371.74', 'Inherited', 30.09);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (16, 13, 'Emerald Ring', 'A high-quality piece of jewelery made of ruby, suitable for special occasions.', '£137,326.47', 'Inherited', 32.83);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (17, 4, 'Emerald Ring', 'A high-quality piece of jewelery made of ruby, suitable for special occasions.', '£145,011.85', 'Inherited', 34.75);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (18, 9, 'Emerald Ring', 'A high-quality piece of jewelery made of ruby, suitable for special occasions.', '£147,769.26', 'Inherited', 35.44);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (19, 12, 'Emerald Ring', 'A high-quality piece of jewelery made of ruby, suitable for special occasions.', '£148,878.93', 'Inherited', 35.72);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (20, 10, 'Gold Bangle', 'A high-quality piece of jewelery made of emerald, suitable for special occasions.', '£161,142.21', 'Handmade', 38.79);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (21, 5, 'Gold Bangle', 'A high-quality piece of jewelery made of emerald, suitable for special occasions.', '£161,591.37', 'Handmade', 38.90);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (22, 15, 'Gold Bangle', 'A high-quality piece of jewelery made of emerald, suitable for special occasions.', '£168,874.43', 'Handmade', 40.72);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (23, 9, 'Diamond Studs', 'A high-quality piece of jewelery made of emerald, suitable for special occasions.', '£178,898.21', 'Handmade', 43.22);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (24, 3, 'Diamond Studs', 'A high-quality piece of jewelery made of jade, suitable for special occasions.', '£188,958.83', 'Handmade', 45.74);
INSERT INTO public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) OVERRIDING SYSTEM VALUE VALUES (25, 10, 'Jade Brooch', 'A high-quality piece of jewelery made of jade, suitable for special occasions.', '£191,113.94', 'Handmade', 46.28);


--
-- TOC entry 5080 (class 0 OID 16754)
-- Dependencies: 226
-- Data for Name: asset_plot; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (1, 2, 'Commercial', 'Land plot located in Dhaka, suitable for commercial use.', '£18,826,904.31', '2011-01-05', 'Purchased', 'Dhaka');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (2, 2, 'Residential', 'Land plot located in Khulna, suitable for residential use.', '£30,448,756.15', '2013-06-24', 'Purchased', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (3, 3, 'Commercial', 'Land plot located in Mymensingh, suitable for commercial use.', '£22,165,325.22', '2014-01-19', 'Gifted', 'Mymensingh');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (4, 3, 'Commercial', 'Land plot located in Khulna, suitable for commercial use.', '£27,588,215.54', '2011-05-07', 'Gifted', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (5, 4, 'Industrial', 'Land plot located in Rangpur, suitable for industrial use.', '£33,999,907.29', '2012-07-01', 'Gifted', 'Rangpur');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (6, 4, 'Residential', 'Land plot located in Dhaka, suitable for residential use.', '£36,069,812.78', '2015-09-21', 'Leased', 'Dhaka');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (7, 5, 'Industrial', 'Land plot located in Dhaka, suitable for industrial use.', '£52,386,172.90', '2014-04-19', 'Leased', 'Dhaka');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (8, 5, 'Industrial', 'Land plot located in Chittagong, suitable for industrial use.', '£19,825,146.93', '2019-01-29', 'Inherited', 'Chittagong');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (9, 6, 'Industrial', 'Land plot located in Rangpur, suitable for industrial use.', '£51,675,076.94', '2011-02-06', 'Gifted', 'Rangpur');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (10, 6, 'Agricultural', 'Land plot located in Rangpur, suitable for agricultural use.', '£21,542,101.19', '2016-02-19', 'Inherited', 'Rangpur');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (11, 7, 'Agricultural', 'Land plot located in Rajshahi, suitable for agricultural use.', '£42,924,322.32', '2016-03-23', 'Gifted', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (12, 7, 'Industrial', 'Land plot located in Barisal, suitable for industrial use.', '£13,210,408.01', '2011-06-15', 'Gifted', 'Barisal');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (13, 8, 'Commercial', 'Land plot located in Mymensingh, suitable for commercial use.', '£7,210,381.77', '2016-12-30', 'Purchased', 'Mymensingh');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (14, 8, 'Residential', 'Land plot located in Mymensingh, suitable for residential use.', '£10,232,761.49', '2016-10-30', 'Gifted', 'Mymensingh');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (15, 9, 'Industrial', 'Land plot located in Khulna, suitable for industrial use.', '£36,595,921.75', '2017-10-23', 'Purchased', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (16, 9, 'Agricultural', 'Land plot located in Rajshahi, suitable for agricultural use.', '£41,269,241.23', '2012-02-23', 'Purchased', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (17, 10, 'Industrial', 'Land plot located in Rajshahi, suitable for industrial use.', '£6,622,277.85', '2018-12-16', 'Inherited', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (18, 10, 'Industrial', 'Land plot located in Sylhet, suitable for industrial use.', '£9,781,288.97', '2011-09-19', 'Gifted', 'Sylhet');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (19, 11, 'Residential', 'Land plot located in Khulna, suitable for residential use.', '£48,954,220.78', '2015-08-17', 'Inherited', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (20, 11, 'Agricultural', 'Land plot located in Rajshahi, suitable for agricultural use.', '£37,553,214.30', '2017-03-13', 'Inherited', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (21, 12, 'Industrial', 'Land plot located in Khulna, suitable for industrial use.', '£15,090,780.58', '2013-01-26', 'Leased', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (22, 12, 'Industrial', 'Land plot located in Barisal, suitable for industrial use.', '£42,663,981.08', '2019-12-23', 'Leased', 'Barisal');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (23, 13, 'Residential', 'Land plot located in Barisal, suitable for residential use.', '£52,085,086.15', '2017-11-23', 'Purchased', 'Barisal');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (24, 13, 'Residential', 'Land plot located in Rajshahi, suitable for residential use.', '£17,051,684.96', '2013-06-22', 'Purchased', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (25, 14, 'Agricultural', 'Land plot located in Barisal, suitable for agricultural use.', '£12,004,891.50', '2017-03-30', 'Gifted', 'Barisal');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (26, 14, 'Residential', 'Land plot located in Rajshahi, suitable for residential use.', '£49,417,737.74', '2014-04-09', 'Inherited', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (27, 15, 'Residential', 'Land plot located in Rangpur, suitable for residential use.', '£24,365,513.77', '2012-11-04', 'Leased', 'Rangpur');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (28, 15, 'Residential', 'Land plot located in Rajshahi, suitable for residential use.', '£11,665,746.28', '2019-06-14', 'Leased', 'Rajshahi');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (29, 16, 'Agricultural', 'Land plot located in Khulna, suitable for agricultural use.', '£30,851,257.67', '2012-03-12', 'Inherited', 'Khulna');
INSERT INTO public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) OVERRIDING SYSTEM VALUE VALUES (30, 16, 'Residential', 'Land plot located in Rangpur, suitable for residential use.', '£24,822,404.19', '2013-09-23', 'Inherited', 'Rangpur');


--
-- TOC entry 5074 (class 0 OID 16717)
-- Dependencies: 220
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.credentials (id, email, password_hash, role) VALUES (3, 'abul@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (4, 'adibah@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (5, 'kabul@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (6, 'arpita@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (7, 'toufik@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (8, 'fairuz@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (9, 'kowshik@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (10, 'swastika@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (11, 'tanim@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (12, 'shovon@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (13, 'soumik@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (14, 'rifat@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (15, 'gourab@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (16, 'rafia@example.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');
INSERT INTO public.credentials (id, email, password_hash, role) VALUES (2, 'abc@yahoo.com', '$2a$10$XwjEvTlS5zLJmXeJZh7ZkeRalr9HDIbkLHswFUM9FD7cA7CRnTksS', 'user');


--
-- TOC entry 5078 (class 0 OID 16741)
-- Dependencies: 224
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (1, 12, 'utilities', '£56.04', 'Sample expense #4 for user 12', '2024-08-02');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (2, 15, 'utilities', '£61.84', 'Sample expense #2 for user 15', '2024-08-03');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (3, 2, 'utilities', '£81.90', 'Sample expense #5 for user 2', '2024-08-07');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (4, 9, 'utilities', '£112.67', 'Sample expense #5 for user 9', '2024-08-12');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (5, 3, 'utilities', '£117.50', 'Sample expense #2 for user 3', '2024-08-13');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (6, 4, 'utilities', '£125.59', 'Sample expense #5 for user 4', '2024-08-15');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (7, 12, 'utilities', '£131.07', 'Sample expense #1 for user 12', '2024-08-16');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (8, 9, 'utilities', '£131.40', 'Sample expense #2 for user 9', '2024-08-16');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (9, 8, 'utilities', '£133.88', 'Sample expense #5 for user 8', '2024-08-16');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (10, 13, 'utilities', '£146.58', 'Sample expense #3 for user 13', '2024-08-18');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (11, 5, 'utilities', '£146.76', 'Sample expense #2 for user 5', '2024-08-18');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (12, 5, 'utilities', '£158.08', 'Sample expense #4 for user 5', '2024-08-20');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (13, 16, 'utilities', '£165.11', 'Sample expense #3 for user 16', '2024-08-22');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (14, 6, 'transportation', '£177.55', 'Sample expense #1 for user 6', '2024-08-24');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (15, 7, 'transportation', '£184.04', 'Sample expense #5 for user 7', '2024-08-25');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (16, 11, 'transportation', '£195.65', 'Sample expense #5 for user 11', '2024-08-27');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (17, 3, 'transportation', '£217.31', 'Sample expense #3 for user 3', '2024-08-31');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (18, 14, 'transportation', '£252.32', 'Sample expense #1 for user 14', '2024-09-06');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (19, 5, 'transportation', '£270.99', 'Sample expense #1 for user 5', '2024-09-10');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (20, 6, 'transportation', '£281.62', 'Sample expense #3 for user 6', '2024-09-12');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (21, 7, 'transportation', '£287.65', 'Sample expense #1 for user 7', '2024-09-13');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (22, 12, 'education', '£308.80', 'Sample expense #3 for user 12', '2024-09-17');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (23, 3, 'education', '£323.08', 'Sample expense #4 for user 3', '2024-09-19');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (24, 15, 'education', '£329.92', 'Sample expense #1 for user 15', '2024-09-20');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (25, 10, 'education', '£330.57', 'Sample expense #4 for user 10', '2024-09-21');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (26, 10, 'education', '£345.12', 'Sample expense #5 for user 10', '2024-09-23');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (27, 8, 'education', '£358.14', 'Sample expense #4 for user 8', '2024-09-25');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (28, 12, 'education', '£362.91', 'Sample expense #5 for user 12', '2024-09-26');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (29, 11, 'education', '£366.84', 'Sample expense #4 for user 11', '2024-09-27');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (30, 8, 'education', '£370.18', 'Sample expense #1 for user 8', '2024-09-28');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (31, 13, 'education', '£374.08', 'Sample expense #5 for user 13', '2024-09-28');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (32, 13, 'education', '£378.03', 'Sample expense #4 for user 13', '2024-09-29');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (33, 6, 'education', '£384.98', 'Sample expense #4 for user 6', '2024-09-30');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (34, 6, 'education', '£392.61', 'Sample expense #5 for user 6', '2024-10-02');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (35, 13, 'education', '£396.16', 'Sample expense #2 for user 13', '2024-10-02');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (36, 14, 'education', '£409.31', 'Sample expense #5 for user 14', '2024-10-05');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (37, 8, 'education', '£412.09', 'Sample expense #3 for user 8', '2024-10-05');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (38, 7, 'education', '£415.61', 'Sample expense #3 for user 7', '2024-10-06');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (39, 15, 'education', '£416.40', 'Sample expense #5 for user 15', '2024-10-06');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (40, 8, 'tds', '£428.59', 'Sample expense #2 for user 8', '2024-10-08');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (41, 11, 'tds', '£431.25', 'Sample expense #1 for user 11', '2024-10-09');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (42, 16, 'tds', '£451.69', 'Sample expense #4 for user 16', '2024-10-12');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (43, 16, 'tds', '£463.91', 'Sample expense #2 for user 16', '2024-10-15');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (44, 10, 'tds', '£475.42', 'Sample expense #2 for user 10', '2024-10-17');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (45, 15, 'tds', '£524.81', 'Sample expense #4 for user 15', '2024-10-25');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (46, 2, 'tds', '£525.87', 'Sample expense #4 for user 2', '2024-10-26');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (47, 12, 'rent', '£587.16', 'Sample expense #2 for user 12', '2024-11-06');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (48, 6, 'rent', '£596.72', 'Sample expense #2 for user 6', '2024-11-07');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (49, 4, 'rent', '£611.06', 'Sample expense #2 for user 4', '2024-11-10');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (50, 4, 'rent', '£637.89', 'Sample expense #4 for user 4', '2024-11-15');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (51, 3, 'rent', '£653.10', 'Sample expense #5 for user 3', '2024-11-18');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (52, 3, 'rent', '£673.06', 'Sample expense #1 for user 3', '2024-11-21');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (53, 15, 'healthcare', '£691.08', 'Sample expense #3 for user 15', '2024-11-24');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (54, 14, 'healthcare', '£696.85', 'Sample expense #4 for user 14', '2024-11-25');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (55, 10, 'healthcare', '£702.35', 'Sample expense #3 for user 10', '2024-11-26');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (56, 11, 'healthcare', '£727.98', 'Sample expense #3 for user 11', '2024-12-01');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (57, 7, 'healthcare', '£741.65', 'Sample expense #2 for user 7', '2024-12-03');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (58, 4, 'healthcare', '£758.88', 'Sample expense #3 for user 4', '2024-12-07');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (59, 14, 'entertainment', '£812.70', 'Sample expense #2 for user 14', '2024-12-16');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (60, 9, 'entertainment', '£835.76', 'Sample expense #3 for user 9', '2024-12-20');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (61, 10, 'entertainment', '£855.01', 'Sample expense #1 for user 10', '2024-12-24');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (62, 16, 'entertainment', '£872.40', 'Sample expense #5 for user 16', '2024-12-27');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (63, 16, 'entertainment', '£881.40', 'Sample expense #1 for user 16', '2024-12-29');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (64, 11, 'entertainment', '£894.18', 'Sample expense #2 for user 11', '2024-12-31');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (65, 9, 'entertainment', '£897.57', 'Sample expense #1 for user 9', '2025-01-01');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (66, 2, 'entertainment', '£921.20', 'Sample expense #1 for user 2', '2025-01-05');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (67, 2, 'other', '£925.60', 'Sample expense #3 for user 2', '2025-01-06');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (68, 2, 'other', '£931.30', 'Sample expense #2 for user 2', '2025-01-07');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (69, 4, 'other', '£947.13', 'Sample expense #1 for user 4', '2025-01-09');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (70, 7, 'other', '£973.40', 'Sample expense #4 for user 7', '2025-01-14');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (71, 5, 'other', '£989.40', 'Sample expense #3 for user 5', '2025-01-17');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (72, 13, 'other', '£990.03', 'Sample expense #1 for user 13', '2025-01-17');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (73, 14, 'other', '£993.93', 'Sample expense #3 for user 14', '2025-01-18');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (74, 5, 'other', '£1,005.79', 'Sample expense #5 for user 5', '2025-01-20');
INSERT INTO public.expense (id, user_id, type, amount, description, date) OVERRIDING SYSTEM VALUE VALUES (75, 9, 'other', '£1,045.56', 'Sample expense #4 for user 9', '2025-01-27');


--
-- TOC entry 5100 (class 0 OID 16871)
-- Dependencies: 246
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5076 (class 0 OID 16730)
-- Dependencies: 222
-- Data for Name: income; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (2, 16, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£50,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (3, 16, false, 'rent', 'Rent from flat_A', '2025-01-10', 'monthly', '£20,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (4, 16, false, 'interest', 'Shanchaypotro', '2024-12-05', 'monthly', '£2,500.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (5, 16, false, 'interest', 'From loan', '2025-01-23', NULL, '£3,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (6, 16, true, 'salary', 'December Pay', '2024-12-01', 'monthly', '£50,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (7, 2, false, 'agriculture', 'Jute Field', '2025-01-13', NULL, '£80,000.00', '£20,000.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (8, 2, false, 'rent', 'from flat_b', '2025-01-17', 'monthly', '£15,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (9, 2, false, 'rent', 'from flat_b', '2024-12-17', 'monthly', '£15,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (10, 2, false, 'gift', 'from user_13', '2024-11-29', NULL, '£15,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (11, 3, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£52,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (12, 3, false, 'interest', 'from user_12 loan', '2025-01-23', NULL, '£5,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (13, 3, false, 'rent', 'from flat_c', '2025-01-23', 'monthly', '£5,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (14, 3, true, 'salary', 'December Pay', '2024-12-01', 'monthly', '£52,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (15, 4, false, 'rent', 'Flat Rent', '2025-01-10', 'monthly', '£25,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (16, 4, true, 'salary', 'january pay', '2025-01-10', 'monthly', '£25,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (17, 4, false, 'agriculture', 'paddy field', '2025-01-10', NULL, '£250,000.00', '£100,000.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (18, 5, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£48,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (19, 5, true, 'salary', 'December Pay', '2024-12-01', 'monthly', '£48,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (20, 5, true, 'salary', 'November Pay', '2024-11-01', 'monthly', '£48,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (21, 5, true, 'salary', 'October Pay', '2024-10-01', 'monthly', '£48,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (22, 6, false, 'interest', 'from shanchaypatra', '2025-01-20', 'monthly', '£10,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (23, 7, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£53,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (24, 8, false, 'agriculture', 'mango garden', '2025-01-15', NULL, '£70,000.00', '£7,000.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (25, 9, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£51,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (26, 10, false, 'rent', 'field X rent', '2025-01-10', 'yearly', '£90,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (27, 11, true, 'salary', 'january Pay', '2025-01-01', 'monthly', '£55,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (28, 12, false, 'interest', 'interest from fdr', '2025-01-20', NULL, '£6,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (29, 13, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£56,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (30, 14, false, 'gift', 'Wedding Gift', '2025-06-10', NULL, '£150,000.00', '£0.00', '£0.00');
INSERT INTO public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) OVERRIDING SYSTEM VALUE VALUES (31, 15, true, 'salary', 'January Pay', '2025-01-01', 'monthly', '£57,000.00', '£0.00', '£0.00');


--
-- TOC entry 5094 (class 0 OID 16843)
-- Dependencies: 240
-- Data for Name: investment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (30, 14, 'Zakat Fund', '£88,953.02', '2018-03-03');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (31, 5, 'Zakat Fund', '£110,843.87', '2018-03-22');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (32, 12, 'Zakat Fund', '£140,347.11', '2018-04-17');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (33, 10, 'Zakat Fund', '£185,204.20', '2018-05-27');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (34, 8, 'Zakat Fund', '£205,027.10', '2018-06-13');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (35, 7, 'Zakat Fund', '£205,292.83', '2018-06-13');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (36, 13, 'Zakat Fund', '£229,227.26', '2018-07-04');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (37, 16, 'Zakat Fund', '£231,836.52', '2018-07-07');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (38, 12, 'Zakat Fund', '£271,471.25', '2018-08-11');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (39, 14, 'Zakat Fund', '£310,245.54', '2018-09-14');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (40, 3, 'Zakat Fund', '£393,217.71', '2018-11-26');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (41, 14, 'Zakat Fund', '£469,587.01', '2019-02-01');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (42, 7, 'Zakat Fund', '£517,462.04', '2019-03-15');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (43, 2, 'Zakat Fund', '£556,520.55', '2019-04-19');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (44, 10, 'Zakat Fund', '£581,128.61', '2019-05-10');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (45, 9, 'FDR', '£631,335.51', '2019-06-24');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (46, 5, 'FDR', '£800,246.84', '2019-11-19');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (47, 13, 'FDR', '£814,114.38', '2019-12-02');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (48, 3, 'FDR', '£834,378.65', '2019-12-19');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (49, 9, 'FDR', '£930,920.27', '2020-03-14');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (50, 14, 'FDR', '£964,127.16', '2020-04-12');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (51, 3, 'FDR', '£983,881.84', '2020-04-29');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (52, 11, 'FDR', '£1,071,885.82', '2020-07-16');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (53, 12, 'FDR', '£1,135,928.29', '2020-09-10');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (54, 11, 'Family Shanchaypatra', '£1,214,228.17', '2020-11-18');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (55, 12, 'Family Shanchaypatra', '£1,247,985.86', '2020-12-18');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (56, 16, 'Family Shanchaypatra', '£1,444,250.46', '2021-06-09');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (57, 6, 'Family Shanchaypatra', '£1,489,339.48', '2021-07-19');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (58, 16, 'Family Shanchaypatra', '£1,490,894.49', '2021-07-20');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (59, 6, 'Family Shanchaypatra', '£1,511,190.44', '2021-08-07');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (60, 6, 'Family Shanchaypatra', '£1,530,403.28', '2021-08-24');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (61, 5, 'Family Shanchaypatra', '£1,609,042.48', '2021-11-01');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (62, 15, 'Family Shanchaypatra', '£1,610,745.42', '2021-11-03');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (63, 6, 'Family Shanchaypatra', '£1,656,274.51', '2021-12-13');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (64, 9, 'Family Shanchaypatra', '£1,702,023.75', '2022-01-22');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (65, 7, '3-Month Shanchaypatra', '£1,925,986.24', '2022-08-07');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (66, 10, '3-Month Shanchaypatra', '£1,967,928.42', '2022-09-13');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (67, 16, '3-Month Shanchaypatra', '£1,984,162.09', '2022-09-27');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (68, 6, '3-Month Shanchaypatra', '£2,062,152.49', '2022-12-05');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (69, 7, '3-Month Shanchaypatra', '£2,062,888.89', '2022-12-06');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (70, 15, '3-Month Shanchaypatra', '£2,126,793.66', '2023-01-31');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (71, 4, '3-Month Shanchaypatra', '£2,144,390.39', '2023-02-16');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (72, 13, '3-Month Shanchaypatra', '£2,210,429.64', '2023-04-15');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (73, 2, '3-Month Shanchaypatra', '£2,218,197.64', '2023-04-22');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (74, 5, '3-Month Shanchaypatra', '£2,224,649.95', '2023-04-27');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (75, 15, '3-Month Shanchaypatra', '£2,234,932.61', '2023-05-06');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (76, 11, '3-Month Shanchaypatra', '£2,300,664.96', '2023-07-03');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (77, 15, '3-Month Shanchaypatra', '£2,303,302.11', '2023-07-06');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (78, 2, '5-Years Shanchaypatra', '£2,360,830.42', '2023-08-25');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (79, 4, '5-Years Shanchaypatra', '£2,377,701.50', '2023-09-09');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (80, 11, '5-Years Shanchaypatra', '£2,400,738.77', '2023-09-30');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (81, 8, '5-Years Shanchaypatra', '£2,487,883.91', '2023-12-15');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (82, 5, '5-Years Shanchaypatra', '£2,502,856.21', '2023-12-28');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (83, 3, '5-Years Shanchaypatra', '£2,627,035.42', '2024-04-16');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (84, 12, '5-Years Shanchaypatra', '£2,771,831.17', '2024-08-21');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (85, 10, '5-Years Shanchaypatra', '£2,831,383.30', '2024-10-13');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (86, 7, '5-Years Shanchaypatra', '£2,857,599.71', '2024-11-05');
INSERT INTO public.investment (id, user_id, title, amount, date) OVERRIDING SYSTEM VALUE VALUES (87, 4, '5-Years Shanchaypatra', '£2,889,320.72', '2024-12-03');


--
-- TOC entry 5090 (class 0 OID 16817)
-- Dependencies: 236
-- Data for Name: liability_bank_loan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (1, 16, 'HSBC Bangladesh', '0000464476942544', 6.51, '£1,635,002.95', '£2,659,461.05');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (2, 2, 'EXIM Bank', '0000516126313645', 7.64, '£4,944,879.80', '£658,662.46');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (3, 3, 'Pubali Bank', '0000224024274553', 11.90, '£4,463,189.77', '£2,559,323.21');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (4, 4, 'City Bank', '0000478743196828', 6.46, '£3,046,181.46', '£427,381.78');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (5, 5, 'Janata Bank', '0000481425255843', 6.65, '£4,740,569.30', '£1,710,701.00');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (6, 6, 'HSBC Bangladesh', '0000822427617808', 10.95, '£2,838,461.49', '£3,511,074.36');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (7, 7, 'Shimanto Bank', '0000069183986951', 10.01, '£2,374,712.20', '£1,668,734.00');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (8, 8, 'Janata Bank', '0000003211679425', 11.14, '£4,958,485.35', '£2,038,697.73');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (9, 9, 'City Bank', '0000584254745986', 7.61, '£4,311,422.86', '£553,535.61');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (10, 10, 'Prime Bank', '0000355642443369', 8.40, '£5,310,997.14', '£566,186.34');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (11, 11, 'Agrani Bank', '0000951547753489', 4.24, '£4,271,869.48', '£462,513.64');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (12, 12, 'IFIC Bank', '0000909178254188', 9.26, '£3,809,907.67', '£1,721,197.59');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (13, 13, 'Agrani Bank', '0000890641644660', 4.41, '£3,819,610.29', '£3,017,231.09');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (14, 14, 'Pubali Bank', '0000804864306745', 11.80, '£3,261,699.84', '£2,390,294.63');
INSERT INTO public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) OVERRIDING SYSTEM VALUE VALUES (15, 15, 'BRAC Bank', '0000191933436218', 10.50, '£4,535,554.23', '£264,504.78');


--
-- TOC entry 5092 (class 0 OID 16830)
-- Dependencies: 238
-- Data for Name: liability_person_loan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (1, 16, 'kowshik', '3828596186677', '£452,044.27', '£342,775.74', 11.41);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (2, 3, 'tausif', '8577297384973', '£497,712.02', '£315,951.01', 8.22);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (3, 4, 'swastika', '3595174242776', '£416,265.35', '£70,791.20', 18.66);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (4, 5, 'kabul', '1117681048333', '£225,724.02', '£40,918.66', 16.57);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (5, 7, 'kabul', '6402679457202', '£178,905.99', '£9,927.99', 9.23);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (6, 8, 'tausif', '4926641150874', '£360,941.61', '£296,393.18', 13.71);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (7, 10, 'soumik', '9331599970970', '£457,321.21', '£162,800.92', 10.70);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (8, 12, 'soumik', '3530060823161', '£438,439.82', '£323,179.29', 14.53);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (9, 14, 'shovon', '3477241132867', '£447,280.53', '£358,793.68', 7.07);
INSERT INTO public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) OVERRIDING SYSTEM VALUE VALUES (10, 15, 'gourab', '4910883030302', '£474,734.45', '£221,195.02', 6.74);


--
-- TOC entry 5116 (class 0 OID 16947)
-- Dependencies: 262
-- Data for Name: rule_expense_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Groceries');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Utility');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Rent');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (4, 'Educational Expense');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (5, 'Medical Expense');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (6, 'Transportation');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (7, 'Clothing');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (8, 'Purchase');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (9, 'Donation');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (10, 'Groceries');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (11, 'Utility');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (12, 'Rent');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (13, 'Educational Expense');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (14, 'Medical Expense');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (15, 'Transportation');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (16, 'Clothing');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (17, 'Purchase');
INSERT INTO public.rule_expense_category (id, name) OVERRIDING SYSTEM VALUE VALUES (18, 'Donation');


--
-- TOC entry 5102 (class 0 OID 16884)
-- Dependencies: 248
-- Data for Name: rule_income; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (1, 'regular', 1, '£350,000.00', 0);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (2, 'regular', 2, '£100,000.00', 5);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (3, 'regular', 3, '£400,000.00', 10);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (4, 'regular', 4, '£500,000.00', 15);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (5, 'regular', 5, '£500,000.00', 20);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (6, 'regular', 6, '£2,147,483,647.00', 25);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (7, 'female', 1, '£400,000.00', 0);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (8, 'female', 2, '£100,000.00', 5);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (9, 'female', 3, '£400,000.00', 10);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (10, 'female', 4, '£500,000.00', 15);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (11, 'female', 5, '£500,000.00', 20);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (12, 'female', 6, '£2,147,483,647.00', 25);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (13, 'elderly', 1, '£400,000.00', 0);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (14, 'elderly', 2, '£100,000.00', 5);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (15, 'elderly', 3, '£400,000.00', 10);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (16, 'elderly', 4, '£500,000.00', 15);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (17, 'elderly', 5, '£500,000.00', 20);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (18, 'elderly', 6, '£2,147,483,647.00', 25);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (19, 'disabled', 1, '£475,000.00', 0);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (20, 'disabled', 2, '£100,000.00', 5);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (21, 'disabled', 3, '£400,000.00', 10);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (22, 'disabled', 4, '£500,000.00', 15);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (23, 'disabled', 5, '£500,000.00', 20);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (24, 'disabled', 6, '£2,147,483,647.00', 25);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (25, 'ff', 1, '£500,000.00', 0);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (26, 'ff', 2, '£100,000.00', 5);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (27, 'ff', 3, '£400,000.00', 10);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (28, 'ff', 4, '£500,000.00', 15);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (29, 'ff', 5, '£500,000.00', 20);
INSERT INTO public.rule_income (id, category, slab_no, slab_length, tax_rate) OVERRIDING SYSTEM VALUE VALUES (30, 'ff', 6, '£2,147,483,647.00', 25);


--
-- TOC entry 5104 (class 0 OID 16892)
-- Dependencies: 250
-- Data for Name: rule_income_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_income_category (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Salary');
INSERT INTO public.rule_income_category (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Rent');
INSERT INTO public.rule_income_category (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Agriculture');
INSERT INTO public.rule_income_category (id, name) OVERRIDING SYSTEM VALUE VALUES (4, 'Interest');
INSERT INTO public.rule_income_category (id, name) OVERRIDING SYSTEM VALUE VALUES (5, 'Gift');


--
-- TOC entry 5096 (class 0 OID 16855)
-- Dependencies: 242
-- Data for Name: rule_investment_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_investment_type (id, title, rate_rebate, min_amount, description, max_amount) OVERRIDING SYSTEM VALUE VALUES (1, '3 month Sanchaypatra', 15, '£100,000.00', 'Short-term government savings certificate for 3-month period.', '£1,000,000.00');
INSERT INTO public.rule_investment_type (id, title, rate_rebate, min_amount, description, max_amount) OVERRIDING SYSTEM VALUE VALUES (2, '6 month Sanchaypatra', 15, '£100,000.00', 'Short-term government savings certificate for 6-month period.', '£3,000,000.00');
INSERT INTO public.rule_investment_type (id, title, rate_rebate, min_amount, description, max_amount) OVERRIDING SYSTEM VALUE VALUES (3, '1 year Sanchaypatra', 15, '£100,000.00', 'Long-term government savings certificate for 12-month period.', '£4,500,000.00');
INSERT INTO public.rule_investment_type (id, title, rate_rebate, min_amount, description, max_amount) OVERRIDING SYSTEM VALUE VALUES (4, 'Zakat', 15, '£0.00', 'Donation to Zakat fund will help the poor of the country.', '£2,147,483,647.00');
INSERT INTO public.rule_investment_type (id, title, rate_rebate, min_amount, description, max_amount) OVERRIDING SYSTEM VALUE VALUES (5, 'FDR', 15, '£0.00', 'Fixed Deposit purchased from Bank.', '£2,147,483,647.00');


--
-- TOC entry 5114 (class 0 OID 16931)
-- Dependencies: 260
-- Data for Name: rule_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5108 (class 0 OID 16904)
-- Dependencies: 254
-- Data for Name: rule_rebate; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_rebate (id, max_rebate_amount, max_of_income) OVERRIDING SYSTEM VALUE VALUES (1, '£1,000,000.00', 3);


--
-- TOC entry 5110 (class 0 OID 16914)
-- Dependencies: 256
-- Data for Name: rule_tax_area_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (1, 'Dhaka', 1, 1);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (2, 'Dhaka', 1, 2);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (3, 'Dhaka', 1, 3);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (4, 'Dhaka', 1, 4);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (5, 'Dhaka', 1, 5);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (6, 'Dhaka', 1, 6);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (7, 'Dhaka', 1, 7);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (8, 'Dhaka', 1, 8);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (9, 'Dhaka', 1, 9);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (10, 'Dhaka', 1, 10);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (11, 'Dhaka', 1, 11);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (12, 'Dhaka', 1, 12);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (13, 'Dhaka', 1, 13);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (14, 'Dhaka', 1, 14);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (15, 'Dhaka', 1, 15);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (16, 'Dhaka', 1, 16);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (17, 'Dhaka', 1, 17);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (18, 'Dhaka', 1, 18);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (19, 'Dhaka', 1, 19);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (20, 'Dhaka', 1, 20);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (21, 'Dhaka', 1, 21);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (22, 'Dhaka', 1, 22);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (23, 'Dhaka', 2, 23);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (24, 'Dhaka', 2, 24);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (25, 'Dhaka', 2, 25);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (26, 'Dhaka', 2, 26);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (27, 'Dhaka', 2, 27);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (28, 'Dhaka', 2, 28);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (29, 'Dhaka', 2, 29);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (30, 'Dhaka', 2, 30);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (31, 'Dhaka', 2, 31);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (32, 'Dhaka', 2, 32);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (33, 'Dhaka', 2, 33);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (34, 'Dhaka', 2, 34);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (35, 'Dhaka', 2, 35);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (36, 'Dhaka', 2, 36);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (37, 'Dhaka', 2, 37);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (38, 'Dhaka', 2, 38);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (39, 'Dhaka', 2, 39);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (40, 'Dhaka', 2, 40);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (41, 'Dhaka', 2, 41);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (42, 'Dhaka', 2, 42);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (43, 'Dhaka', 2, 43);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (44, 'Dhaka', 2, 44);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (45, 'Dhaka', 3, 45);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (46, 'Dhaka', 3, 46);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (47, 'Dhaka', 3, 47);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (48, 'Dhaka', 3, 48);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (49, 'Dhaka', 3, 49);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (50, 'Dhaka', 3, 50);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (51, 'Dhaka', 3, 51);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (52, 'Dhaka', 3, 52);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (53, 'Dhaka', 3, 53);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (54, 'Dhaka', 3, 54);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (55, 'Dhaka', 3, 55);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (56, 'Dhaka', 3, 56);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (57, 'Dhaka', 3, 57);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (58, 'Dhaka', 3, 58);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (59, 'Dhaka', 3, 59);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (60, 'Dhaka', 3, 60);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (61, 'Dhaka', 3, 61);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (62, 'Dhaka', 3, 62);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (63, 'Dhaka', 3, 63);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (64, 'Dhaka', 3, 64);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (65, 'Dhaka', 3, 65);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (66, 'Dhaka', 3, 66);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (67, 'Dhaka', 4, 67);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (68, 'Dhaka', 4, 68);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (69, 'Dhaka', 4, 69);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (70, 'Dhaka', 4, 70);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (71, 'Dhaka', 4, 71);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (72, 'Dhaka', 4, 72);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (73, 'Dhaka', 4, 73);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (74, 'Dhaka', 4, 74);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (75, 'Dhaka', 4, 75);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (76, 'Dhaka', 4, 76);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (77, 'Dhaka', 4, 77);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (78, 'Dhaka', 4, 78);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (79, 'Dhaka', 4, 79);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (80, 'Dhaka', 4, 80);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (81, 'Dhaka', 4, 81);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (82, 'Dhaka', 4, 82);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (83, 'Dhaka', 4, 83);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (84, 'Dhaka', 4, 84);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (85, 'Dhaka', 4, 85);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (86, 'Dhaka', 4, 86);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (87, 'Dhaka', 4, 87);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (88, 'Dhaka', 4, 88);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (89, 'Dhaka', 5, 89);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (90, 'Dhaka', 5, 90);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (91, 'Dhaka', 5, 91);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (92, 'Dhaka', 5, 92);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (93, 'Dhaka', 5, 93);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (94, 'Dhaka', 5, 94);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (95, 'Dhaka', 5, 95);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (96, 'Dhaka', 5, 96);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (97, 'Dhaka', 5, 97);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (98, 'Dhaka', 5, 98);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (99, 'Dhaka', 5, 99);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (100, 'Dhaka', 5, 100);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (101, 'Dhaka', 5, 101);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (102, 'Dhaka', 5, 102);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (103, 'Dhaka', 5, 103);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (104, 'Dhaka', 5, 104);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (105, 'Dhaka', 5, 105);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (106, 'Dhaka', 5, 106);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (107, 'Dhaka', 5, 107);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (108, 'Dhaka', 5, 108);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (109, 'Dhaka', 5, 109);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (110, 'Dhaka', 5, 110);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (111, 'Dhaka', 6, 111);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (112, 'Dhaka', 6, 112);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (113, 'Dhaka', 6, 113);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (114, 'Dhaka', 6, 114);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (115, 'Dhaka', 6, 115);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (116, 'Dhaka', 6, 116);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (117, 'Dhaka', 6, 117);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (118, 'Dhaka', 6, 118);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (119, 'Dhaka', 6, 119);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (120, 'Dhaka', 6, 120);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (121, 'Dhaka', 6, 121);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (122, 'Dhaka', 6, 122);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (123, 'Dhaka', 6, 123);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (124, 'Dhaka', 6, 124);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (125, 'Dhaka', 6, 125);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (126, 'Dhaka', 6, 126);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (127, 'Dhaka', 6, 127);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (128, 'Dhaka', 6, 128);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (129, 'Dhaka', 6, 129);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (130, 'Dhaka', 6, 130);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (131, 'Dhaka', 6, 131);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (132, 'Dhaka', 6, 132);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (133, 'Dhaka', 7, 133);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (134, 'Dhaka', 7, 134);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (135, 'Dhaka', 7, 135);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (136, 'Dhaka', 7, 136);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (137, 'Dhaka', 7, 137);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (138, 'Dhaka', 7, 138);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (139, 'Dhaka', 7, 139);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (140, 'Dhaka', 7, 140);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (141, 'Dhaka', 7, 141);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (142, 'Dhaka', 7, 142);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (143, 'Dhaka', 7, 143);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (144, 'Dhaka', 7, 144);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (145, 'Dhaka', 7, 145);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (146, 'Dhaka', 7, 146);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (147, 'Dhaka', 7, 147);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (148, 'Dhaka', 7, 148);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (149, 'Dhaka', 7, 149);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (150, 'Dhaka', 7, 150);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (151, 'Dhaka', 7, 151);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (152, 'Dhaka', 7, 152);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (153, 'Dhaka', 7, 153);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (154, 'Dhaka', 7, 154);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (155, 'Dhaka', 8, 155);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (156, 'Dhaka', 8, 156);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (157, 'Dhaka', 8, 157);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (158, 'Dhaka', 8, 158);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (159, 'Dhaka', 8, 159);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (160, 'Dhaka', 8, 160);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (161, 'Dhaka', 8, 161);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (162, 'Dhaka', 8, 162);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (163, 'Dhaka', 8, 163);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (164, 'Dhaka', 8, 164);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (165, 'Dhaka', 8, 165);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (166, 'Dhaka', 8, 166);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (167, 'Dhaka', 8, 167);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (168, 'Dhaka', 8, 168);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (169, 'Dhaka', 8, 169);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (170, 'Dhaka', 8, 170);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (171, 'Dhaka', 8, 171);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (172, 'Dhaka', 8, 172);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (173, 'Dhaka', 8, 173);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (174, 'Dhaka', 8, 174);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (175, 'Dhaka', 8, 175);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (176, 'Dhaka', 8, 176);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (177, 'Dhaka', 9, 177);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (178, 'Dhaka', 9, 178);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (179, 'Dhaka', 9, 179);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (180, 'Dhaka', 9, 180);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (181, 'Dhaka', 9, 181);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (182, 'Dhaka', 9, 182);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (183, 'Dhaka', 9, 183);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (184, 'Dhaka', 9, 184);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (185, 'Dhaka', 9, 185);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (186, 'Dhaka', 9, 186);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (187, 'Dhaka', 9, 187);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (188, 'Dhaka', 9, 188);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (189, 'Dhaka', 9, 189);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (190, 'Dhaka', 9, 190);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (191, 'Dhaka', 9, 191);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (192, 'Dhaka', 9, 192);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (193, 'Dhaka', 9, 193);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (194, 'Dhaka', 9, 194);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (195, 'Dhaka', 9, 195);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (196, 'Dhaka', 9, 196);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (197, 'Dhaka', 9, 197);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (198, 'Dhaka', 9, 198);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (199, 'Dhaka', 10, 199);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (200, 'Dhaka', 10, 200);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (201, 'Dhaka', 10, 201);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (202, 'Dhaka', 10, 202);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (203, 'Dhaka', 10, 203);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (204, 'Dhaka', 10, 204);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (205, 'Dhaka', 10, 205);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (206, 'Dhaka', 10, 206);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (207, 'Dhaka', 10, 207);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (208, 'Dhaka', 10, 208);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (209, 'Dhaka', 10, 209);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (210, 'Dhaka', 10, 210);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (211, 'Dhaka', 10, 211);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (212, 'Dhaka', 10, 212);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (213, 'Dhaka', 10, 213);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (214, 'Dhaka', 10, 214);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (215, 'Dhaka', 10, 215);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (216, 'Dhaka', 10, 216);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (217, 'Dhaka', 10, 217);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (218, 'Dhaka', 10, 218);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (219, 'Dhaka', 10, 219);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (220, 'Dhaka', 10, 220);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (221, 'Dhaka', 11, 221);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (222, 'Dhaka', 11, 222);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (223, 'Dhaka', 11, 223);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (224, 'Dhaka', 11, 224);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (225, 'Dhaka', 11, 225);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (226, 'Dhaka', 11, 226);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (227, 'Dhaka', 11, 227);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (228, 'Dhaka', 11, 228);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (229, 'Dhaka', 11, 229);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (230, 'Dhaka', 11, 230);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (231, 'Dhaka', 11, 231);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (232, 'Dhaka', 11, 232);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (233, 'Dhaka', 11, 233);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (234, 'Dhaka', 11, 234);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (235, 'Dhaka', 11, 235);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (236, 'Dhaka', 11, 236);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (237, 'Dhaka', 11, 237);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (238, 'Dhaka', 11, 238);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (239, 'Dhaka', 11, 239);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (240, 'Dhaka', 11, 240);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (241, 'Dhaka', 11, 241);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (242, 'Dhaka', 11, 242);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (243, 'Dhaka', 12, 243);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (244, 'Dhaka', 12, 244);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (245, 'Dhaka', 12, 245);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (246, 'Dhaka', 12, 246);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (247, 'Dhaka', 12, 247);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (248, 'Dhaka', 12, 248);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (249, 'Dhaka', 12, 249);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (250, 'Dhaka', 12, 250);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (251, 'Dhaka', 12, 251);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (252, 'Dhaka', 12, 252);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (253, 'Dhaka', 12, 253);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (254, 'Dhaka', 12, 254);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (255, 'Dhaka', 12, 255);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (256, 'Dhaka', 12, 256);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (257, 'Dhaka', 12, 257);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (258, 'Dhaka', 12, 258);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (259, 'Dhaka', 12, 259);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (260, 'Dhaka', 12, 260);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (261, 'Dhaka', 12, 261);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (262, 'Dhaka', 12, 262);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (263, 'Dhaka', 12, 263);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (264, 'Dhaka', 12, 264);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (265, 'Dhaka', 13, 265);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (266, 'Dhaka', 13, 266);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (267, 'Dhaka', 13, 267);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (268, 'Dhaka', 13, 268);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (269, 'Dhaka', 13, 269);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (270, 'Dhaka', 13, 270);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (271, 'Dhaka', 13, 271);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (272, 'Dhaka', 13, 272);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (273, 'Dhaka', 13, 273);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (274, 'Dhaka', 13, 274);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (275, 'Dhaka', 13, 275);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (276, 'Dhaka', 13, 276);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (277, 'Dhaka', 13, 277);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (278, 'Dhaka', 13, 278);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (279, 'Dhaka', 13, 279);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (280, 'Dhaka', 13, 280);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (281, 'Dhaka', 13, 281);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (282, 'Dhaka', 13, 282);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (283, 'Dhaka', 13, 283);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (284, 'Dhaka', 13, 284);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (285, 'Dhaka', 13, 285);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (286, 'Dhaka', 13, 286);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (287, 'Dhaka', 14, 287);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (288, 'Dhaka', 14, 288);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (289, 'Dhaka', 14, 289);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (290, 'Dhaka', 14, 290);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (291, 'Dhaka', 14, 291);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (292, 'Dhaka', 14, 292);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (293, 'Dhaka', 14, 293);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (294, 'Dhaka', 14, 294);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (295, 'Dhaka', 14, 295);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (296, 'Dhaka', 14, 296);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (297, 'Dhaka', 14, 297);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (298, 'Dhaka', 14, 298);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (299, 'Dhaka', 14, 299);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (300, 'Dhaka', 14, 300);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (301, 'Dhaka', 14, 301);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (302, 'Dhaka', 14, 302);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (303, 'Dhaka', 14, 303);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (304, 'Dhaka', 14, 304);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (305, 'Dhaka', 14, 305);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (306, 'Dhaka', 14, 306);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (307, 'Dhaka', 14, 307);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (308, 'Dhaka', 14, 308);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (309, 'Dhaka', 15, 309);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (310, 'Dhaka', 15, 310);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (311, 'Dhaka', 15, 311);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (312, 'Dhaka', 15, 312);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (313, 'Dhaka', 15, 313);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (314, 'Dhaka', 15, 314);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (315, 'Dhaka', 15, 315);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (316, 'Dhaka', 15, 316);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (317, 'Dhaka', 15, 317);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (318, 'Dhaka', 15, 318);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (319, 'Dhaka', 15, 319);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (320, 'Dhaka', 15, 320);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (321, 'Dhaka', 15, 321);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (322, 'Dhaka', 15, 322);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (323, 'Dhaka', 15, 323);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (324, 'Dhaka', 15, 324);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (325, 'Dhaka', 15, 325);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (326, 'Dhaka', 15, 326);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (327, 'Dhaka', 15, 327);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (328, 'Dhaka', 15, 328);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (329, 'Dhaka', 15, 329);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (330, 'Dhaka', 15, 330);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (331, 'Mymensingh', 16, 331);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (332, 'Mymensingh', 16, 332);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (333, 'Mymensingh', 16, 333);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (334, 'Mymensingh', 16, 334);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (335, 'Mymensingh', 16, 335);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (336, 'Mymensingh', 16, 336);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (337, 'Mymensingh', 16, 337);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (338, 'Mymensingh', 16, 338);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (339, 'Mymensingh', 16, 339);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (340, 'Mymensingh', 16, 340);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (341, 'Mymensingh', 16, 341);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (342, 'Mymensingh', 16, 342);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (343, 'Mymensingh', 16, 343);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (344, 'Mymensingh', 16, 344);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (345, 'Mymensingh', 16, 345);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (346, 'Mymensingh', 16, 346);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (347, 'Mymensingh', 16, 347);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (348, 'Mymensingh', 16, 348);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (349, 'Mymensingh', 16, 349);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (350, 'Mymensingh', 16, 350);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (351, 'Mymensingh', 16, 351);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (352, 'Mymensingh', 16, 352);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (353, 'Sylhet', 17, 353);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (354, 'Sylhet', 17, 354);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (355, 'Sylhet', 17, 355);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (356, 'Sylhet', 17, 356);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (357, 'Sylhet', 17, 357);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (358, 'Sylhet', 17, 358);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (359, 'Sylhet', 17, 359);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (360, 'Sylhet', 17, 360);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (361, 'Sylhet', 17, 361);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (362, 'Sylhet', 17, 362);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (363, 'Sylhet', 17, 363);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (364, 'Sylhet', 17, 364);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (365, 'Sylhet', 17, 365);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (366, 'Sylhet', 17, 366);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (367, 'Sylhet', 17, 367);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (368, 'Sylhet', 17, 368);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (369, 'Sylhet', 17, 369);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (370, 'Sylhet', 17, 370);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (371, 'Sylhet', 17, 371);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (372, 'Sylhet', 17, 372);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (373, 'Sylhet', 17, 373);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (374, 'Sylhet', 17, 374);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (419, 'Chittagong', 20, 419);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (420, 'Chittagong', 20, 420);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (421, 'Chittagong', 20, 421);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (422, 'Chittagong', 20, 422);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (423, 'Chittagong', 20, 423);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (424, 'Chittagong', 20, 424);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (425, 'Chittagong', 20, 425);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (426, 'Chittagong', 20, 426);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (427, 'Chittagong', 20, 427);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (428, 'Chittagong', 20, 428);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (429, 'Chittagong', 20, 429);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (430, 'Chittagong', 20, 430);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (431, 'Chittagong', 20, 431);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (432, 'Chittagong', 20, 432);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (433, 'Chittagong', 20, 433);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (434, 'Chittagong', 20, 434);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (435, 'Chittagong', 20, 435);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (436, 'Chittagong', 20, 436);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (437, 'Chittagong', 20, 437);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (438, 'Chittagong', 20, 438);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (439, 'Chittagong', 20, 439);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (440, 'Chittagong', 20, 440);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (441, 'Chittagong', 21, 441);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (442, 'Chittagong', 21, 442);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (443, 'Chittagong', 21, 443);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (444, 'Chittagong', 21, 444);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (445, 'Chittagong', 21, 445);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (446, 'Chittagong', 21, 446);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (447, 'Chittagong', 21, 447);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (448, 'Chittagong', 21, 448);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (449, 'Chittagong', 21, 449);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (450, 'Chittagong', 21, 450);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (451, 'Chittagong', 21, 451);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (452, 'Chittagong', 21, 452);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (453, 'Chittagong', 21, 453);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (454, 'Chittagong', 21, 454);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (455, 'Chittagong', 21, 455);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (456, 'Chittagong', 21, 456);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (457, 'Chittagong', 21, 457);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (458, 'Chittagong', 21, 458);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (459, 'Chittagong', 21, 459);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (460, 'Chittagong', 21, 460);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (461, 'Chittagong', 21, 461);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (462, 'Chittagong', 21, 462);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (463, 'Chittagong', 22, 463);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (464, 'Chittagong', 22, 464);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (465, 'Chittagong', 22, 465);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (466, 'Chittagong', 22, 466);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (467, 'Chittagong', 22, 467);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (468, 'Chittagong', 22, 468);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (469, 'Chittagong', 22, 469);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (470, 'Chittagong', 22, 470);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (471, 'Chittagong', 22, 471);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (472, 'Chittagong', 22, 472);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (473, 'Chittagong', 22, 473);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (474, 'Chittagong', 22, 474);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (475, 'Chittagong', 22, 475);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (476, 'Chittagong', 22, 476);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (477, 'Chittagong', 22, 477);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (478, 'Chittagong', 22, 478);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (479, 'Chittagong', 22, 479);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (480, 'Chittagong', 22, 480);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (481, 'Chittagong', 22, 481);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (482, 'Chittagong', 22, 482);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (483, 'Chittagong', 22, 483);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (484, 'Chittagong', 22, 484);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (485, 'Chittagong', 23, 485);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (486, 'Chittagong', 23, 486);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (487, 'Chittagong', 23, 487);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (488, 'Chittagong', 23, 488);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (489, 'Chittagong', 23, 489);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (490, 'Chittagong', 23, 490);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (491, 'Chittagong', 23, 491);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (492, 'Chittagong', 23, 492);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (493, 'Chittagong', 23, 493);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (494, 'Chittagong', 23, 494);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (495, 'Chittagong', 23, 495);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (496, 'Chittagong', 23, 496);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (497, 'Chittagong', 23, 497);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (498, 'Chittagong', 23, 498);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (499, 'Chittagong', 23, 499);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (500, 'Chittagong', 23, 500);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (501, 'Chittagong', 23, 501);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (502, 'Chittagong', 23, 502);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (503, 'Chittagong', 23, 503);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (504, 'Chittagong', 23, 504);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (505, 'Chittagong', 23, 505);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (506, 'Chittagong', 23, 506);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (507, 'Gazipur', 24, 507);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (508, 'Gazipur', 24, 508);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (509, 'Gazipur', 24, 509);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (510, 'Gazipur', 24, 510);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (511, 'Gazipur', 24, 511);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (512, 'Gazipur', 24, 512);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (513, 'Gazipur', 24, 513);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (514, 'Gazipur', 24, 514);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (515, 'Gazipur', 24, 515);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (516, 'Gazipur', 24, 516);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (517, 'Gazipur', 24, 517);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (518, 'Gazipur', 24, 518);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (519, 'Gazipur', 24, 519);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (520, 'Gazipur', 24, 520);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (521, 'Gazipur', 24, 521);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (522, 'Gazipur', 24, 522);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (523, 'Gazipur', 24, 523);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (524, 'Gazipur', 24, 524);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (525, 'Gazipur', 24, 525);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (526, 'Gazipur', 24, 526);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (527, 'Gazipur', 24, 527);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (528, 'Gazipur', 24, 528);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (529, 'Khulna', 25, 529);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (530, 'Khulna', 25, 530);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (531, 'Khulna', 25, 531);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (532, 'Khulna', 25, 532);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (533, 'Khulna', 25, 533);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (534, 'Khulna', 25, 534);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (535, 'Khulna', 25, 535);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (536, 'Khulna', 25, 536);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (537, 'Khulna', 25, 537);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (538, 'Khulna', 25, 538);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (539, 'Khulna', 25, 539);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (540, 'Khulna', 25, 540);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (541, 'Khulna', 25, 541);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (542, 'Khulna', 25, 542);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (543, 'Khulna', 25, 543);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (544, 'Khulna', 25, 544);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (545, 'Khulna', 25, 545);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (546, 'Khulna', 25, 546);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (547, 'Khulna', 25, 547);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (548, 'Khulna', 25, 548);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (549, 'Khulna', 25, 549);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (550, 'Khulna', 25, 550);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (551, 'Comilla', 26, 551);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (552, 'Comilla', 26, 552);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (553, 'Comilla', 26, 553);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (554, 'Comilla', 26, 554);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (555, 'Comilla', 26, 555);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (556, 'Comilla', 26, 556);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (557, 'Comilla', 26, 557);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (558, 'Comilla', 26, 558);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (559, 'Comilla', 26, 559);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (560, 'Comilla', 26, 560);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (561, 'Comilla', 26, 561);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (562, 'Comilla', 26, 562);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (563, 'Comilla', 26, 563);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (564, 'Comilla', 26, 564);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (565, 'Comilla', 26, 565);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (566, 'Comilla', 26, 566);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (567, 'Comilla', 26, 567);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (568, 'Comilla', 26, 568);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (569, 'Comilla', 26, 569);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (570, 'Comilla', 26, 570);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (571, 'Comilla', 26, 571);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (572, 'Comilla', 26, 572);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (573, 'Rajshahi', 27, 573);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (574, 'Rajshahi', 27, 574);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (575, 'Rajshahi', 27, 575);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (576, 'Rajshahi', 27, 576);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (577, 'Rajshahi', 27, 577);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (578, 'Rajshahi', 27, 578);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (579, 'Rajshahi', 27, 579);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (580, 'Rajshahi', 27, 580);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (581, 'Rajshahi', 27, 581);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (582, 'Rajshahi', 27, 582);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (583, 'Rajshahi', 27, 583);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (584, 'Rajshahi', 27, 584);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (585, 'Rajshahi', 27, 585);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (586, 'Rajshahi', 27, 586);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (587, 'Rajshahi', 27, 587);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (588, 'Rajshahi', 27, 588);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (589, 'Rajshahi', 27, 589);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (590, 'Rajshahi', 27, 590);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (591, 'Rajshahi', 27, 591);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (592, 'Rajshahi', 27, 592);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (593, 'Rajshahi', 27, 593);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (594, 'Rajshahi', 27, 594);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (595, 'Barisal', 28, 595);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (596, 'Barisal', 28, 596);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (597, 'Barisal', 28, 597);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (598, 'Barisal', 28, 598);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (599, 'Barisal', 28, 599);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (600, 'Barisal', 28, 600);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (601, 'Barisal', 28, 601);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (602, 'Barisal', 28, 602);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (603, 'Barisal', 28, 603);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (604, 'Barisal', 28, 604);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (605, 'Barisal', 28, 605);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (606, 'Barisal', 28, 606);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (607, 'Barisal', 28, 607);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (608, 'Barisal', 28, 608);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (609, 'Barisal', 28, 609);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (610, 'Barisal', 28, 610);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (611, 'Barisal', 28, 611);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (612, 'Barisal', 28, 612);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (613, 'Barisal', 28, 613);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (614, 'Barisal', 28, 614);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (615, 'Barisal', 28, 615);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (616, 'Barisal', 28, 616);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (617, 'Bogra', 29, 617);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (618, 'Bogra', 29, 618);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (619, 'Bogra', 29, 619);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (620, 'Bogra', 29, 620);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (621, 'Bogra', 29, 621);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (622, 'Bogra', 29, 622);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (623, 'Bogra', 29, 623);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (624, 'Bogra', 29, 624);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (625, 'Bogra', 29, 625);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (626, 'Bogra', 29, 626);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (627, 'Bogra', 29, 627);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (628, 'Bogra', 29, 628);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (629, 'Bogra', 29, 629);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (630, 'Bogra', 29, 630);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (631, 'Bogra', 29, 631);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (632, 'Bogra', 29, 632);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (633, 'Bogra', 29, 633);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (634, 'Bogra', 29, 634);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (635, 'Bogra', 29, 635);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (636, 'Bogra', 29, 636);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (637, 'Bogra', 29, 637);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (638, 'Bogra', 29, 638);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (639, 'Rangpur', 30, 639);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (640, 'Rangpur', 30, 640);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (641, 'Rangpur', 30, 641);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (642, 'Rangpur', 30, 642);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (643, 'Rangpur', 30, 643);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (644, 'Rangpur', 30, 644);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (645, 'Rangpur', 30, 645);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (646, 'Rangpur', 30, 646);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (647, 'Rangpur', 30, 647);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (648, 'Rangpur', 30, 648);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (649, 'Rangpur', 30, 649);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (650, 'Rangpur', 30, 650);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (651, 'Rangpur', 30, 651);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (652, 'Rangpur', 30, 652);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (653, 'Rangpur', 30, 653);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (654, 'Rangpur', 30, 654);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (655, 'Rangpur', 30, 655);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (656, 'Rangpur', 30, 656);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (657, 'Rangpur', 30, 657);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (658, 'Rangpur', 30, 658);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (659, 'Rangpur', 30, 659);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (660, 'Rangpur', 30, 660);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (661, 'Narayanganj', 31, 661);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (662, 'Narayanganj', 31, 662);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (663, 'Narayanganj', 31, 663);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (664, 'Narayanganj', 31, 664);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (665, 'Narayanganj', 31, 665);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (666, 'Narayanganj', 31, 666);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (667, 'Narayanganj', 31, 667);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (668, 'Narayanganj', 31, 668);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (669, 'Narayanganj', 31, 669);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (670, 'Narayanganj', 31, 670);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (671, 'Narayanganj', 31, 671);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (672, 'Narayanganj', 31, 672);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (673, 'Narayanganj', 31, 673);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (674, 'Narayanganj', 31, 674);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (675, 'Narayanganj', 31, 675);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (676, 'Narayanganj', 31, 676);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (677, 'Narayanganj', 31, 677);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (678, 'Narayanganj', 31, 678);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (679, 'Narayanganj', 31, 679);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (680, 'Narayanganj', 31, 680);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (681, 'Narayanganj', 31, 681);
INSERT INTO public.rule_tax_area_list (id, area_name, zone_no, circle_no) OVERRIDING SYSTEM VALUE VALUES (682, 'Narayanganj', 31, 682);


--
-- TOC entry 5106 (class 0 OID 16898)
-- Dependencies: 252
-- Data for Name: rule_tax_zone_min_tax; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rule_tax_zone_min_tax (id, area_name, min_amount) OVERRIDING SYSTEM VALUE VALUES (1, 'Dhaka', '£5,000.00');
INSERT INTO public.rule_tax_zone_min_tax (id, area_name, min_amount) OVERRIDING SYSTEM VALUE VALUES (2, 'Gazipur', '£4,000.00');
INSERT INTO public.rule_tax_zone_min_tax (id, area_name, min_amount) OVERRIDING SYSTEM VALUE VALUES (3, 'Mymensingh', '£4,000.00');
INSERT INTO public.rule_tax_zone_min_tax (id, area_name, min_amount) OVERRIDING SYSTEM VALUE VALUES (4, 'Rest', '£3,000.00');


--
-- TOC entry 5073 (class 0 OID 16707)
-- Dependencies: 219
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (2, 'tausif', '01234556778', '12345667890', '2002-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (3, 'abul', '01700000001', '9000000001', '1990-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (4, 'adibah', '01700000002', '9000000002', '1991-01-01', 'Spouse_2', '1111111112');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (5, 'kabul', '01700000003', '9000000003', '1992-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (6, 'arpita', '01700000004', '9000000004', '1960-01-01', 'Spouse_4', '1111111114');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (7, 'toufik', '01700000005', '9000000005', '1950-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (8, 'fairuz', '01700000006', '9000000006', '1995-01-01', 'Spouse_6', '1111111116');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (9, 'kowshik', '01700000007', '9000000007', '1996-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (10, 'swastika', '01700000008', '9000000008', '1957-01-01', 'Spouse_8', '1111111118');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (11, 'tanim', '01700000009', '9000000009', '1998-01-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (12, 'shovon', '01700000010', '9000000010', '1999-01-01', 'Spouse_10', '1111111120');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (13, 'soumik', '01700000011', '9000000011', '1990-02-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (14, 'rifat', '01700000012', '9000000012', '1990-03-01', 'Spouse_12', '1111111122');
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (15, 'gourab', '01700000014', '9000000014', '1997-03-01', NULL, NULL);
INSERT INTO public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) VALUES (16, 'rafia', '01700000015', '9000000015', '1997-02-01', NULL, NULL);


--
-- TOC entry 5112 (class 0 OID 16920)
-- Dependencies: 258
-- Data for Name: user_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5072 (class 0 OID 16702)
-- Dependencies: 218
-- Data for Name: user_tax_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (2, '1234567890', true, false, false, false, 1, 2, 'Dhaka');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (3, '1000000001', true, false, false, false, 1, 1, 'Dhaka');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (4, '1000000002', true, false, true, false, 2, 2, 'Chittagong');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (5, '1000000003', true, true, false, true, 3, 3, 'Sylhet');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (6, '1000000004', true, false, true, false, 4, 1, 'Khulna');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (7, '1000000005', true, true, false, true, 5, 2, 'Rajshahi');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (8, '1000000006', true, false, true, false, 1, 3, 'Barisal');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (9, '1000000007', true, true, false, true, 2, 1, 'Comilla');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (10, '1000000008', true, false, true, false, 3, 2, 'Mymensingh');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (11, '1000000009', true, true, false, true, 4, 3, 'Rangpur');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (12, '1000000010', true, false, false, false, 5, 1, 'Jessore');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (13, '1000000011', true, false, false, true, 1, 1, 'Dhaka');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (14, '1000000012', true, true, false, false, 2, 2, 'Chittagong');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (15, '10000000013', true, false, false, false, 3, 2, 'Dhaka');
INSERT INTO public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) OVERRIDING SYSTEM VALUE VALUES (16, '10000000014', true, false, true, false, 3, 2, 'Dhaka');


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 243
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_seq', 3, true);


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 233
-- Name: asset_bank_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_bank_account_id_seq', 109, true);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 227
-- Name: asset_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_car_id_seq', 48, true);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 231
-- Name: asset_flat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_flat_id_seq', 37, true);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 229
-- Name: asset_jewelery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_jewelery_id_seq', 25, true);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 225
-- Name: asset_plot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_plot_id_seq', 30, true);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 223
-- Name: expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_id_seq', 75, true);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 245
-- Name: file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.file_id_seq', 1, false);


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 221
-- Name: income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.income_id_seq', 31, true);


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 239
-- Name: investment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investment_id_seq', 87, true);


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 241
-- Name: investment_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investment_type_id_seq', 5, true);


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 235
-- Name: liability_bank_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liability_bank_loan_id_seq', 15, true);


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 237
-- Name: liability_person_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liability_person_loan_id_seq', 10, true);


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 257
-- Name: log_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_table_id_seq', 1, false);


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 261
-- Name: rule_expense_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_expense_category_id_seq', 18, true);


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 249
-- Name: rule_income_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_income_category_id_seq', 5, true);


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 247
-- Name: rule_income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_income_id_seq', 30, true);


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 259
-- Name: rule_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_log_id_seq', 1, false);


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 253
-- Name: rule_rebate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_rebate_id_seq', 1, true);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 255
-- Name: rule_tax_area_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_tax_area_list_id_seq', 682, true);


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 251
-- Name: rule_tax_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_tax_zone_id_seq', 4, true);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_tax_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tax_info_id_seq', 16, true);


--
-- TOC entry 4889 (class 2606 OID 16869)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 16810)
-- Name: asset_bank_account asset_bank_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_bank_account
    ADD CONSTRAINT asset_bank_account_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 16773)
-- Name: asset_car asset_car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_car
    ADD CONSTRAINT asset_car_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16799)
-- Name: asset_flat asset_flat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_flat
    ADD CONSTRAINT asset_flat_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16786)
-- Name: asset_jewelery asset_jewelery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_jewelery
    ADD CONSTRAINT asset_jewelery_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 16760)
-- Name: asset_plot asset_plot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_plot
    ADD CONSTRAINT asset_plot_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 16721)
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16745)
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16877)
-- Name: file file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16734)
-- Name: income income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16847)
-- Name: investment investment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investment
    ADD CONSTRAINT investment_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16861)
-- Name: rule_investment_type investment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_investment_type
    ADD CONSTRAINT investment_type_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 16823)
-- Name: liability_bank_loan liability_bank_loan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_bank_loan
    ADD CONSTRAINT liability_bank_loan_pkey PRIMARY KEY (id);


--
-- TOC entry 4883 (class 2606 OID 16836)
-- Name: liability_person_loan liability_person_loan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_person_loan
    ADD CONSTRAINT liability_person_loan_pkey PRIMARY KEY (id);


--
-- TOC entry 4903 (class 2606 OID 16924)
-- Name: user_log log_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_log
    ADD CONSTRAINT log_table_pkey PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 16951)
-- Name: rule_expense_category rule_expense_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_expense_category
    ADD CONSTRAINT rule_expense_category_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16896)
-- Name: rule_income_category rule_income_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_income_category
    ADD CONSTRAINT rule_income_category_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16890)
-- Name: rule_income rule_income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_income
    ADD CONSTRAINT rule_income_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16935)
-- Name: rule_log rule_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_log
    ADD CONSTRAINT rule_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 16910)
-- Name: rule_rebate rule_rebate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_rebate
    ADD CONSTRAINT rule_rebate_pkey PRIMARY KEY (id);


--
-- TOC entry 4901 (class 2606 OID 16918)
-- Name: rule_tax_area_list rule_tax_area_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_tax_area_list
    ADD CONSTRAINT rule_tax_area_list_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16912)
-- Name: rule_tax_zone_min_tax rule_tax_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_tax_zone_min_tax
    ADD CONSTRAINT rule_tax_zone_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 16711)
-- Name: user_info user_id_tax; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_id_tax PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 16706)
-- Name: user_tax_info user_tax_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tax_info
    ADD CONSTRAINT user_tax_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2620 OID 16942)
-- Name: rule_income trg_log_rule_income; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_income AFTER UPDATE ON public.rule_income FOR EACH ROW EXECUTE FUNCTION public.log_rule_income();


--
-- TOC entry 4922 (class 2620 OID 16943)
-- Name: rule_investment_type trg_log_rule_investment_type; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_investment_type AFTER UPDATE ON public.rule_investment_type FOR EACH ROW EXECUTE FUNCTION public.log_rule_investment_type();


--
-- TOC entry 4925 (class 2620 OID 16940)
-- Name: rule_rebate trg_log_rule_rebate; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_rebate AFTER UPDATE ON public.rule_rebate FOR EACH ROW EXECUTE FUNCTION public.log_rule_rebate();


--
-- TOC entry 4924 (class 2620 OID 16941)
-- Name: rule_tax_zone_min_tax trg_log_rule_tax_zone_min_tax; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_tax_zone_min_tax AFTER UPDATE ON public.rule_tax_zone_min_tax FOR EACH ROW EXECUTE FUNCTION public.log_rule_tax_zone_min_tax();


--
-- TOC entry 4916 (class 2606 OID 16811)
-- Name: asset_bank_account asset_bank_account_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_bank_account
    ADD CONSTRAINT asset_bank_account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4913 (class 2606 OID 16774)
-- Name: asset_car asset_car_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_car
    ADD CONSTRAINT asset_car_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4915 (class 2606 OID 16800)
-- Name: asset_flat asset_flat_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_flat
    ADD CONSTRAINT asset_flat_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4914 (class 2606 OID 16787)
-- Name: asset_jewelery asset_jewelery_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_jewelery
    ADD CONSTRAINT asset_jewelery_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4920 (class 2606 OID 16878)
-- Name: file file_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4908 (class 2606 OID 16712)
-- Name: user_info fk_tax_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT fk_tax_id FOREIGN KEY (id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4910 (class 2606 OID 16735)
-- Name: income fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4909 (class 2606 OID 16722)
-- Name: credentials fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4911 (class 2606 OID 16746)
-- Name: expense fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4912 (class 2606 OID 16761)
-- Name: asset_plot fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_plot
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4919 (class 2606 OID 16848)
-- Name: investment investment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investment
    ADD CONSTRAINT investment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4917 (class 2606 OID 16824)
-- Name: liability_bank_loan liability_bank_loan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_bank_loan
    ADD CONSTRAINT liability_bank_loan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4918 (class 2606 OID 16837)
-- Name: liability_person_loan liability_person_loan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_person_loan
    ADD CONSTRAINT liability_person_loan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4921 (class 2606 OID 16925)
-- Name: user_log log_table_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_log
    ADD CONSTRAINT log_table_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


-- Completed on 2025-06-23 13:48:30

--
-- PostgreSQL database dump complete
--

