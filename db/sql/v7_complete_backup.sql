--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-23 16:44:02

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
-- TOC entry 263 (class 1255 OID 16938)
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
-- TOC entry 264 (class 1255 OID 16939)
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
-- TOC entry 261 (class 1255 OID 16936)
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
-- TOC entry 262 (class 1255 OID 16937)
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
    password_hash text NOT NULL
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
    title character varying(20),
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
    amount money,
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
-- TOC entry 5090 (class 0 OID 16863)
-- Dependencies: 244
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id, name, email, nid, password_hash) FROM stdin;
\.


--
-- TOC entry 5080 (class 0 OID 16806)
-- Dependencies: 234
-- Data for Name: asset_bank_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_bank_account (id, user_id, account, amount, bank_name, title) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 16767)
-- Dependencies: 228
-- Data for Name: asset_car; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_car (id, user_id, model, engine, description, title, cost, acquisition, reg_number) FROM stdin;
\.


--
-- TOC entry 5078 (class 0 OID 16793)
-- Dependencies: 232
-- Data for Name: asset_flat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_flat (id, user_id, title, description, cost, date, location, acquisition) FROM stdin;
\.


--
-- TOC entry 5076 (class 0 OID 16780)
-- Dependencies: 230
-- Data for Name: asset_jewelery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_jewelery (id, user_id, title, description, cost, acquisition, weight) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 16754)
-- Dependencies: 226
-- Data for Name: asset_plot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_plot (id, user_id, type, description, cost, date, acquisition, location) FROM stdin;
\.


--
-- TOC entry 5066 (class 0 OID 16717)
-- Dependencies: 220
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credentials (id, email, password_hash) FROM stdin;
\.


--
-- TOC entry 5070 (class 0 OID 16741)
-- Dependencies: 224
-- Data for Name: expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense (id, user_id, type, amount, description, date) FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 16871)
-- Dependencies: 246
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.file (id, user_id, link, date, amount, trx_id) FROM stdin;
\.


--
-- TOC entry 5068 (class 0 OID 16730)
-- Dependencies: 222
-- Data for Name: income; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.income (id, user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) FROM stdin;
\.


--
-- TOC entry 5086 (class 0 OID 16843)
-- Dependencies: 240
-- Data for Name: investment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investment (id, user_id, title, amount, date) FROM stdin;
\.


--
-- TOC entry 5082 (class 0 OID 16817)
-- Dependencies: 236
-- Data for Name: liability_bank_loan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liability_bank_loan (id, user_id, bank_name, account, interest, amount, remaining) FROM stdin;
\.


--
-- TOC entry 5084 (class 0 OID 16830)
-- Dependencies: 238
-- Data for Name: liability_person_loan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.liability_person_loan (id, user_id, lender_name, lender_nid, amount, remaining, interest) FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 16884)
-- Dependencies: 248
-- Data for Name: rule_income; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_income (id, category, slab_no, slab_length, tax_rate) FROM stdin;
\.


--
-- TOC entry 5096 (class 0 OID 16892)
-- Dependencies: 250
-- Data for Name: rule_income_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_income_category (id, name) FROM stdin;
\.


--
-- TOC entry 5088 (class 0 OID 16855)
-- Dependencies: 242
-- Data for Name: rule_investment_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_investment_type (id, title, rate_rebate, amount, min_amount, description, max_amount) FROM stdin;
\.


--
-- TOC entry 5106 (class 0 OID 16931)
-- Dependencies: 260
-- Data for Name: rule_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_log (id, rule_table_name, rule_id, rule_column_name, old_value, new_value, change_date) FROM stdin;
\.


--
-- TOC entry 5100 (class 0 OID 16904)
-- Dependencies: 254
-- Data for Name: rule_rebate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_rebate (id, max_rebate_amount, max_of_income) FROM stdin;
\.


--
-- TOC entry 5102 (class 0 OID 16914)
-- Dependencies: 256
-- Data for Name: rule_tax_area_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_tax_area_list (id, area_name, zone_no, circle_no) FROM stdin;
\.


