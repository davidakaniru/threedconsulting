import { NextResponse } from "next/server";
const retired=()=>NextResponse.json({error:{code:"OUT_OF_SCOPE",message:"Homework is not currently available."}},{status:410});
export const GET=retired; export const POST=retired; export const PATCH=retired; export const DELETE=retired;
