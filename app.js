'use strict';
(() => {
  const stock = window.AURUM_STOCK;
  const cars = stock.cars;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const number = value => new Intl.NumberFormat('pl-PL').format(value);
  const money = value => number(value) + ' zł';
  const normalize = value => value.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
  const icons = {
    year:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
    mileage:'<path d="M4 19a10 10 0 1 1 16 0M12 13l5-5"/><circle cx="12" cy="13" r="2"/>',
    fuel:'<path d="M3 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M2 21h13M4 10h9M14 12h2a2 2 0 0 1 2 2v3a2 2 0 0 0 4 0V8l-4-4"/>',
    gearbox:'<circle cx="5" cy="4" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="5" cy="20" r="2"/><circle cx="19" cy="20" r="2"/><path d="M5 6v12m14-12v12M5 12h14"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + icons[name] + '</svg>';
  let filter = 'all';
  const savedCars = new Set();
  let savedOnly = false;
  let currentCar = null;
  let photoIndex = 0;
  let lastSectionHash = '#showroom';
  let previousFocus = null;
  const dialog = $('car-dialog');
  const privacy = $('privacy-dialog');
  const modalOpen = () => dialog.open || privacy.open;
  function syncScrollLock(){ document.body.style.overflow = modalOpen() ? 'hidden' : ''; }
  function selectedCars(){
    const query = normalize($('search').value.trim());
    const budget = Number($('budget').value) || Infinity;
    let result = cars.filter(car =>
      (filter === 'all' || (filter === 'hybrid' ? car.fuel === 'Hybryda' : car.category === filter)) &&
      car.price <= budget && (!savedOnly || savedCars.has(car.id)) &&
      normalize([car.brand,car.name,car.version,car.fuel,car.gearbox,car.year].join(' ')).includes(query));
    const sorters = {'price-up':(a,b)=>a.price-b.price,'price-down':(a,b)=>b.price-a.price,'year':(a,b)=>b.year-a.year,'mileage':(a,b)=>a.mileage-b.mileage};
    if(sorters[$('sort').value]) result = [...result].sort(sorters[$('sort').value]);
    return result;
  }
  function card(car){
    const e = escape;
    const index = String(cars.indexOf(car) + 1).padStart(2, '0');
    const total = String(cars.length).padStart(2, '0');
    const saved = savedCars.has(car.id);
    return '<article class="car-card" data-car="'+e(car.id)+'">' +
      '<div class="card-topline"><span class="card-index" aria-label="Samochód '+index+' z '+total+'">'+index+'<span> / '+total+'</span></span><button class="save-car" type="button" data-save="'+e(car.id)+'" aria-pressed="'+saved+'" aria-label="'+(saved?'Usuń z wybranych: ':'Dodaj do wybranych: ')+e(car.name)+'">'+icon('heart')+'<span>'+(saved?'Wybrane':'Wybierz')+'</span></button></div>' +
      '<a class="card-image" href="#auto='+e(car.id)+'" aria-label="Zobacz '+e(car.name)+' — zdjęcia i szczegóły"><img class="card-photo-primary" src="assets/'+e(car.id)+'-1.jpg" alt="'+e(car.name)+' z oferty AurumtradE" width="600" height="450" loading="lazy"><img class="card-photo-secondary" src="assets/'+e(car.id)+'-2.jpg" alt="" aria-hidden="true" width="600" height="450" loading="lazy"><span class="image-tag">'+e(car.tag)+'</span><span class="card-photo-count">04 zdjęcia</span><span class="image-arrow" aria-hidden="true">↗</span></a>' +
      '<div class="card-body"><div class="card-heading"><h3><a href="#auto='+e(car.id)+'">'+e(car.name)+'</a></h3><p class="card-version">'+e(car.version)+'</p></div>' +
      '<div class="card-specs"><span>'+icon('year')+e(car.year)+'</span><span>'+icon('mileage')+number(car.mileage)+' km</span><span>'+icon('fuel')+e(car.fuel)+'</span><span>'+icon('gearbox')+e(car.gearbox)+'</span></div>' +
      '<div class="card-bottom"><div class="card-price">'+money(car.price)+(car.priceNote?'<small>'+e(car.priceNote)+'</small>':'')+'</div><a class="card-details" href="#auto='+e(car.id)+'" aria-label="Szczegóły: '+e(car.name)+'"><span>Poznaj auto</span><span aria-hidden="true">↗</span></a></div></div></article>';
  }
  function render(){
    const result=selectedCars();
    $('cars-grid').innerHTML=result.map(card).join('');
    $('result-count').textContent=result.length+' '+(result.length===1?'samochód':result.length>=2&&result.length<=4?'samochody':'samochodów')+(savedOnly?' na Twojej liście':' w katalogu');
    $('empty-state').hidden=result.length>0;
    $('reset-filters').hidden=filter==='all'&&!$('search').value&&!$('budget').value&&!savedOnly&&$('sort').value==='selected';
    if($('saved-count')) $('saved-count').textContent=savedCars.size;
    if($('saved-toggle')){
      $('saved-toggle').setAttribute('aria-pressed',String(savedOnly));
      $('saved-toggle').classList.toggle('active',savedOnly);
    }
    document.querySelectorAll('[data-filter]').forEach(button=>{
      const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
  }
  function reset(){filter='all';savedOnly=false;$('search').value='';$('budget').value='';$('sort').value='selected';render();}
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;render();}));
  document.querySelectorAll('[data-use-filter]').forEach(link=>link.addEventListener('click',()=>{reset();filter=link.dataset.useFilter;render();}));
  $('search').addEventListener('input',render);
  $('budget').addEventListener('change',render);
  $('sort').addEventListener('change',render);
  $('reset-filters').addEventListener('click',reset);
  $('reset-empty').addEventListener('click',reset);
  $('cars-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-save]');
    if(!button) return;
    const id = button.dataset.save;
    if(savedCars.has(id)) savedCars.delete(id); else savedCars.add(id);
    render();
    const replacement = Array.from($('cars-grid').querySelectorAll('[data-save]')).find(item=>item.dataset.save===id);
    (replacement || $('saved-toggle') || $('reset-empty')).focus({preventScroll:true});
  });
  if($('saved-toggle')) $('saved-toggle').addEventListener('click',()=>{savedOnly=!savedOnly;render();});
  if($('random-car')) $('random-car').addEventListener('click',()=>{
    const selection = selectedCars();
    if(!selection.length){ $('search').focus(); return; }
    const pick = selection[Math.floor(Math.random()*selection.length)];
    if(location.hash==='#auto='+pick.id) openCar(pick); else location.hash='auto='+pick.id;
  });
  let heroCarId = 'mazda';
  function setHero(id){
    const car = cars.find(item=>item.id===id);
    if(!car) return;
    heroCarId = id;
    const heroImage = $('hero-photo');
    if(heroImage){ heroImage.src=id==='mazda'?'assets/mazda-hero.webp':'assets/'+car.id+'-1.jpg';heroImage.alt=car.name+' z oferty AurumtradE'; }
    const fields = {'hero-model':car.name,'hero-version':car.version,'hero-price':money(car.price),'hero-year':car.year,'hero-fuel':car.fuel};
    Object.entries(fields).forEach(([key,value])=>{if($(key))$(key).textContent=value;});
    if($('hero-link')) $('hero-link').href='#auto='+car.id;
    document.querySelectorAll('[data-hero-car]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.heroCar===id)));
  }
  document.querySelectorAll('[data-hero-car]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.heroCar!==heroCarId)setHero(button.dataset.heroCar);}));
  setHero(heroCarId);
  document.querySelectorAll('.nav-count').forEach(item=>item.textContent=String(cars.length).padStart(2,'0'));
  function updatePhoto(index){
    photoIndex=(index+4)%4;
    const img=$('gallery-photo');
    img.src='assets/'+currentCar.id+'-'+(photoIndex+1)+'.jpg';
    img.alt=currentCar.name+' — zdjęcie '+(photoIndex+1)+' z 4';
    $('gallery-counter').textContent='Zdjęcie '+(photoIndex+1)+' z 4';
    document.querySelectorAll('[data-photo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photo)===photoIndex)));
  }
  function openCar(car){
    const e=escape;
    if(!dialog.open)previousFocus=document.activeElement;
    currentCar=car;photoIndex=0;
    const facts=[['Rok produkcji',car.year],['Przebieg',number(car.mileage)+' km'],['Paliwo',car.fuel],['Skrzynia',car.gearbox],['Pojemność',car.capacity],['Moc',car.power]];
    $('car-detail').innerHTML='<div class="detail-layout"><div class="detail-gallery"><div class="gallery-main"><img id="gallery-photo" src="assets/'+e(car.id)+'-1.jpg" alt="'+e(car.name)+' — zdjęcie 1 z 4"><button class="gallery-button gallery-prev" aria-label="Poprzednie zdjęcie">‹</button><button class="gallery-button gallery-next" aria-label="Następne zdjęcie">›</button></div>' +
      '<div class="gallery-thumbs" role="group" aria-label="Wybór zdjęcia">'+[0,1,2,3].map(i=>'<button data-photo="'+i+'" aria-label="Pokaż zdjęcie '+(i+1)+'" aria-pressed="'+(i===0)+'"><img src="assets/'+e(car.id)+'-'+(i+1)+'.jpg" alt="" loading="lazy"></button>').join('')+'</div><p class="gallery-note"><span id="gallery-counter" role="status">Zdjęcie 1 z 4</span> · Zdjęcia z ogłoszenia AurumtradE.<br><a href="'+e(car.url)+'" target="_blank" rel="noopener noreferrer">Pełna galeria na OTOMOTO ↗</a></p></div>' +
      '<div class="detail-info"><p class="eyebrow">AURUMTRADE · WROCŁAW</p><h2 id="detail-title">'+e(car.name)+'</h2><p class="detail-version">'+e(car.version)+'</p><p class="detail-price">'+money(car.price)+'</p><p class="detail-price-note">'+e(car.priceNote||'Cena z aktualnego ogłoszenia')+'</p><dl class="detail-facts">'+facts.map(f=>'<div><dt>'+e(f[0])+'</dt><dd>'+e(f[1])+'</dd></div>').join('')+'</dl><a class="button gold" href="tel:'+stock.phone+'">Zapytaj o to auto · 501 781 328</a><a class="button navy" href="'+e(car.url)+'" target="_blank" rel="noopener noreferrer">Zobacz ogłoszenie na OTOMOTO ↗</a></div>' +
      '<div class="detail-bottom"><div><h3>Poznaj ten egzemplarz</h3><p>'+e(car.description)+'</p><p>Oględziny: Grottgera 20, Wrocław. Przed przyjazdem ustal termin i potwierdź dostępność.</p></div><div><h3>Wybrane wyposażenie</h3><ul class="equipment">'+car.equipment.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul></div><div class="detail-notes"><h3>Stan, historia i ważne informacje</h3><p>'+e(car.notes)+'</p>'+(car.sourceNote?'<p class="source-note">'+e(car.sourceNote)+'</p>':'')+'<p class="source-note">Informacje według ogłoszenia sprzedawcy. Stan oferty: 03.10.2026. Szczegóły i dokumenty potwierdź przed zakupem.</p></div></div></div>';
    $('car-detail').querySelector('.gallery-prev').addEventListener('click',()=>updatePhoto(photoIndex-1));
    $('car-detail').querySelector('.gallery-next').addEventListener('click',()=>updatePhoto(photoIndex+1));
    document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>updatePhoto(Number(button.dataset.photo))));
    const gallery = $('car-detail').querySelector('.gallery-main');
    let swipeStart = null;
    gallery.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'||event.target.closest('button,a')) return;
      swipeStart={x:event.clientX,y:event.clientY,id:event.pointerId};
      gallery.setPointerCapture(event.pointerId);
    });
    gallery.addEventListener('pointerup',event=>{
      if(!swipeStart||event.pointerId!==swipeStart.id) return;
      const x=event.clientX-swipeStart.x;
      const y=event.clientY-swipeStart.y;
      swipeStart=null;
      if(Math.abs(x)>35&&Math.abs(x)>Math.abs(y)*1.3) updatePhoto(photoIndex+(x<0?1:-1));
    });
    gallery.addEventListener('pointercancel',()=>{swipeStart=null;});
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;syncScrollLock();$('car-close').focus({preventScroll:true});
  }
  function closeCar(updateUrl=true){
    if(dialog.open)dialog.close();currentCar=null;syncScrollLock();
    if(updateUrl&&location.hash.startsWith('#auto='))history.replaceState(null,'',location.pathname+location.search+lastSectionHash);
    if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});
  }
  function readRoute(){
    if(location.hash.startsWith('#auto=')){
      const id=location.hash.slice(6);
      const car=cars.find(item=>item.id===id);
      if(car)openCar(car);else{closeCar(false);history.replaceState(null,'',location.pathname+location.search+'#showroom');}
    }else{lastSectionHash=location.hash||'#showroom';if(dialog.open)closeCar(false);}
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#auto="]');
    if(link&&!location.hash.startsWith('#auto='))lastSectionHash=location.hash||'#showroom';
  });
  window.addEventListener('hashchange',readRoute);
  $('car-close').addEventListener('click',()=>closeCar());
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeCar();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeCar();}});
  dialog.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();updatePhoto(photoIndex+(event.key==='ArrowRight'?1:-1));}});
  const menuToggle=document.querySelector('.menu-toggle');
  function closeMenu(){$('mobile-menu').hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Otwórz menu');}
  menuToggle.addEventListener('click',()=>{const opening=$('mobile-menu').hidden;$('mobile-menu').hidden=!opening;menuToggle.setAttribute('aria-expanded',String(opening));menuToggle.setAttribute('aria-label',opening?'Zamknij menu':'Otwórz menu');});
  $('mobile-menu').querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape') return;
    const restoreMenuFocus=!$('mobile-menu').hidden&&$('mobile-menu').contains(document.activeElement);
    closeMenu();
    if(restoreMenuFocus) menuToggle.focus({preventScroll:true});
  });
  $('privacy-open').addEventListener('click',()=>{privacy.showModal();syncScrollLock();});
  $('privacy-close').addEventListener('click',()=>privacy.close());
  privacy.addEventListener('close',syncScrollLock);
  const navLinks=Array.from(document.querySelectorAll('[data-nav-link]'));
  const navSections=Array.from(new Set(navLinks.map(link=>{
    const hash=link.getAttribute('href');
    return hash&&hash.startsWith('#')?document.getElementById(hash.slice(1)):null;
  }).filter(Boolean)));
  let scrollPending=false;
  function updateScroll(){
    const root=document.documentElement;
    const maxScroll=Math.max(0,root.scrollHeight-window.innerHeight);
    const progress=maxScroll>0?Math.min(1,Math.max(0,window.scrollY/maxScroll)):0;
    if($('scroll-progress')) $('scroll-progress').style.transform='scaleX('+progress+')';
    if($('scroll-percent')) $('scroll-percent').textContent=String(Math.round(progress*100)).padStart(2,'0');
    const passed=navSections.filter(section=>section.getBoundingClientRect().top<=window.innerHeight*0.35);
    const active=passed[passed.length-1]||navSections[0];
    navLinks.forEach(link=>{
      const isActive=Boolean(active&&link.getAttribute('href')==='#'+active.id);
      link.classList.toggle('is-active',isActive);
      if(isActive) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
    scrollPending=false;
  }
  function scheduleScroll(){if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}}
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll,{passive:true});
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if('IntersectionObserver' in window&&!reduceMotion.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
    document.querySelectorAll('.reveal').forEach(element=>{
      element.classList.add('reveal-ready');observer.observe(element);
    });
    reduceMotion.addEventListener('change',event=>{
      if(event.matches){observer.disconnect();document.querySelectorAll('.reveal-ready').forEach(element=>element.classList.add('is-visible'));}
    });
  }
  render();readRoute();
  updateScroll();
})();
