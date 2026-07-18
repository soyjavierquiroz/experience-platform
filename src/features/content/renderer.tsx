import type { ContentBlock } from "./schema";

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>;
    case "richText": return <div className="prose-copy">{block.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>;
    case "video": return <section className="video-card" aria-label={`Video: ${block.title}`}><div className="play" aria-hidden="true">▶</div><div><span className="eyebrow">Video guiado · {block.duration ?? "Próximamente"}</span><h2>{block.title}</h2></div></section>;
    case "audio": return <section className="soft-card"><span className="eyebrow">Audio</span><h2>{block.title}</h2><p>Disponible próximamente.</p></section>;
    case "download": return <section className="soft-card resource"><div><span className="eyebrow">Recurso</span><h2>{block.title}</h2><p>{block.description}</p></div><button className="button secondary" disabled>Próximamente</button></section>;
    case "reflection": return <section className="reflection"><span className="eyebrow">Pausa para ti</span><h2>{block.prompt}</h2><textarea aria-label="Tu reflexión" placeholder="Escribe para ti. En esta demo no se guardará." rows={4} /></section>;
    case "action": return <section className="action-card"><span className="eyebrow">Acción del día</span><h2>{block.title}</h2><p>{block.description}</p><button className="button light" type="button">Marcar como hecha</button></section>;
    case "callout": return <aside className={`callout ${block.tone}`}><strong>{block.title}</strong><p>{block.text}</p></aside>;
  }
}
