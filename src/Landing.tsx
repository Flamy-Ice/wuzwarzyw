import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fixtures as f } from './data/fixtures';
import type { BoxId } from './domain/types';
import { money, pricing } from './domain/pricing';
import { Dialog, PostalForm } from './ui';
import { useScrollReveal } from './Motion';

const recipePhotos = ['soup', 'potatoes', 'salad'];
const faq = [
  ['Co dokładnie znajdę w skrzynce?', 'Sezonowe warzywa i owoce. Zestawy powyżej pokazują, czego możesz się spodziewać. Skład zmienia się wraz z sezonem i dostępnością zbiorów.'],
  ['Czy dowozicie pod mój adres?', 'Wpisz kod pocztowy na początku strony. Zanim przejdziesz do konfiguracji, sprawdzisz dostępność dla swojej okolicy. Nieznany kod oznacza, że potrzebujemy potwierdzenia zasięgu.'],
  ['Ile zapłacę razem z dostawą?', 'Każda karta pokazuje pełną cenę z dostawą. Dodatki i jednorazowy kupon zobaczysz w podsumowaniu przed potwierdzeniem.'],
  ['Jak wybrać dzień dostawy?', 'W konfiguratorze wybierzesz jeden z dostępnych terminów. Dzień i pełną cenę zobaczysz ponownie w podsumowaniu.'],
  ['Jak wstrzymać lub anulować subskrypcję?', 'Otwórz swój panel i wybierz Wstrzymaj lub Anuluj. Nie musisz nigdzie dzwonić ani pisać. Ustawienia zachowają się w tej przeglądarce.'],
  ['Co zrobić, jeśli warzyw jest dla mnie za dużo?', 'Zacznij od mniejszej skrzynki lub wstrzymaj kolejną. Wykorzystaj nasze przepisy, a nadmiar warzyw zamroź lub podziel się nim z bliskimi.']
];