--
-- TOC entry 5098 (class 0 OID 16898)
-- Dependencies: 252
-- Data for Name: rule_tax_zone_min_tax; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rule_tax_zone_min_tax (id, area_name, min_amount) FROM stdin;
\.


--
-- TOC entry 5065 (class 0 OID 16707)
-- Dependencies: 219
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_info (id, name, phone, nid, dob, spouse_name, spouse_tin) FROM stdin;
\.


--
-- TOC entry 5104 (class 0 OID 16920)
-- Dependencies: 258
-- Data for Name: user_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_log (id, user_id, item_table_name, action, details, item_id) FROM stdin;
\.


--
-- TOC entry 5064 (class 0 OID 16702)
-- Dependencies: 218
-- Data for Name: user_tax_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tax_info (id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name) FROM stdin;
\.


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 243
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, false);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 233
-- Name: asset_bank_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_bank_account_id_seq', 1, false);


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 227
-- Name: asset_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_car_id_seq', 1, false);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 231
-- Name: asset_flat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_flat_id_seq', 1, false);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 229
-- Name: asset_jewelery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_jewelery_id_seq', 1, false);


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 225
-- Name: asset_plot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_plot_id_seq', 1, false);


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 223
-- Name: expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expense_id_seq', 1, false);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 245
-- Name: file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.file_id_seq', 1, false);


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 221
-- Name: income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.income_id_seq', 1, false);


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 239
-- Name: investment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investment_id_seq', 1, false);


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 241
-- Name: investment_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investment_type_id_seq', 1, false);


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 235
-- Name: liability_bank_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liability_bank_loan_id_seq', 1, false);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 237
-- Name: liability_person_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.liability_person_loan_id_seq', 1, false);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 257
-- Name: log_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_table_id_seq', 1, false);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 249
-- Name: rule_income_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_income_category_id_seq', 1, false);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 247
-- Name: rule_income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_income_id_seq', 1, false);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 259
-- Name: rule_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_log_id_seq', 1, false);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 253
-- Name: rule_rebate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_rebate_id_seq', 1, false);


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 255
-- Name: rule_tax_area_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_tax_area_list_id_seq', 1, false);


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 251
-- Name: rule_tax_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rule_tax_zone_id_seq', 1, false);


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_tax_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tax_info_id_seq', 1, false);


--
-- TOC entry 4883 (class 2606 OID 16869)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 16810)
-- Name: asset_bank_account asset_bank_account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_bank_account
    ADD CONSTRAINT asset_bank_account_pkey PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 16773)
-- Name: asset_car asset_car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_car
    ADD CONSTRAINT asset_car_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 16799)
-- Name: asset_flat asset_flat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_flat
    ADD CONSTRAINT asset_flat_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16786)
-- Name: asset_jewelery asset_jewelery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_jewelery
    ADD CONSTRAINT asset_jewelery_pkey PRIMARY KEY (id);


--
-- TOC entry 4865 (class 2606 OID 16760)
-- Name: asset_plot asset_plot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_plot
    ADD CONSTRAINT asset_plot_pkey PRIMARY KEY (id);


--
-- TOC entry 4859 (class 2606 OID 16721)
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 16745)
-- Name: expense expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT expense_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 16877)
-- Name: file file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 16734)
-- Name: income income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT income_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 16847)
-- Name: investment investment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investment
    ADD CONSTRAINT investment_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 16861)
-- Name: rule_investment_type investment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_investment_type
    ADD CONSTRAINT investment_type_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16823)
-- Name: liability_bank_loan liability_bank_loan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_bank_loan
    ADD CONSTRAINT liability_bank_loan_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16836)
-- Name: liability_person_loan liability_person_loan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_person_loan
    ADD CONSTRAINT liability_person_loan_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 16924)
-- Name: user_log log_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_log
    ADD CONSTRAINT log_table_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 16896)
-- Name: rule_income_category rule_income_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_income_category
    ADD CONSTRAINT rule_income_category_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16890)
