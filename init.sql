create table persons
(
    id          uuid,
    email       varchar,
    first_name  varchar,
    last_name   varchar,
    phone       varchar,
    address     varchar,
    created_at  information_schema.time_stamp,
    modified_at information_schema.time_stamp,
    active      boolean default true not null
);

alter table persons
    owner to postgres;