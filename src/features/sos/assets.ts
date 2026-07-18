import { loadContent } from "@/features/content/loader";
import type { ContentAsset } from "@/features/content/schema";
export interface SosAssetSources {audio:string;guide:string;duration:number;video:ContentAsset}
export async function getStaticSosAssets():Promise<SosAssetSources>{const [content]=await loadContent();const audio=content.assets.find(asset=>asset.key==="mnle-sos-audio"),guide=content.assets.find(asset=>asset.key==="mnle-sos-guide"),video=content.assets.find(asset=>asset.key==="mnle-module-0-video");if(!audio?.sourceUrl||!guide?.sourceUrl||!video)throw new Error("SOS assets are not published");return {audio:audio.sourceUrl,guide:guide.sourceUrl,duration:audio.durationSeconds??42,video}}
