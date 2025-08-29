--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: epic_tide; Type: SCHEMA; Schema: -; Owner: epic_user
--

CREATE SCHEMA epic_tide;


ALTER SCHEMA epic_tide OWNER TO epic_user;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: epic_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO epic_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: path_works; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.path_works (
    path_id uuid NOT NULL,
    work_id uuid NOT NULL,
    sequence integer NOT NULL,
    purpose text
);


ALTER TABLE public.path_works OWNER TO epic_user;

--
-- Name: paths; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.paths (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    path_id character varying(100) NOT NULL,
    phase_id uuid,
    what text NOT NULL,
    version character varying(10) DEFAULT '1.0'::character varying NOT NULL,
    project jsonb,
    decisions jsonb,
    metrics jsonb,
    status character varying(50) DEFAULT 'pending'::character varying,
    current_tide integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    embedding_ada002 public.vector(1536)
);


ALTER TABLE public.paths OWNER TO epic_user;

--
-- Name: patterns; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.patterns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pattern_name character varying(200) NOT NULL,
    source_tide_id uuid,
    pattern_type character varying(50),
    problem_category character varying(100),
    solution jsonb,
    evidence jsonb,
    reusability_score integer,
    pattern_embedding public.vector(1024),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    embedding_ada002 public.vector(1536),
    CONSTRAINT patterns_reusability_score_check CHECK (((reusability_score >= 1) AND (reusability_score <= 10)))
);


ALTER TABLE public.patterns OWNER TO epic_user;

--
-- Name: phases; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.phases (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    phase_id character varying(100) NOT NULL,
    what text NOT NULL,
    version character varying(10) DEFAULT '1.0'::character varying NOT NULL,
    strategy jsonb,
    business jsonb,
    technical jsonb,
    success_criteria jsonb,
    status character varying(50) DEFAULT 'planning'::character varying,
    learnings jsonb,
    patterns_harvested jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    embedding_ada002 public.vector(1536)
);


ALTER TABLE public.phases OWNER TO epic_user;

--
-- Name: tides; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.tides (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tide_number integer NOT NULL,
    path_id uuid,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    outcome character varying(50),
    context jsonb,
    decisions jsonb,
    execution jsonb,
    learnings jsonb,
    troubleshooting jsonb,
    embedding_ada002 public.vector(1536)
);


ALTER TABLE public.tides OWNER TO epic_user;

--
-- Name: works; Type: TABLE; Schema: public; Owner: epic_user
--

CREATE TABLE public.works (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    work_id character varying(100) NOT NULL,
    what text NOT NULL,
    why text,
    how text,
    version character varying(10) DEFAULT '1.0'::character varying NOT NULL,
    context jsonb,
    knowledge jsonb,
    artifacts jsonb,
    troubleshooting jsonb,
    learnings jsonb,
    what_embedding public.vector(1024),
    why_embedding public.vector(1024),
    knowledge_embedding public.vector(1024),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    embedding_ada002 public.vector(1536)
);


ALTER TABLE public.works OWNER TO epic_user;

--
-- Name: path_works path_works_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.path_works
    ADD CONSTRAINT path_works_pkey PRIMARY KEY (path_id, work_id);


--
-- Name: paths paths_path_id_key; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.paths
    ADD CONSTRAINT paths_path_id_key UNIQUE (path_id);


--
-- Name: paths paths_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.paths
    ADD CONSTRAINT paths_pkey PRIMARY KEY (id);


--
-- Name: patterns patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.patterns
    ADD CONSTRAINT patterns_pkey PRIMARY KEY (id);


--
-- Name: phases phases_phase_id_key; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.phases
    ADD CONSTRAINT phases_phase_id_key UNIQUE (phase_id);


--
-- Name: phases phases_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.phases
    ADD CONSTRAINT phases_pkey PRIMARY KEY (id);


--
-- Name: tides tides_path_id_tide_number_key; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.tides
    ADD CONSTRAINT tides_path_id_tide_number_key UNIQUE (path_id, tide_number);


