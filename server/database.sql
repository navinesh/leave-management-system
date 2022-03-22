-- Create database

CREATE DATABASE leavedb;

-- Connect to the database

\c leavedb

-- Create user table

CREATE SEQUENCE user_id_seq 
START WITH 1 
INCREMENT BY 1 
NO MINVALUE 
NO MAXVALUE 
CACHE 1;

CREATE TABLE "user"
(
    id integer NOT NULL DEFAULT nextval('user_id_seq') PRIMARY KEY,
    email character varying,
    password_hash character varying,
    surname character varying,
    othernames character varying,
    annual numeric,
    sick numeric,
    bereavement numeric,
    family_care numeric,
    christmas numeric,
    maternity numeric,
    paternity numeric,
    designation text,
    gender text,
    date_of_birth date,
    employee_number numeric,
    is_archived boolean,
    archive_reason text,
    employee_start_date date
);

ALTER TABLE public."user" OWNER TO lms;

ALTER TABLE public.user_id_seq OWNER TO lms;

ALTER SEQUENCE user_id_seq
OWNED BY "user".id;

-- Create userupdates table

CREATE SEQUENCE userupdates_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

CREATE TABLE userupdates
(
    id integer NOT NULL DEFAULT nextval('userupdates_id_seq') PRIMARY KEY,
    annual numeric,
    sick numeric,
    bereavement numeric,
    family_care numeric,
    christmas numeric,
    maternity numeric,
    paternity numeric,
    date_of_birth date,
    designation text,
    gender text,
    employee_number numeric,
    employee_start_date date,
    edit_reason text,
    date_posted character varying,
    reviewed_by character varying,
    user_id integer,
    CONSTRAINT userupdates_user_id_fkey FOREIGN KEY (user_id)
REFERENCES "user" (id)
    MATCH SIMPLE
ON
    UPDATE CASCADE ON
    DELETE CASCADE
);

    ALTER TABLE public.userupdates OWNER TO lms;

    ALTER TABLE public.userupdates_id_seq OWNER TO lms;

    ALTER SEQUENCE userupdates_id_seq
    OWNED BY userupdates.id;

    -- Create leaverecord table

    CREATE SEQUENCE leaverecord_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

    CREATE TABLE leaverecord
    (
        id integer NOT NULL DEFAULT nextval('leaverecord_id_seq') PRIMARY KEY,
        leave_name character varying,
        leave_type character varying,
        start_date character varying,
        end_date character varying,
        leave_days numeric,
        leave_reason character varying,
        leave_status character varying,
        date_posted character varying,
        date_reviewed character varying,
        declined_reason character varying,
        cancelled_reason character varying,
        reviewed_by character varying,
        file_name text,
        user_id integer,
        CONSTRAINT leaverecord_user_id_fkey FOREIGN KEY (user_id)
REFERENCES "user" (id)
        MATCH SIMPLE
ON
        UPDATE CASCADE ON
        DELETE CASCADE
);

        ALTER TABLE public.leaverecord OWNER TO lms;

        ALTER TABLE public.leaverecord_id_seq OWNER TO lms;

        ALTER SEQUENCE leaverecord_id_seq
        OWNED BY leaverecord.id;

        -- Create leaveupdates table

        CREATE SEQUENCE leaveupdates_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

        CREATE TABLE leaveupdates
        (
            id integer NOT NULL DEFAULT nextval('leaveupdates_id_seq') PRIMARY KEY,
            updated_leave_name character varying,
            updated_leave_type character varying,
            updated_start_date character varying,
            updated_end_date character varying,
            updated_leave_days numeric,
            leave_status character varying,
            date_posted character varying,
            edit_reason text,
            previous_leave_days numeric,
            previous_leave_name character varying,
            previous_leave_type character varying,
            previous_start_date character varying,
            previous_end_date character varying,
            reviewed_by character varying,
            user_id integer,
            leave_id integer,
            CONSTRAINT leaveupdates_leave_id_fkey FOREIGN KEY (leave_id)
REFERENCES leaverecord (id)
            MATCH SIMPLE
ON
            UPDATE NO ACTION ON
            DELETE NO ACTION
);

            ALTER TABLE public.leaveupdates OWNER TO lms;

            ALTER TABLE public.leaveupdates_id_seq OWNER TO lms;

            ALTER SEQUENCE leaveupdates_id_seq
            OWNED BY leaveupdates.id;

            -- Create publicholiday table

            CREATE SEQUENCE publicholiday_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

            CREATE TABLE publicholiday
            (
                id integer NOT NULL DEFAULT nextval('publicholiday_id_seq') PRIMARY KEY,
                holiday_date character varying
            );

            ALTER TABLE public.publicholiday OWNER TO lms;

            ALTER TABLE public.publicholiday_id_seq OWNER TO lms;

            ALTER SEQUENCE publicholiday_id_seq
            OWNED BY publicholiday.id;

            -- Create adminuser table

            CREATE SEQUENCE adminuser_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

            CREATE TABLE adminuser
            (
                id integer NOT NULL DEFAULT nextval('adminuser_id_seq') PRIMARY KEY,
                email character varying,
                password_hash character varying,
                surname character varying,
                othernames character varying
            );

            ALTER TABLE public.adminuser OWNER TO lms;

            ALTER TABLE public.adminuser_id_seq OWNER TO lms;

            ALTER SEQUENCE adminuser_id_seq
            OWNED BY adminuser.id;
