import Image from "next/image";

export function StudentAvatar({name,email,image}:{name?:string|null;email:string;image?:string|null}){
  const displayName=name?.trim()||email;
  const initials=(name?.trim()||email.split("@")[0]).split(/[\s._-]+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"U";
  return <div className="student-avatar" aria-label={`Perfil de ${displayName}`}>
    {image ? <Image src={image} alt={`Foto de perfil de ${displayName}`} width={44} height={44} unoptimized/> : <span aria-hidden="true">{initials}</span>}
  </div>;
}
