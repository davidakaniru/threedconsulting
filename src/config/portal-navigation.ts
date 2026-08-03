import type { LucideIcon } from "lucide-react";
import { BookOpen, CalendarDays, FileCheck2, GraduationCap, Home, Layers3, MessageSquare, Settings, UserRound, Users } from "lucide-react";
import type { UserRole } from "@/types/auth";
export interface PortalNavigationItem { label:string; href:string; icon:LucideIcon; enabled:boolean; permission?:string; }
export const portalNavigation:Record<UserRole,readonly PortalNavigationItem[]>={
admin:[
{label:"Dashboard",href:"/portal/admin",icon:Home,enabled:true},
{label:"Teachers",href:"/portal/admin/teachers",icon:GraduationCap,enabled:true,permission:"teachers.read"},
{label:"Programmes",href:"/portal/admin/programmes",icon:BookOpen,enabled:true,permission:"programmes.read"},
{label:"Cohorts",href:"/portal/admin/cohorts",icon:Layers3,enabled:true,permission:"cohorts.read"},
{label:"Enrolments",href:"/portal/admin/enrolments",icon:FileCheck2,enabled:true,permission:"enrolments.read"},
{label:"Sessions",href:"/portal/admin/sessions",icon:CalendarDays,enabled:true,permission:"sessions.read"},
{label:"Students",href:"/portal/admin/students",icon:Users,enabled:true,permission:"students.read"},
{label:"Parents",href:"/portal/admin/parents",icon:UserRound,enabled:true,permission:"parents.read"},
{label:"Messages",href:"/portal/admin/messages",icon:MessageSquare,enabled:false,permission:"messages.read"},
{label:"Settings",href:"/portal/profile",icon:Settings,enabled:true}],
teacher:[
{label:"Dashboard",href:"/portal/teacher",icon:Home,enabled:true},
{label:"My programmes",href:"/portal/teacher/programmes",icon:BookOpen,enabled:true},
{label:"My cohorts",href:"/portal/teacher/cohorts",icon:Layers3,enabled:true},
{label:"My sessions",href:"/portal/teacher/sessions",icon:CalendarDays,enabled:true},
{label:"Students",href:"/portal/teacher/students",icon:Users,enabled:false},
{label:"Attendance",href:"/portal/teacher/attendance",icon:CalendarDays,enabled:false},
{label:"Messages",href:"/portal/teacher/messages",icon:MessageSquare,enabled:false},
{label:"Settings",href:"/portal/profile",icon:Settings,enabled:true}],
parent:[{label:"Dashboard",href:"/portal/parent",icon:Home,enabled:true},{label:"My enrolments",href:"/portal/parent/enrolments",icon:FileCheck2,enabled:true},{label:"Messages",href:"/portal/parent/messages",icon:MessageSquare,enabled:false},{label:"Settings",href:"/portal/profile",icon:Settings,enabled:true}]};
export function isPortalNavigationItemActive(pathname:string,item:PortalNavigationItem,role:UserRole){const dashboard=`/portal/${role}`;return pathname===item.href||(item.href!==dashboard&&pathname.startsWith(`${item.href}/`));}
export function findPortalNavigationItem(pathname:string,role:UserRole){return [...portalNavigation[role]].sort((a,b)=>b.href.length-a.href.length).find(item=>pathname===item.href||pathname.startsWith(`${item.href}/`));}
