import React, { Component, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Landing } from './Landing';
import { Header, Footer } from './ui';
import { Checkout, Confirmation } from './Checkout';
import { repository } from './data/repository';
import { Dashboard } from './Dashboard';
import type { BoxId } from './domain/types';
import './styles.css';
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main><h1>Coś poszło nie tak</h1><p>Odśwież stronę, aby ponownie uruchomić prototyp.</p><a href="/">Wróć na początek</a></main> : this.props.children; }
}
function App() {
  const [box,setBox] = useState<BoxId>('medium'), [postal,setPostal] = useState('');
  const [record,setRecord] = useState(() => repository.read());
  useEffect(() => { const sync=()=>setRecord(repository.read());window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync); }, []);
  const location = useLocation();
  useEffect(() => { if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); else { window.scrollTo(0,0); const heading=document.querySelector<HTMLElement>('main h1');heading?.setAttribute('tabindex','-1');heading?.focus(); } }, [location]);
  return <><Header/><Routes><Route path="/" element={<Landing selectBox={setBox} postal={postal} setPostal={setPostal}/>}/><Route path="/zamow" element={<Checkout box={box} postal={postal} setPostal={setPostal} onSaved={setRecord}/>}/><Route path="/zamow/potwierdzenie" element={<Confirmation record={record}/>}/><Route path="/panel" element={<Dashboard record={record} onChange={setRecord}/>}/><Route path="*" element={<main id="main" className="container section"><h1>Nie znaleziono strony</h1><Link to="/">Wróć na początek</Link></main>}/></Routes><Footer/></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><BrowserRouter><App/></BrowserRouter></ErrorBoundary></React.StrictMode>);
