-- Extend teacher records so a teacher profile can represent the same
-- professional/personal information collected by Become a Tutor.
alter table public.teachers
  add column if not exists address_line_1 text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists expertise text,
  add column if not exists qualifications text;

-- Backfill the new canonical fields from the legacy teacher fields.
update public.teachers
set
  expertise = coalesce(nullif(trim(expertise), ''), specialization),
  qualifications = coalesce(nullif(trim(qualifications), ''), qualification)
where expertise is null or qualifications is null;

alter table public.teachers
  drop constraint if exists teachers_address_line_1_length_check,
  drop constraint if exists teachers_city_length_check,
  drop constraint if exists teachers_country_length_check,
  drop constraint if exists teachers_expertise_length_check,
  drop constraint if exists teachers_qualifications_length_check;

alter table public.teachers
  add constraint teachers_address_line_1_length_check
    check (address_line_1 is null or char_length(trim(address_line_1)) <= 180),
  add constraint teachers_city_length_check
    check (city is null or char_length(trim(city)) <= 100),
  add constraint teachers_country_length_check
    check (country is null or char_length(trim(country)) <= 100),
  add constraint teachers_expertise_length_check
    check (expertise is null or char_length(trim(expertise)) <= 1000),
  add constraint teachers_qualifications_length_check
    check (qualifications is null or char_length(trim(qualifications)) <= 1000);

-- The Become a Tutor fields allow longer free-form responses than the
-- original single-line teacher fields.
alter table public.teachers
  drop constraint if exists teachers_qualification_length_check,
  drop constraint if exists teachers_specialization_length_check;

alter table public.teachers
  add constraint teachers_qualification_length_check
    check (qualification is null or char_length(trim(qualification)) <= 1000),
  add constraint teachers_specialization_length_check
    check (specialization is null or char_length(trim(specialization)) <= 1000);