export function Landing({ selectBox, postal, setPostal }: {
  selectBox: (id: BoxId) => void; postal: string; setPostal: (value: string) => void;
}) {
  const [week, setWeek] = useState(0);
  const [all, setAll] = useState(false);
  const [recipe, setRecipe] = useState<number | null>(null);
  const [farmer, setFarmer] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  useScrollReveal(root, all);

  return <main id="main" ref={root}>
    <section className="hero" id="dostawa">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="pill hero-enter"><span className="dot"/>Dobrze znać swoje źródło</span>
          <h1 className="hero-enter">Świeże warzywa spod Poznania.<br/><em>Pod Twoje drzwi.</em></h1>
          <p className="lead hero-enter">Mniej supermarketu. Więcej sezonu.<br/>Co tydzień skrzynka warzyw i owoców od {f.farmers.length} lokalnych rolników — w rytmie Twojej kuchni.</p>
          <div className="postal-card hero-enter">
            <PostalForm initial={postal} onSupported={setPostal} onEdit={() => setPostal('')}/>
            {postal && <Link className="button" to="/zamow">Dostawa sprawdzona — konfiguruj →</Link>}
            <a className="browse" href="#skrzynki">Zobacz skrzynki bez podawania kodu <span>↗</span></a>
          </div>
          <p className="reassurance hero-enter"><span aria-hidden="true">✓</span> Pauza i anulowanie jednym kliknięciem. Po Twojemu.</p>
        </div>
        <div className="hero-visual hero-enter">
          <div className="hero-photo-frame"><img src="/images/harvest.jpg" width="1536" height="1024" fetchPriority="high" alt="Drewniana skrzynka pełna świeżych warzyw, liści i jabłek"/></div>
          <div className="harvest-stamp" aria-hidden="true"><span>PROSTO Z POLA</span><svg viewBox="0 0 44 44"><path d="M22 36V18m0 8C7 28 7 13 7 13s15-2 15 13Zm0-5C22 7 37 7 37 7s2 14-15 14Z"/></svg><span>W RYTMIE NATURY</span></div>
          <div className="floating-note"><span className="floating-icon" aria-hidden="true">✦</span><div><strong>Sezon smakuje najlepiej.</strong><small>Dobra ziemia. Dobrzy ludzie. Twoja skrzynka.</small></div></div>
          <span className="photo-caption">Z pól i ogrodów Wielkopolski</span>
        </div>
      </div>
      <div className="container promise-strip" data-reveal>
        <div><span aria-hidden="true">↗</span><p><strong>Blisko, nie z drugiego końca świata</strong><small>Gospodarstwa spod Poznania</small></p></div>
        <div><span aria-hidden="true">◎</span><p><strong>Wiesz, co trafia na stół</strong><small>Sezonowy skład i pełna cena</small></p></div>
        <div><span aria-hidden="true">↺</span><p><strong>Ty ustalasz rytm</strong><small>Pauza i rezygnacja w panelu</small></p></div>
      </div>
    </section>

    <section id="zawartosc" className="section alt">
      <div className="container contents-grid">
        <figure className="harvest" data-reveal>
          <img src="/images/harvest.jpg" width="1536" height="1024" loading="lazy" alt="Marchew, buraki, por, ziemniaki i jabłka w drewnianej skrzynce"/>
          <figcaption className="pill">Każdy tydzień ma swój smak</figcaption>
          <div className="image-footnote"><span aria-hidden="true">✦</span> To, co dobre. Wtedy, kiedy dojrzewa.</div>
        </figure>
        <div data-reveal data-delay="100">
          <span className="eyebrow">Sezon dyktuje menu</span><h2>Zobacz, co może trafić do Twojej skrzynki</h2>
          <p>Nie wszystko rośnie przez cały rok. I dobrze. Skład zmienia się co tydzień, bo natura wie, kiedy smakuje najlepiej.</p>
          <div className="tabs" role="tablist" aria-label="Zawartość tygodni">
            {f.weeks.map((w, i) => <button ref={el => { tabs.current[i] = el; }} key={w.id} id={`tab-${w.id}`} role="tab" aria-selected={week === i} aria-controls="week-content" tabIndex={week === i ? 0 : -1} className={week === i ? '' : 'secondary'} onClick={() => setWeek(i)} onKeyDown={event => {
              let next: number;
              if (event.key === 'ArrowRight') next = (i + 1) % f.weeks.length;
              else if (event.key === 'ArrowLeft') next = (i + f.weeks.length - 1) % f.weeks.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = f.weeks.length - 1;
              else return;
              event.preventDefault(); setWeek(next); tabs.current[next]?.focus();
            }}>{i === 0 ? 'Ten tydzień' : `Tydzień −${i}`}</button>)}
          </div>
          <div id="week-content" role="tabpanel" aria-labelledby={`tab-${f.weeks[week].id}`} tabIndex={0}>
            <p className="small">{f.weeks[week].label}</p>
            <ul className="produce-list" key={week}>{f.weeks[week].items.map(item => <li key={item.name}><span className="leaf-mark" aria-hidden="true">✦</span><div><strong>{item.name}</strong><small>{item.quantity}</small></div></li>)}</ul>
          </div>
          <p className="note">Skład jest poglądowy. Zbiory i pogoda mogą go zmieniać — sezonowość to część dobrego smaku.</p>
        </div>
      </div>
    </section>

    <section id="skrzynki" className="section">
      <div className="container">
        <div className="section-heading" data-reveal><span className="eyebrow">Mała kuchnia czy duży rodzinny stół?</span><h2>Jest skrzynka dla Ciebie.</h2><p>Wybierz tyle, ile zjesz z przyjemnością.<br/>Pełna cena z dostawą. Bez zagadek i bez długich zobowiązań.</p></div>
        <div className="grid three boxes">{f.boxes.map((b, i) => {
          const cost = pricing({ boxId: b.id, quantities: {}, coupon: null });
          return <article data-reveal data-delay={i * 80} key={b.id} className={`card box ${b.id === 'medium' ? 'featured' : ''}`}>
            {b.id === 'medium' && <span className="featured-label">W sam raz dla rodziny</span>}
            <span className={`box-symbol box-symbol-${i}`} aria-hidden="true"><svg viewBox="0 0 80 66"><path d="M12 30h56l-5 29H17Z"/><path d="M12 39h56M16 49h48M28 31l1 28m22-28-1 28"/><path d="M31 30c-19-9-10-23-10-23s17 6 10 23Zm10-1c-7-16 6-24 6-24s10 14-6 24Zm12 0c-2-13 13-17 13-17s2 14-13 17Z"/></svg></span>
            <div className="card-top"><h3>{b.label}</h3><span className="tag">{b.sizeNote}</span></div><p>{b.description}</p>
            <div className="box-price">{money(b.priceGrosze)}<small>/ tydzień</small></div>
            <div className="cost-line"><span>Dostawa</span><strong>{money(b.shippingGrosze)}</strong></div>
            <div className="total-line"><span>Łącznie z dostawą</span><strong>{money(cost.total)}</strong></div>
            <ul className="check-list"><li>{b.estimatedWeight} warzyw i owoców</li><li>{b.illustrativeCount} w sezonowym zestawie</li><li>Warzywa w ich najlepszym momencie</li><li>Pauza i anulowanie w panelu</li></ul>
            <Link className={`button ${b.id === 'medium' ? 'accent' : ''}`} to="/zamow" onClick={() => selectBox(b.id)}>Wybieram tę skrzynkę <span aria-hidden="true">↗</span></Link>
          </article>;
        })}</div>
        <p className="pantry-line" data-reveal><span aria-hidden="true">＋</span><strong>Coś jeszcze do kuchni?</strong> Jajka, chleb na zakwasie i miód dobierzesz przy zamówieniu.</p>
      </div>
    </section>

    <section id="jak" className="section alt">
      <div className="container">
        <div className="section-heading" data-reveal><span className="eyebrow">Mniej planowania. Więcej gotowania.</span><h2>Z pola do kuchni.<br/><em>Po prostu.</em></h2></div>
        <div className="grid three steps-grid">{[
          ['Sprawdź dostawę', 'Zacznij od kodu pocztowego. Przeglądać skrzynki możesz od razu — bez podawania danych.'],
          ['Znajdź swój rozmiar', 'Wybierz ilość, dzień i coś dobrego do skrzynki. Wszystkie koszty poznasz przed potwierdzeniem.'],
          ['Gotuj po swojemu', 'Odkrywaj sezonowe smaki. Potrzebujesz przerwy? Wstrzymujesz lub anulujesz w swoim panelu.']
        ].map(([title, text], i) => <article data-reveal data-delay={i * 100} className="card how" key={title}><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p><span className="small">{['Twój kod, Twoja okolica', 'Pełna cena z dostawą', 'Swoboda od pierwszej skrzynki'][i]} <span aria-hidden="true">↗</span></span></article>)}</div>
      </div>
    </section>

    <section id="rolnicy" className="section">
      <div className="container">
        <div className="section-heading" data-reveal><span className="eyebrow">Za dobrym jedzeniem stoją ludzie</span><h2>Blisko ziemi.<br/><em>Jeszcze bliżej Ciebie.</em></h2><p>Różne gospodarstwa, wspólna pasja do tego, co rośnie.<br/>Poznaj historie z okolic Poznania.</p></div>
        <div className="grid three">{f.farmers.slice(0, all ? f.farmers.length : 6).map((far, i) => <article data-reveal data-delay={(i % 3) * 70} className="card farmer" key={far.id}>
          <div className={`farm-photo farm-photo-${i % 6}`} role="img" aria-label={['Zbiory w szklarni', 'Praca w ogrodzie warzywnym', 'Świeżo zebrane ziemniaki', 'Jabłka w przydomowym sadzie', 'Wiązki czosnku z gospodarstwa', 'Zbiór ziół w ogrodzie'][i % 6]}/>
          <div className="card-body"><span className="tag">{far.area}</span><h3>{far.displayName}</h3><p>{far.specialty}</p><button className="text-button" onClick={() => setFarmer(i)}>Poznaj profil <span aria-hidden="true">↗</span></button></div>
        </article>)}</div>
        <div className="center spaced"><button className="secondary" onClick={() => setAll(!all)}>{all ? 'Pokaż mniej profili' : `Poznaj wszystkie gospodarstwa (${f.farmers.length})`} <span aria-hidden="true">{all ? '−' : '＋'}</span></button></div>
      </div>
    </section>

    <section id="przepisy" className="section alt">
      <div className="container">
        <div className="section-heading" data-reveal><span className="eyebrow">Od skrzynki do ostatniego kęsa</span><h2>Dobry smak.<br/><em>Nic do zmarnowania.</em></h2><p>Proste pomysły na to, co właśnie masz w kuchni.</p></div>
        <div className="recipes">{f.recipes.map((r, i) => <article data-reveal data-delay={i * 90} className="card recipe" key={r.id}>
          <div className="recipe-photo"><img src={`/images/${recipePhotos[i]}.jpg`} alt={r.title} width="1536" height="1024" loading="lazy"/><span className="recipe-time">{r.durationMin} min</span></div>
          <div className="recipe-body"><span className="eyebrow">{['Coś rozgrzewającego', 'Obiad z jednej blachy', 'Świeżo, lekko, chrupiąco'][i]}</span><h3>{r.title}</h3><p>{r.ingredients.join(' · ')}</p><button className="text-button" onClick={() => setRecipe(i)}>Zobacz przepis <span aria-hidden="true">↗</span></button></div>
        </article>)}</div>
        <p className="note zero-waste" data-reveal><span aria-hidden="true">↺</span><span><strong>Mały nawyk, mniej marnowania.</strong> Oddziel liście od warzyw korzeniowych. Najpierw wykorzystuj delikatną zieleninę, a nadmiar zupy zamroź na dzień, kiedy nie chce Ci się gotować.</span></p>
      </div>
    </section>

    <section id="faq" className="section">
      <div className="container faq-layout">
        <div data-reveal><span className="eyebrow">Zanim pojawi się pierwsza skrzynka</span><h2>Dobrze wiedzieć.</h2><p>Proste odpowiedzi.<br/>Żadnych warzywnych tajemnic.</p><a className="text-link" href="#dostawa">Zacznij od swojego kodu ↗</a></div>
        <div className="faq" data-reveal data-delay="100">{faq.map(([question, answer], i) => <details key={question}><summary><span className="faq-number">0{i + 1}</span>{question}</summary><p>{answer}</p></details>)}</div>
      </div>
    </section>

    <section className="section final-cta">
      <img className="cta-photo" src="/images/farm.jpg" alt="" width="1536" height="1024" loading="lazy"/>
      <div className="container" data-reveal><span className="eyebrow">Odrobina natury w każdym tygodniu</span><h2>Dobre rzeczy<br/>rosną <em>blisko.</em></h2><p>Twoja pierwsza skrzynka zaczyna się tutaj.</p><div className="actions"><a className="button accent" href="#dostawa">Sprawdź dostawę <span aria-hidden="true">↗</span></a><a className="button secondary" href="#skrzynki">Wybierz skrzynkę</a></div><small>Sezonowy skład · pełna cena · pauza po Twojemu</small></div>
    </section>

    {recipe !== null && <Dialog title={f.recipes[recipe].title} onClose={() => setRecipe(null)}><img className="dialog-photo" src={`/images/${recipePhotos[recipe]}.jpg`} width="1536" height="1024" alt={f.recipes[recipe].title}/><p>{f.recipes[recipe].durationMin} min · sezonowo i bez pośpiechu</p><h3>Składniki</h3><ul>{f.recipes[recipe].ingredients.map(item => <li key={item}>{item}</li>)}</ul><h3>Przygotowanie</h3><ol>{f.recipes[recipe].steps.map(item => <li key={item}>{item}</li>)}</ol></Dialog>}
    {farmer !== null && <Dialog title={f.farmers[farmer].displayName} onClose={() => setFarmer(null)}><div className={`farm-photo dialog-photo farm-photo-${farmer % 6}`} role="img" aria-label="Praca w gospodarstwie"/><span className="tag">{f.farmers[farmer].area}</span><h3>{f.farmers[farmer].specialty}</h3><p>{f.farmers[farmer].description}</p></Dialog>}
  </main>;
}
