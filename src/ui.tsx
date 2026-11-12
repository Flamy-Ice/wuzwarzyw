import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { fixtures } from './data/fixtures';
import { classifyPostal, normalizePostal, postalMessage } from './domain/postal';
import { useReadingProgress } from './Motion';

export function PostalForm({ initial = '', onSupported, onEdit }: {
  initial?: string; onSupported: (code: string) => void; onEdit?: () => void;
}) {
  const [code, setCode] = useState(initial);
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  return <form className="postal-form" noValidate onSubmit={async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setResult('Sprawdzamy Twój kod…');
    await new Promise(resolve => setTimeout(resolve, 180));
    const clean = normalizePostal(code);
    setCode(clean); setResult(postalMessage(clean)); setBusy(false);
    if (classifyPostal(clean) === 'supported') onSupported(clean);
    else ref.current?.focus();
  }}>
    <label htmlFor={id}>Twój kod pocztowy</label>
    <div className="input-row">
      <input ref={ref} id={id} value={code} disabled={busy} onChange={event => { setCode(event.target.value); setResult(''); onEdit?.(); }} placeholder={`np. ${fixtures.postal.supportedPostalCodes[0]}`} inputMode="numeric" autoComplete="postal-code" aria-describedby={`${id}-hint ${id}-result`} aria-invalid={!!result && !busy && classifyPostal(code) !== 'supported'}/>
      <button disabled={busy}>{busy ? 'Sprawdzanie…' : 'Sprawdź dostawę'}<span aria-hidden="true">↗</span></button>
    </div>
    <small id={`${id}-hint`}>Sprawdź, czy jesteśmy w Twojej okolicy.</small>
    <p id={`${id}-result`} className="feedback" role="status">{result}</p>
  </form>;
}

export function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const opener = useRef(document.activeElement as HTMLElement);
  useEffect(() => {
    const dialog = ref.current; dialog?.showModal();
    const previous = opener.current;
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} aria-labelledby={id} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-inner"><button className="secondary close" onClick={onClose} aria-label="Zamknij">×</button><h2 id={id}>{title}</h2>{children}<button onClick={onClose}>Wróć do przeglądania</button></div>
  </dialog>;
}

export const navItems = [['zawartosc', 'Co w skrzynce?'], ['skrzynki', 'Nasze skrzynki'], ['jak', 'Jak to działa'], ['rolnicy', 'Rolnicy'], ['przepisy', 'Przepisy'], ['faq', 'FAQ']];

export function Header() {
  const [open, setOpen] = useState(false);
  useReadingProgress();
  return <>
    <a className="skip" href="#main">Przejdź do treści</a><div className="reading-progress" aria-hidden="true"/>
    <header className="header"><div className="nav-wrap">
      <Link className="brand" to="/" onClick={() => setOpen(false)}><img src="/logo.png" width="40" height="40" alt=""/>wuzwarzyw<span className="brand-dot"/></Link>
      <button className="menu secondary" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>Menu {open ? '−' : '+'}</button>
      <nav id="nav" aria-label="Menu główne" className={open ? 'open' : ''}>
        {navItems.map(([id, label]) => <Link key={id} to={`/#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="button" to="/#dostawa" onClick={() => setOpen(false)}>Sprawdź dostawę <span aria-hidden="true">↗</span></Link>
        <Link className="panel-nav" to="/panel" aria-label="Mój panel" onClick={() => setOpen(false)}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></svg></Link>
      </nav>
    </div></header>
  </>;
}

export function Footer() {
  return <footer><div className="container footer-grid">
    <div><Link className="brand" to="/">wuzwarzyw<span className="dot"/></Link><p>Blisko ziemi.<br/>Blisko Twojej kuchni.</p><small>Sezonowe warzywa i owoce.<br/>Dobry rytm każdego tygodnia.</small></div>
    <div><h3>Odkrywaj</h3>{navItems.slice(0, 4).map(([id, label]) => <Link key={id} to={`/#${id}`}>{label}</Link>)}</div>
    <div><h3>Po Twojemu</h3><Link to="/panel">Mój panel</Link><Link to="/#faq">Pytania i odpowiedzi</Link><Link to="/#zasady">Twoja prywatność</Link></div>
  </div><div className="container legal" id="zasady"><p>Twoje ustawienia są zapisywane w tej przeglądarce. Dane kontaktowe nie są utrwalane ani wysyłane. Ustawienia możesz usunąć w panelu.</p><span>© wuzwarzyw · Fotografie stworzone z pomocą AI.</span></div></footer>;
}
