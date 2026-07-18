import { getPool } from "@/db/client";
export async function GET(){try{await getPool().query("SELECT 1");return Response.json({status:"ok",service:"experience-platform",database:"ok",tenant:"mnle"});}catch{return Response.json({status:"degraded",service:"experience-platform",database:"unavailable",tenant:"mnle"},{status:503});}}