-- Name: rule_income rule_income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_income
    ADD CONSTRAINT rule_income_pkey PRIMARY KEY (id);


--
-- TOC entry 4899 (class 2606 OID 16935)
-- Name: rule_log rule_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_log
    ADD CONSTRAINT rule_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16910)
-- Name: rule_rebate rule_rebate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_rebate
    ADD CONSTRAINT rule_rebate_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 16918)
-- Name: rule_tax_area_list rule_tax_area_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_tax_area_list
    ADD CONSTRAINT rule_tax_area_list_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 16912)
-- Name: rule_tax_zone_min_tax rule_tax_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rule_tax_zone_min_tax
    ADD CONSTRAINT rule_tax_zone_pkey PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 16711)
-- Name: user_info user_id_tax; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_id_tax PRIMARY KEY (id);


--
-- TOC entry 4855 (class 2606 OID 16706)
-- Name: user_tax_info user_tax_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tax_info
    ADD CONSTRAINT user_tax_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2620 OID 16942)
-- Name: rule_income trg_log_rule_income; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_income AFTER UPDATE ON public.rule_income FOR EACH ROW EXECUTE FUNCTION public.log_rule_income();


--
-- TOC entry 4914 (class 2620 OID 16943)
-- Name: rule_investment_type trg_log_rule_investment_type; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_investment_type AFTER UPDATE ON public.rule_investment_type FOR EACH ROW EXECUTE FUNCTION public.log_rule_investment_type();


--
-- TOC entry 4917 (class 2620 OID 16940)
-- Name: rule_rebate trg_log_rule_rebate; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_rebate AFTER UPDATE ON public.rule_rebate FOR EACH ROW EXECUTE FUNCTION public.log_rule_rebate();


--
-- TOC entry 4916 (class 2620 OID 16941)
-- Name: rule_tax_zone_min_tax trg_log_rule_tax_zone_min_tax; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_log_rule_tax_zone_min_tax AFTER UPDATE ON public.rule_tax_zone_min_tax FOR EACH ROW EXECUTE FUNCTION public.log_rule_tax_zone_min_tax();


--
-- TOC entry 4908 (class 2606 OID 16811)
-- Name: asset_bank_account asset_bank_account_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_bank_account
    ADD CONSTRAINT asset_bank_account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4905 (class 2606 OID 16774)
-- Name: asset_car asset_car_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_car
    ADD CONSTRAINT asset_car_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4907 (class 2606 OID 16800)
-- Name: asset_flat asset_flat_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_flat
    ADD CONSTRAINT asset_flat_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4906 (class 2606 OID 16787)
-- Name: asset_jewelery asset_jewelery_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_jewelery
    ADD CONSTRAINT asset_jewelery_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4912 (class 2606 OID 16878)
-- Name: file file_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4900 (class 2606 OID 16712)
-- Name: user_info fk_tax_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT fk_tax_id FOREIGN KEY (id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4902 (class 2606 OID 16735)
-- Name: income fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.income
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4901 (class 2606 OID 16722)
-- Name: credentials fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4903 (class 2606 OID 16746)
-- Name: expense fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4904 (class 2606 OID 16761)
-- Name: asset_plot fk_user_tax; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_plot
    ADD CONSTRAINT fk_user_tax FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4911 (class 2606 OID 16848)
-- Name: investment investment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investment
    ADD CONSTRAINT investment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4909 (class 2606 OID 16824)
-- Name: liability_bank_loan liability_bank_loan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_bank_loan
    ADD CONSTRAINT liability_bank_loan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4910 (class 2606 OID 16837)
-- Name: liability_person_loan liability_person_loan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.liability_person_loan
    ADD CONSTRAINT liability_person_loan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


--
-- TOC entry 4913 (class 2606 OID 16925)
-- Name: user_log log_table_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_log
    ADD CONSTRAINT log_table_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_tax_info(id);


-- Completed on 2025-05-23 16:44:03

--
-- PostgreSQL database dump complete
--

