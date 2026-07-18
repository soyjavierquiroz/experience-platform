import { loadContent } from "@/features/content/loader";
export interface SosAssetSources {audio:string;guide:string;duration:number}
export async function getStaticSosAssets():Promise<SosAssetSources>{const [content]=await loadContent();const audio=content.assets.find(asset=>asset.key==="mnle-sos-audio"),guide=content.assets.find(asset=>asset.key==="mnle-sos-guide");if(!audio?.sourceUrl||!guide?.sourceUrl)throw new Error("SOS assets are not published");return {audio:audio.sourceUrl,guide:guide.sourceUrl,duration:audio.durationSeconds??42}}
