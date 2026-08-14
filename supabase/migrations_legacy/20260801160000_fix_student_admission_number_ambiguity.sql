create or replace function private.assign_student_admission_number()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_admission_year integer; v_next_serial integer;
begin
  if new.admission_date is null then new.admission_date := current_date; end if;
  v_admission_year := extract(year from new.admission_date)::integer;
  if new.admission_number is null or btrim(new.admission_number) = '' then
    insert into private.student_admission_counters as counters(admission_year,last_serial,updated_at)
    values(v_admission_year,1,now())
    on conflict(admission_year) do update set last_serial=counters.last_serial+1,updated_at=now()
    returning last_serial into v_next_serial;
    new.admission_number := format('STD-%s-%s',v_admission_year,lpad(v_next_serial::text,4,'0'));
  end if;
  return new;
end;$$;
