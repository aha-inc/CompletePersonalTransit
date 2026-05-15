-- Sprint 1: Initial schema — all core tables with PostGIS and RLS
-- Run via: supabase db push

create extension if not exists postgis;

-- Users (managed by Supabase Auth, this is the profile extension)
create table if not exists user_profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  accessibility_needs  jsonb    not null default '{}',
  preferred_modes      text[]   not null default '{"BUS","RAIL","WALK"}',
  max_walk_meters      integer  not null default 800,
  fare_budget          numeric,
  language_code        text     not null default 'en',
  notification_prefs   jsonb    not null default '{}',
  preference_signals   jsonb    not null default '{}',  -- HX-09: adaptive memory
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table user_profiles enable row level security;
create policy "Users can read own profile"  on user_profiles for select using (auth.uid() = user_id);
create policy "Users can update own profile" on user_profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on user_profiles for insert with check (auth.uid() = user_id);

-- Agencies
create table if not exists agencies (
  id          text primary key,
  name        text not null,
  gtfs_url    text not null,
  gtfs_rt_url text,
  gbfs_url    text,
  timezone    text not null default 'America/New_York',
  updated_at  timestamptz not null default now()
);

-- Routes
create table if not exists routes (
  id              text primary key,
  agency_id       text not null references agencies(id),
  short_name      text,
  long_name       text,
  route_type      integer not null,
  color           text,
  text_color      text
);
create index if not exists routes_agency_idx on routes(agency_id);

-- Stops
create table if not exists stops (
  id              text primary key,
  agency_id       text not null references agencies(id),
  name            text not null,
  location        geometry(Point, 4326) not null,
  wheelchair_boarding integer default 0,
  parent_station  text
);
create index if not exists stops_location_idx on stops using gist(location);
create index if not exists stops_agency_idx on stops(agency_id);

-- Trips / stop_times / calendar (abbreviated — full GTFS spec)
create table if not exists trips (
  id              text primary key,
  route_id        text not null references routes(id),
  service_id      text not null,
  headsign        text,
  direction_id    integer,
  wheelchair_accessible integer default 0
);

create table if not exists stop_times (
  trip_id         text not null references trips(id),
  stop_id         text not null references stops(id),
  arrival_time    interval,
  departure_time  interval,
  stop_sequence   integer not null,
  primary key (trip_id, stop_sequence)
);
create index if not exists stop_times_stop_idx on stop_times(stop_id);

create table if not exists calendar (
  service_id  text primary key,
  monday      boolean not null,
  tuesday     boolean not null,
  wednesday   boolean not null,
  thursday    boolean not null,
  friday      boolean not null,
  saturday    boolean not null,
  sunday      boolean not null,
  start_date  date not null,
  end_date    date not null
);

-- Real-time vehicle positions (TTL enforced by pg_cron or Edge Function)
create table if not exists realtime_vehicle_positions (
  vehicle_id      text not null,
  agency_id       text not null references agencies(id),
  trip_id         text,
  route_id        text,
  location        geometry(Point, 4326) not null,
  bearing         numeric,
  speed           numeric,
  timestamp       timestamptz not null,
  updated_at      timestamptz not null default now(),
  primary key (vehicle_id, agency_id)
);
create index if not exists vehicle_positions_location_idx on realtime_vehicle_positions using gist(location);

-- Service alerts
create table if not exists realtime_alerts (
  id                text primary key,
  agency_id         text not null references agencies(id),
  header_text       text not null,
  description_text  text,
  cause             text,
  effect            text,
  affected_entities jsonb not null default '[]',
  active_period_start timestamptz,
  active_period_end   timestamptz,
  created_at        timestamptz not null default now()
);

-- Pedestrian infrastructure (elevators, escalators, ramps)
create table if not exists pedestrian_infrastructure (
  id              text primary key,
  stop_id         text references stops(id),
  type            text not null, -- 'elevator' | 'escalator' | 'ramp'
  status          text not null default 'operational', -- 'operational' | 'outage' | 'unknown'
  location        geometry(Point, 4326),
  last_checked_at timestamptz
);
create index if not exists ped_infra_location_idx on pedestrian_infrastructure using gist(location);

-- Trip plans
create table if not exists trip_plans (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id),
  origin          geometry(Point, 4326) not null,
  destination     geometry(Point, 4326) not null,
  itinerary       jsonb not null,
  ai_recommendation jsonb,
  navigation_messages jsonb default '[]',  -- HX-04: pre-staged micro-delight messages
  status          text not null default 'draft',
  created_at      timestamptz not null default now()
);
create index if not exists trip_plans_user_idx on trip_plans(user_id);

alter table trip_plans enable row level security;
create policy "Users can read own trip plans" on trip_plans for select using (auth.uid() = user_id or user_id is null);
create policy "Users can insert trip plans"   on trip_plans for insert with check (auth.uid() = user_id or user_id is null);

-- AI decision log (audit trail — no RLS, service role only)
create table if not exists ai_decision_log (
  id              uuid primary key default gen_random_uuid(),
  trip_plan_id    uuid references trip_plans(id),
  model_version   text not null,
  input_hash      text not null,
  output_summary  jsonb not null,
  confidence      numeric not null,
  latency_ms      integer not null,
  created_at      timestamptz not null default now()
);

-- Trip feedback
create table if not exists trip_feedback (
  id                    uuid primary key default gen_random_uuid(),
  trip_plan_id          uuid not null references trip_plans(id),
  user_id               uuid not null references auth.users(id),
  rating                integer not null check (rating between 1 and 5),
  comment               text,
  disruption_encountered boolean not null default false,
  created_at            timestamptz not null default now()
);
alter table trip_feedback enable row level security;
create policy "Users can insert own feedback" on trip_feedback for insert with check (auth.uid() = user_id);
create policy "Users can read own feedback"   on trip_feedback for select using (auth.uid() = user_id);
