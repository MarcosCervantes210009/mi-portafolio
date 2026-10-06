import { useEffect, useRef, useState } from 'react';
import data from './content.json';
import './style.css';
import './enhancements.css';
import './motion.css';

const { projects, text, timeline, stack, architectures } = data;
const sections = ['home', 'projects', 'about', 'experience', 'contact'];
const featuredIds = ['une-web', 'workshop-crm', 'detoch', 'pdf-parser'];
const email = 'marcosca36@gmail.com';
const github = 'https://github.com/MarcosCervantes210009';
const linkedin = 'https://www.linkedin.com/in/marcos-esteban-cervantes-armada-7b47211a5';
const technologyNames = ['React', 'Next.js', 'Python', 'n8n', 'Supabase', 'PostgreSQL', 'Node.js', 'REST APIs'];
const readPreference = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const Rich = ({ children, ...props }) => <span {...props} dangerouslySetInnerHTML={{ __html: children }} />;
const client = (p, lang) => p[lang].client || p.client;
const projectTags = (p, lang) => p[lang].tags || p.tags;
function Tags({ project, lang }) { return <div className="tags">{projectTags(project, lang).map(tag => <span key={tag}>{tag}</span>)}</div>; }
function Visit({ project, t }) { return project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer">{t.visit} ↗</a> : null; }

function Counter({ value }) {
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame, start;
    const tick = now => { start ??= now; const progress = Math.min(1, (now - start) / 1000); setCount(Math.round(value * (1 - (1 - progress) ** 3))); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return count;
}

export default function App() {
  const [lang, setLang] = useState(() => readPreference('portfolio-language', 'es') === 'en' ? 'en' : 'es');
  const [dark, setDark] = useState(() => readPreference('portfolio-theme', 'dark') !== 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [systemIndex, setSystemIndex] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const dialogRef = useRef(null);
  const progressRef = useRef(null);
    const t = text[lang];
  const featured = featuredIds.map(id => projects.find(p => p.id === id));
  const needle = query.trim().toLocaleLowerCase();
  const filtered = projects.filter(p => (category === 'all' || p.category === category) && [p[lang].name, p[lang].desc, client(p, lang), ...projectTags(p, lang), ...p.tags].join(' ').toLocaleLowerCase().includes(needle));
  const selected = projects.find(p => p.id === caseId);
  const system = architectures[systemIndex];
  const themeLabel = lang === 'es' ? (dark ? 'Tema claro' : 'Tema oscuro') : (dark ? 'Light mode' : 'Dark mode');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.title = lang === 'es' ? 'Marcos Cervantes — Software, IA & Automatización' : 'Marcos Cervantes — Software, AI & Automation';
    document.querySelector('meta[name="description"]').content = lang === 'es' ? 'Ingeniero de software y especialista en IA, automatización e integración de sistemas.' : 'Software engineer and specialist in AI, automation and systems integration.';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0c111b' : '#f5f6f8';
    try { localStorage.setItem('portfolio-language', lang); localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* Storage is optional. */ }
  }, [lang, dark]);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .06 });
    const observe = () => { document.documentElement.classList.toggle('motion-ready', !motion.matches); if (!motion.matches) document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); };
    observe(); motion.addEventListener('change', observe);
    const sectionsObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main > section').forEach(el => sectionsObserver.observe(el));
    let raf;
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`; };
    const scroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    addEventListener('scroll', scroll, { passive: true }); addEventListener('resize', scroll); update();
    return () => { observer.disconnect(); sectionsObserver.disconnect(); motion.removeEventListener('change', observe); removeEventListener('scroll', scroll); removeEventListener('resize', scroll); cancelAnimationFrame(raf); document.documentElement.classList.remove('motion-ready'); };
  }, []);

  useEffect(() => {
    if (caseId && !dialogRef.current.open) dialogRef.current.showModal();
    if (!caseId && dialogRef.current.open) dialogRef.current.close();
  }, [caseId]);

  useEffect(() => {
    const openHash = () => {
      const id = location.hash.slice(1);
      if (!id.startsWith('project-')) return;
      const row = document.getElementById(id);
      if (!row) return;
      row.open = true;
      row.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    };
    addEventListener('hashchange', openHash); openHash();
    return () => removeEventListener('hashchange', openHash);
  }, [category, query]);

  const switchLanguage = () => { setLang(lang === 'es' ? 'en' : 'es'); setCopyStatus(''); };
  const navigateProject = () => { setCategory('all'); setQuery(''); };
  const pointerSpotlight = event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - box.top}px`);
  };
  const copyEmail = async () => { try { await navigator.clipboard.writeText(email); setCopyStatus(lang === 'es' ? 'Correo copiado.' : 'Email copied.'); } catch { setCopyStatus(lang === 'es' ? 'Selecciona el correo para copiarlo.' : 'Select the email address to copy it.'); } };
  const moveSystem = event => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? architectures.length - 1 : (systemIndex + (event.key === 'ArrowRight' ? 1 : -1) + architectures.length) % architectures.length;
    setSystemIndex(next); event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };

  return <>
    <div className="reading-progress" aria-hidden="true"><span ref={progressRef} /></div>
    <div className="display-tools"><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={themeLabel} aria-pressed={dark}><span aria-hidden="true">◐</span><span>{themeLabel}</span></button></div>
    <a className="skip" href="#main">{t.skip}</a>
    <aside className="sidebar">
      <a className="identity" href="#home" aria-label={t.identityAria}><img className="identity-photo" src="/images/marcos.jpg" width="48" height="58" alt="" /><span><strong>Marcos Cervantes</strong><small>{t.identitySubtitle}</small></span></a>
      <nav aria-label={t.navAria}>{sections.map((id, i) => <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''}><span>0{i + 1}</span><b>{t[id]}</b>{id === 'projects' && <i>{projects.length}</i>}</a>)}</nav>
      <div className="sidebar-projects"><p className="eyebrow">{t.selected}</p>{[['une-web', 'UNE', 'UNE Bienes Raíces', t.web], ['workshop-crm', 'WS', 'Workshop CRM', t.workshopStack], ['detoch', 'DM', 'Detoch More', t.industrial]].map(([id, icon, name, caption]) => <a key={id} href={`#project-${id}`} onClick={navigateProject}><span className="mini-icon">{icon}</span><span>{name}<small>{caption}</small></span></a>)}</div>
      <div className="sidebar-footer"><span className="availability"><span /><span>{t.available}</span></span><div className="side-links"><a href={github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><button onClick={switchLanguage} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button></div><small>Aguascalientes, México · UTC−6</small></div>
    </aside>
    <header className="mobile-header"><a href="#home">mc<span>·</span></a><button onClick={switchLanguage} aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}>{lang === 'es' ? 'EN' : 'ES'}</button><button aria-controls="mobile-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{t.menu}</button></header>
    <nav id="mobile-nav" aria-label={t.mobileNavAria} hidden={!menuOpen}>{sections.map(id => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t[id]}</a>)}</nav>
    <main id="main">
      <section id="home" className="hero">
        <div className="hero-atmosphere" aria-hidden="true"><span className="orb orb-one" /><span className="orb orb-two" /><span className="orbit-line" /><span className="grid-glow" /></div>
        <div className="hero-top"><span className="eyebrow">{t.heroEyebrow}</span><span className="edition">{t.edition}</span></div>
        <div className="hero-title"><div><p>{t.hello}</p><h1>Marcos<br />Cervantes<span>·</span></h1><div className="hero-signal"><span aria-hidden="true" />{t.available}</div></div><figure className="hero-portrait"><img src="/images/marcos.jpg" width="1170" height="1402" alt="Marcos Cervantes Armada" fetchPriority="high" /><figcaption className="portrait-label" aria-hidden="true">MC / SOFTWARE ENGINEER</figcaption></figure></div>
        <div className="hero-bottom"><div><p className="role"><Rich>{t.professionalRole}</Rich></p><p className="hero-description">{t.bio}</p><div className="hero-actions"><a href="#projects" className="button primary">{t.viewProjects} <span aria-hidden="true">↗</span></a><a href="#contact" className="button secondary">{t.talk}</a></div></div><div className="hero-note"><span className="code-label">{t.ideaToSystem}</span><p><Rich>{t.note}</Rich></p><span className="mono">2022 — 2026</span></div></div>
        <div className="hero-strip"><div><strong>3+</strong><span>{t.years}</span></div><div><strong><Counter value={projects.length} /></strong><span>{t.portfolioProjects}</span></div><div><strong>C1</strong><span>{t.english}</span></div><div><strong>MX</strong><span>{t.remote}</span></div></div>
      </section>
      <div className="tech-ribbon" aria-hidden="true"><div className="tech-ribbon-track">{[...technologyNames, ...technologyNames].map((name, i) => <span key={`${name}-${i}`}>{name}<b>✦</b></span>)}</div></div>
      <section id="projects" className="section">
        <div className="section-heading reveal"><div><p className="eyebrow">{t.workLabel}</p><h2>{t.workTitle}</h2></div><span className="section-index">[ 01—{projects.length} ]</span></div><p className="section-intro">{t.workIntro}</p>
        <div className="featured">{featured.map((p, i) => <article key={p.id} className="feature-card reveal" onPointerMove={pointerSpotlight} style={{ transitionDelay: `${i % 2 * 80}ms` }}><div className="meta"><span>0{i + 1} / {client(p, lang)}</span><span>{t[p.category]}</span></div><h3>{p[lang].name}</h3><p>{p[lang].desc}</p><div className="flow" aria-label={lang === 'es' ? 'Flujo del proyecto' : 'Project flow'}>{p[lang].flow.map(step => <span key={step}>{step}</span>)}</div><Tags project={p} lang={lang} /><button onClick={() => setCaseId(p.id)}>{t.case} <span aria-hidden="true">↗</span></button><div className="project-links"><Visit project={p} t={t} /></div></article>)}</div>
        <div className="systems-explorer reveal"><div className="systems-heading"><div><p className="eyebrow">{t.systemsLabel}</p><h3>{t.systemsTitle}</h3></div><span className="mono">{t.architecture}</span></div><div className="system-tabs" role="tablist" aria-label={lang === 'es' ? 'Arquitecturas de proyectos' : 'Project architectures'}>{architectures.map((a, i) => <button key={a.project} id={`system-tab-${i}`} role="tab" aria-selected={i === systemIndex} aria-controls="system-panel" tabIndex={i === systemIndex ? 0 : -1} onClick={() => setSystemIndex(i)} onKeyDown={moveSystem}>{a[lang].title}</button>)}</div><div id="system-panel" className="system-panel" role="tabpanel" aria-labelledby={`system-tab-${systemIndex}`} tabIndex="0"><div key={`${systemIndex}-${lang}`} className="system-flow">{system[lang].steps.map(([title, tech], i) => <div className="system-node" key={title}><b>0{i + 1}</b><strong>{title}</strong><small>{tech}</small></div>)}</div><p className="system-description">{system[lang].desc}</p><a className="system-project-link" href={`#project-${system.project}`} onClick={navigateProject}>{lang === 'es' ? 'Explorar este proyecto' : 'Explore this project'}</a></div></div>
        <div className="catalog-heading"><h3>{t.archive}</h3><span className="mono" aria-live="polite">{filtered.length} / {projects.length} {t.count}</span></div><div className="catalog-controls"><div className="filters" role="group" aria-label={lang === 'es' ? 'Filtrar proyectos' : 'Filter projects'}>{['all', 'product', 'ai', 'automation', 'data', 'web', 'experiment'].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{t[c]}</button>)}</div><label className="search"><span>{t.searchLabel}</span><input type="search" placeholder={t.searchPlaceholder} autoComplete="off" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
        <div className="project-list" >{filtered.map(p => <details className="project-row" id={`project-${p.id}`} key={p.id}><summary><span className="project-num">{String(projects.indexOf(p) + 1).padStart(2, '0')}</span><span><h4>{p[lang].name}</h4><span className="project-client">{client(p, lang)}</span></span><span className="project-category">{t[p.category]}</span><span className="expand" aria-hidden="true">+</span></summary><div className="project-body"><p>{p[lang].desc}</p><Tags project={p} lang={lang} /><div className="project-links"><Visit project={p} t={t} /></div></div></details>)}</div>{!filtered.length && <p>{t.empty}</p>}
      </section>
      <section id="about" className="section about-section"><div className="section-heading reveal"><div><p className="eyebrow">{t.aboutLabel}</p><h2><Rich>{t.aboutTitle}</Rich></h2></div></div><div className="about-grid"><div className="about-copy reveal"><p>{t.aboutText}</p><p>{t.aboutText2}</p><p>{t.aboutText3}</p><div className="profile-facts"><div><span>{t.education}</span><strong><Rich>{t.degree}</Rich></strong></div><div><span>{t.languages}</span><strong>{t.languageLevel}</strong></div></div></div><div className="stack-panel reveal"><p className="eyebrow">{t.toolsLabel}</p>{stack.map(([, tools], i) => <div className="stack-group" key={i}><h3>{t[`stack${i}`]}</h3><p>{tools}</p></div>)}</div></div></section>
      <section id="experience" className="section"><div className="section-heading reveal"><div><p className="eyebrow">{t.experienceLabel}</p><h2>{t.experienceTitle}</h2></div></div><div id="timeline">{timeline.map((row, i) => <article className="timeline-row reveal" key={i}><time>{row[lang][0]}</time><div><h3>{row[lang][1]}</h3><span className="company">{row[lang][2]}</span><p>{row[lang][3]}</p></div></article>)}</div></section>
      <section id="contact" className="section contact-section"><p className="eyebrow">{t.contactLabel}</p><h2 className="reveal"><Rich>{t.contactTitle}</Rich></h2><p>{t.contactText}</p><div className="email-actions"><a className="email" href={`mailto:${email}`}>{email}</a><button className="copy-email" onClick={copyEmail}>{t.copyEmail}</button><span role="status" aria-live="polite">{copyStatus}</span></div><div className="contact-links"><a href={`/cv/Marcos_Cervantes_CV_${lang.toUpperCase()}.pdf`} download>{t.cv}</a><a href="https://wa.me/524493635139" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a href={github} target="_blank" rel="noopener noreferrer">GitHub</a></div></section>
      <footer><span>© 2026 Marcos Cervantes Armada</span><a href="#home">{t.backTop} ↑</a></footer>
    </main>
    <dialog ref={dialogRef} aria-labelledby="case-title" onClose={() => setCaseId(null)} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setCaseId(null); } }}><button className="close-dialog" onClick={() => setCaseId(null)}>{t.close}</button>{selected && <div><p className="eyebrow">{client(selected, lang)}</p><h2 id="case-title">{selected[lang].name}</h2><p>{selected[lang].desc}</p>{selected.case?.[lang] && <><h3>{t.problem}</h3><p>{selected.case[lang].problem}</p><h3>{t.built}</h3><ul>{selected.case[lang].built.map(line => <li key={line}>{line}</li>)}</ul><h3>{t.result}</h3><p>{selected.case[lang].result}</p></>}<h3>{t.tech}</h3><Tags project={selected} lang={lang} /><div className="project-links"><Visit project={selected} t={t} /></div></div>}</dialog>
  </>;
}
