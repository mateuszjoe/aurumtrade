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
    gearbox:'<circle cx="5" cy="4" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="5" cy="20" r="2"/><circle cx="19" cy="20" r="2"/><path d="M5 6v12m14-12v12M5 12h14"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + icons[name] + '</svg>';
  let filter = 'all';
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
      car.price <= budget &&
      normalize([car.brand,car.name,car.version,car.fuel,car.gearbox,car.year].join(' ')).includes(query));
    const sorters = {'price-up':(a,b)=>a.price-b.price,'price-down':(a,b)=>b.price-a.price,'year':(a,b)=>b.year-a.year,'mileage':(a,b)=>a.mileage-b.mileage};
    if(sorters[$('sort').value]) result = [...result].sort(sorters[$('sort').value]);
    return result;
  }
  function card(car){
    const e = escape;
    return '<article class="car-card" data-car="'+e(car.id)+'">' +
      '<a class="card-image" href="#auto='+e(car.id)+'" aria-label="Zobacz '+e(car.name)+' — zdjęcia i szczegóły"><img src="assets/'+e(car.id)+'-1.jpg" alt="'+e(car.name)+' z oferty AurumtradE" width="600" height="450" loading="lazy"><span class="image-tag">'+e(car.tag)+'</span><span class="image-arrow" aria-hidden="true">↗</span></a>' +
      '<div class="card-body"><h3><a href="#auto='+e(car.id)+'">'+e(car.name)+'</a></h3><p class="card-version">'+e(car.version)+'</p>' +
      '<div class="card-specs"><span>'+icon('year')+e(car.year)+'</span><span>'+icon('mileage')+number(car.mileage)+' km</span><span>'+icon('fuel')+e(car.fuel)+'</span><span>'+icon('gearbox')+e(car.gearbox)+'</span></div>' +
      '<p class="card-summary">'+e(car.summary)+'</p><div class="card-bottom"><div class="card-price">'+money(car.price)+(car.priceNote?'<small>'+e(car.priceNote)+'</small>':'')+'</div><a class="card-details" href="#auto='+e(car.id)+'" aria-label="Szczegóły: '+e(car.name)+'">Poznaj auto ↗</a></div></div></article>';
  }
  function render(){
    const result=selectedCars();
    $('cars-grid').innerHTML=result.map(card).join('');
    $('result-count').textContent=result.length+' '+(result.length===1?'samochód':result.length>=2&&result.length<=4?'samochody':'samochodów')+' w ofercie';
    $('empty-state').hidden=result.length>0;
    $('reset-filters').hidden=filter==='all'&&!$('search').value&&!$('budget').value;
    document.querySelectorAll('[data-filter]').forEach(button=>{
      const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
  }
  function reset(){filter='all';$('search').value='';$('budget').value='';$('sort').value='selected';render();}
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;render();}));
  document.querySelectorAll('[data-use-filter]').forEach(link=>link.addEventListener('click',()=>{reset();filter=link.dataset.useFilter;render();}));
  $('search').addEventListener('input',render);
  $('budget').addEventListener('change',render);
  $('sort').addEventListener('change',render);
  $('reset-filters').addEventListener('click',reset);
  $('reset-empty').addEventListener('click',reset);
  $('hero-price').textContent=money(cars.find(car=>car.id==='mazda').price);
  document.querySelector('.nav-count').textContent=cars.length;
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
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  $('privacy-open').addEventListener('click',()=>{privacy.showModal();syncScrollLock();});
  $('privacy-close').addEventListener('click',()=>privacy.close());
  privacy.addEventListener('close',syncScrollLock);
  render();readRoute();
})();
