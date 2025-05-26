-- Query for triggers of rule_log table: rebate, income, investment, tax_minimum
CREATE OR REPLACE FUNCTION log_rule_rebate()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_rule_tax_zone_min_tax()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION log_rule_income()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_rule_investment_type()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;


-- For rule_rebate
CREATE TRIGGER trg_log_rule_rebate
AFTER UPDATE ON rule_rebate
FOR EACH ROW
EXECUTE FUNCTION log_rule_rebate();

-- For rule_tax_zone_min_tax
CREATE TRIGGER trg_log_rule_tax_zone_min_tax
AFTER UPDATE ON rule_tax_zone_min_tax
FOR EACH ROW
EXECUTE FUNCTION log_rule_tax_zone_min_tax();
-- For rule_income

CREATE TRIGGER trg_log_rule_income
AFTER UPDATE ON rule_income
FOR EACH ROW
EXECUTE FUNCTION log_rule_income();

-- For rule_investment_type
CREATE TRIGGER trg_log_rule_investment_type
AFTER UPDATE ON rule_investment_type
FOR EACH ROW
EXECUTE FUNCTION log_rule_investment_type();



