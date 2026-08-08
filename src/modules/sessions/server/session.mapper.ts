import type { ClassSession } from "../types";
const one=(v:any)=>Array.isArray(v)?v[0]:v;
export function mapSession(row:any):ClassSession {
  const la=one(row.lesson_assignments);
  const student=one(la?.students); const programme=one(la?.programmes); const teacher=one(la?.teachers); const profile=one(teacher?.profiles);
  const studentName=[student?.first_name,student?.middle_name,student?.last_name].filter(Boolean).join(" ")||"Child";
  const teacherName=[profile?.first_name,profile?.last_name].filter(Boolean).join(" ")||profile?.email||"Teacher";
  const statuses=(row.session_attendance??[]) as Array<{status:"pending"|"present"|"absent"|"late"}>;
  const attendance={pending:0,present:0,absent:0,late:0,total:statuses.length}; statuses.forEach(x=>attendance[x.status]++);
  const hw=(row.homework??[]) as Array<{status:"draft"|"published"|"closed"}>;
  const homework={draft:0,published:0,closed:0,total:hw.length}; hw.forEach(x=>homework[x.status]++);
  return { id:row.id, lessonAssignmentId:row.lesson_assignment_id, title:row.title, description:row.description, sessionDate:row.session_date, startTime:row.start_time, endTime:row.end_time, meetingLink:row.meeting_link, status:row.status, createdBy:row.created_by, createdAt:row.created_at, updatedAt:row.updated_at, lessonAssignment:{id:la?.id??"",student:{id:la?.student_id??"",name:studentName},programme:{id:programme?.id??"",name:programme?.name??"Programme"},teacher:{id:la?.teacher_id??"",name:teacherName}}, attendance, homework };
}
