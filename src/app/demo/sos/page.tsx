import { SosExperience } from "@/components/sos-experience";import { getStaticSosAssets } from "@/features/sos/assets";
export default async function DemoSosPage(){return <SosExperience mode="demo" assets={await getStaticSosAssets()} dayHref="/demo/dia/1"/>}
