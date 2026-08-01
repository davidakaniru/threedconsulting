import { createClient } from "@supabase/supabase-js";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.SUPABASE_SECRET_KEY;
const email=process.env.ADMIN_BOOTSTRAP_EMAIL;
const password=process.env.ADMIN_BOOTSTRAP_PASSWORD;
if(!url||!key||!email||!password) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD before running this script.");
const supabase=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
const {data,error}=await supabase.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{first_name:"3D",last_name:"Admin"}});
if(error) throw error;
const {error:profileError}=await supabase.from("profiles").update({role:"admin",status:"active",first_name:"3D",last_name:"Admin"}).eq("id",data.user.id);
if(profileError){await supabase.auth.admin.deleteUser(data.user.id);throw profileError;}
console.log(`Admin created: ${email}`);
