import { z } from "zod";

export const schemaVersion = z.literal("1.0");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"debe ser un slug en kebab-case");
const documentBase={schemaVersion,tenantSlug:slug,programSlug:slug,slug,title:z.string().min(1),status:z.enum(["draft","published"]),order:z.number().int().nonnegative(),contentVersion:z.string().min(1)};
const blockBase={id:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),version:z.number().int().positive().default(1)};
const assetRef=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const aspectRatioSchema=z.discriminatedUnion("type",[
  z.object({type:z.enum(["3:4","4:5","9:16","16:9"])}),
  z.object({type:z.literal("custom"),width:z.number().positive(),height:z.number().positive()}),
]);
export const contentBlockSchema=z.discriminatedUnion("type",[
  z.object({...blockBase,type:z.literal("heading"),text:z.string(),level:z.union([z.literal(2),z.literal(3)])}),
  z.object({...blockBase,type:z.literal("richText"),paragraphs:z.array(z.string().min(1)).min(1)}),
  z.object({...blockBase,type:z.literal("callout"),title:z.string().optional(),text:z.string(),tone:z.enum(["calm","notice"]).default("calm")}),
  z.object({...blockBase,type:z.literal("video"),title:z.string(),assetRef,aspectRatio:aspectRatioSchema.optional()}),
  z.object({...blockBase,type:z.literal("audio"),title:z.string(),assetRef:assetRef.optional()}),
  z.object({...blockBase,type:z.literal("image"),title:z.string(),alt:z.string(),assetRef}),
  z.object({...blockBase,type:z.literal("download"),title:z.string(),description:z.string(),assetRef:assetRef.optional()}),
  z.object({...blockBase,type:z.literal("reflection"),prompt:z.string(),promptKey:assetRef}),
  z.object({...blockBase,type:z.literal("textInput"),label:z.string(),required:z.boolean().default(false)}),
  z.object({...blockBase,type:z.literal("textarea"),label:z.string(),required:z.boolean().default(false),private:z.boolean().default(true)}),
  z.object({...blockBase,type:z.literal("singleChoice"),label:z.string(),options:z.array(z.object({value:assetRef,label:z.string()})).min(2)}),
  z.object({...blockBase,type:z.literal("multiChoice"),label:z.string(),options:z.array(z.object({value:assetRef,label:z.string()})).min(2)}),
  z.object({...blockBase,type:z.literal("scale"),label:z.string(),min:z.number(),max:z.number(),minLabel:z.string().optional(),maxLabel:z.string().optional()}),
  z.object({...blockBase,type:z.literal("checklist"),title:z.string(),items:z.array(z.object({id:assetRef,label:z.string()})).min(1)}),
  z.object({...blockBase,type:z.literal("timer"),title:z.string(),durationSeconds:z.number().int().positive()}),
  z.object({...blockBase,type:z.literal("action"),title:z.string(),description:z.string(),confirmationLabel:z.string().optional()}),
  z.object({...blockBase,type:z.literal("divider")}),
  z.object({...blockBase,type:z.literal("completion"),label:z.string()}),
]);

export const contentAssetSchema=z.object({schemaVersion,key:assetRef,tenantSlug:slug,category:z.enum(["video","audio","image","document"]),provider:z.enum(["youtube","bunny","vimeo","wistia","file"]).optional(),providerMediaId:z.string().optional(),providerMetadata:z.record(z.string(),z.unknown()).default({}),title:z.string(),posterAssetRef:assetRef.optional(),aspectRatio:aspectRatioSchema.default({type:"3:4"}),durationSeconds:z.number().int().positive().optional(),captionsAssetRef:assetRef.optional(),status:z.enum(["placeholder","ready","disabled"])}).superRefine((asset,ctx)=>{if(asset.category==="video"&&!asset.provider)ctx.addIssue({code:"custom",message:"video requiere provider"});if(asset.provider==="bunny"&&asset.status==="ready"&&(!asset.providerMetadata.libraryId||!asset.providerMediaId))ctx.addIssue({code:"custom",message:"Bunny requiere libraryId y videoId"});});
export const tenantContentManifestSchema=z.object({...documentBase,programSlug:z.literal("platform"),productName:z.string(),shortName:z.string()});
export const programContentManifestSchema=z.object({...documentBase,description:z.string(),totalDays:z.number().int().positive(),modules:z.array(z.string()).min(1)});
export const moduleContentDocumentSchema=z.object({...documentBase,description:z.string().optional(),estimatedMinutes:z.number().int().positive().optional(),alwaysAvailable:z.boolean().default(false),unlockRule:z.record(z.string(),z.unknown()).default({}),completionRule:z.record(z.string(),z.unknown()).default({}),blocks:z.array(contentBlockSchema)});

export type ContentBlock=z.infer<typeof contentBlockSchema>;
export type ContentAsset=z.infer<typeof contentAssetSchema>;
export type ModuleContentDocument=z.infer<typeof moduleContentDocumentSchema>;
export type ProgramContentManifest=z.infer<typeof programContentManifestSchema>;
export type TenantContentManifest=z.infer<typeof tenantContentManifestSchema>;
