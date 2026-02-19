<COMMENT>
-- Trigger function to validate user restriction NEAR
CREATE OR REPLACE FUNCTION trg_val_usr_rest_<VAL_TOP_REL_NAME>_near_func()
RETURNS TRIGGER AS $$
DECLARE
    found_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO found_count
    FROM <A_TABLE_NAME> a
    WHERE <OPERATOR> ST_DWithin(a.geom, NEW.geom, <DISTANCE>)
    LIMIT 1;
    
    IF found_count = 0 THEN
        RAISE EXCEPTION 'User restriction NEAR between <A_TABLE_NAME> and <B_TABLE_NAME> (<B_TABLE_KEYS_FORMAT>) is <NOT_OPERATOR> satisfied (distance=<DISTANCE>)'<B_TABLE_KEYS_ARGS>;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trg_val_usr_rest_<VAL_TOP_REL_NAME>_near ON <B_TABLE_NAME>;
CREATE TRIGGER trg_val_usr_rest_<VAL_TOP_REL_NAME>_near
    BEFORE INSERT OR UPDATE ON <B_TABLE_NAME>
    FOR EACH ROW
    EXECUTE FUNCTION trg_val_usr_rest_<VAL_TOP_REL_NAME>_near_func();