--
-- Name: tides tides_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.tides
    ADD CONSTRAINT tides_pkey PRIMARY KEY (id);


--
-- Name: works works_pkey; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_pkey PRIMARY KEY (id);


--
-- Name: works works_work_id_key; Type: CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_work_id_key UNIQUE (work_id);


--
-- Name: idx_paths_embedding_ada002; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_paths_embedding_ada002 ON public.paths USING ivfflat (embedding_ada002 public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_paths_path_id; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_paths_path_id ON public.paths USING btree (path_id);


--
-- Name: idx_paths_phase; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_paths_phase ON public.paths USING btree (phase_id);


--
-- Name: idx_paths_status; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_paths_status ON public.paths USING btree (status);


--
-- Name: idx_patterns_category; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_patterns_category ON public.patterns USING btree (problem_category);


--
-- Name: idx_patterns_embedding; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_patterns_embedding ON public.patterns USING ivfflat (pattern_embedding public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_patterns_embedding_ada002; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_patterns_embedding_ada002 ON public.patterns USING ivfflat (embedding_ada002 public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_patterns_type; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_patterns_type ON public.patterns USING btree (pattern_type);


--
-- Name: idx_phases_embedding_ada002; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_phases_embedding_ada002 ON public.phases USING ivfflat (embedding_ada002 public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_phases_phase_id; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_phases_phase_id ON public.phases USING btree (phase_id);


--
-- Name: idx_phases_status; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_phases_status ON public.phases USING btree (status);


--
-- Name: idx_tides_embedding_ada002; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_tides_embedding_ada002 ON public.tides USING ivfflat (embedding_ada002 public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_tides_outcome; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_tides_outcome ON public.tides USING btree (outcome);


--
-- Name: idx_tides_path; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_tides_path ON public.tides USING btree (path_id);


--
-- Name: idx_works_embedding_ada002; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_works_embedding_ada002 ON public.works USING ivfflat (embedding_ada002 public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_works_knowledge_embedding; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_works_knowledge_embedding ON public.works USING ivfflat (knowledge_embedding public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_works_what_embedding; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_works_what_embedding ON public.works USING ivfflat (what_embedding public.vector_cosine_ops) WITH (lists='100');


--
-- Name: idx_works_work_id; Type: INDEX; Schema: public; Owner: epic_user
--

CREATE INDEX idx_works_work_id ON public.works USING btree (work_id);


--
-- Name: paths update_paths_updated_at; Type: TRIGGER; Schema: public; Owner: epic_user
--

CREATE TRIGGER update_paths_updated_at BEFORE UPDATE ON public.paths FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: patterns update_patterns_updated_at; Type: TRIGGER; Schema: public; Owner: epic_user
--

CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON public.patterns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: phases update_phases_updated_at; Type: TRIGGER; Schema: public; Owner: epic_user
--

CREATE TRIGGER update_phases_updated_at BEFORE UPDATE ON public.phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: works update_works_updated_at; Type: TRIGGER; Schema: public; Owner: epic_user
--

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: path_works path_works_path_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.path_works
    ADD CONSTRAINT path_works_path_id_fkey FOREIGN KEY (path_id) REFERENCES public.paths(id) ON DELETE CASCADE;


--
-- Name: path_works path_works_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.path_works
    ADD CONSTRAINT path_works_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON DELETE CASCADE;


--
-- Name: paths paths_phase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.paths
    ADD CONSTRAINT paths_phase_id_fkey FOREIGN KEY (phase_id) REFERENCES public.phases(id) ON DELETE CASCADE;


--
-- Name: patterns patterns_source_tide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.patterns
    ADD CONSTRAINT patterns_source_tide_id_fkey FOREIGN KEY (source_tide_id) REFERENCES public.tides(id);


--
-- Name: tides tides_path_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: epic_user
--

ALTER TABLE ONLY public.tides
    ADD CONSTRAINT tides_path_id_fkey FOREIGN KEY (path_id) REFERENCES public.paths(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

