import { useRef, useState } from 'react';
import { fixtures } from './data/fixtures';
export function Referral() {
  const [message,setMessage]=useState('');const input=useRef<HTMLInputElement>(null);
  return <section className="card referral"><span className="eyebrow">Dobrym warto się dzielić</span><h2>Dobry smak idzie dalej</h2><p>Podziel się kodem z kimś, kto też lubi sezonowe gotowanie. Kod nie nalicza rabatów ani nagród.</p><label htmlFor="referral-code">Twój kod polecenia</label><div className="input-row"><input ref={input} id="referral-code" value={fixtures.referral.demoCode} readOnly/><button onClick={async()=>{try{await navigator.clipboard.writeText(fixtures.referral.demoCode);setMessage('Kod skopiowany.');}catch{input.current?.focus();input.current?.select();setMessage('Przeglądarka blokuje schowek. Kod jest zaznaczony — skopiuj go ręcznie.');}}}>Kopiuj kod</button></div><p className="feedback" role="status">{message}</p></section>;
}
