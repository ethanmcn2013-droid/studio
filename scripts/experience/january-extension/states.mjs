import assert from 'node:assert/strict';

export async function prepareBrowserState(context, id, state) {
  if (id !== 'studio.page.hq-marketing' || state !== 'populated') return;
  await context.addInitScript(() => localStorage.setItem('signal-mkt-hub-v1', JSON.stringify({
    'VE-01': {status:'queued',note:'Synthetic queued review item'},
    'VE-02': {status:'shipped',note:'Synthetic fixture outcome; no outreach occurred'},
  })));
}

export async function proveMaterialState({page, entry, state, variant, row, fixture, tabTo, shot}) {
  const id = entry.id, gate = state === 'restricted' || id === 'studio.page.hq-access';
  const proof = value => row.interactions.push(value);
  if (gate) {
    assert.equal(await page.locator('#hq-content').count(),0);
    if (state === 'disabled') {
      assert.equal(await page.getByLabel('Password',{exact:true}).count(),0);
      assert.match(await page.locator('main').innerText(),/Without it, HQ stays locked/);
      proof({unconfiguredGate:true,formCount:await page.locator('form').count()});
    } else {
      assert.equal(await page.getByLabel('Password',{exact:true}).count(),1);
      if (state === 'error') assert.equal(await page.getByText('That password did not open Signal HQ.',{exact:true}).count(),1);
      proof({gate:state,errorBanner:state==='error',loginSubmitted:false});
    }
  } else if (!(id === 'studio.page.hq-entitlements-by-lookup' && state === 'error')) {
    assert.equal(await page.locator('#hq-content h1').count(),1,'actual page heading');
  }
  if (gate) return;

  if (id === 'studio.page.hq-waitlist') {
    const text=await page.locator('#hq-content').innerText();
    if(state==='error'){assert.match(text,/Waitlist unread/);assert.equal(await page.locator('#hq-content article').count(),0);}
    else {assert.equal(await page.locator('#hq-content article').count(),fixture.expectedWaitlistCount);assert.ok(fixture.expectedWaitlistCount?text.includes('person-0@example.invalid'):/No .*entries|No one|No waitlist/i.test(text));}
    proof({realWaitlistRead:fixture.expectedWaitlistCount});
  }
  if (id === 'studio.page.hq-entitlements-by-lookup') {
    const body=await page.locator('#hq-content').innerText();
    if(state==='error'){assert.match(body,/Can.t reach the entitlements DB/);assert.equal(await page.getByRole('button',{name:'Revoke',exact:true}).count(),0);}
    else if(state==='empty'){assert.match(body,/No rows for this id/);assert.equal(await page.getByRole('button',{name:'Revoke',exact:true}).count(),0);}
    else {
      assert.equal(await page.locator('h1').innerText(),fixture.person);
      assert.equal(await page.getByRole('heading',{name:`Rows (${fixture.expectedPersonRows})`,exact:true}).count(),1);
      assert.equal(await page.getByRole('heading',{name:`Redemptions (${fixture.expectedPersonRows})`,exact:true}).count(),1);
      assert.equal(await page.getByRole('heading',{name:`History (${fixture.expectedPersonRows})`,exact:true}).count(),1);
      assert.ok(!body.includes('NOT-REDEEMABLE-FIXTURE-'),'lookup renders IDs, not bearer values');
      if(state==='read-only'){assert.match(body,/Viewing as this person, read only/);assert.equal(await page.locator('#hq-content form, #hq-content button').count(),0);}
      if(state==='disabled'){assert.equal(await page.getByRole('button',{name:'Revoke',exact:true}).count(),0);assert.match(body,/revoked/);}
      if(state==='keyboard-only') {
        await tabTo(page.getByRole('button',{name:'Revoke',exact:true}).first());await page.keyboard.press('Enter');
        assert.equal(await page.getByRole('button',{name:'Revoke row',exact:true}).isDisabled(),true);
        await tabTo(page.getByPlaceholder('reason (required)',{exact:true}));await page.keyboard.type('Synthetic reason; do not submit');
        await tabTo(page.getByPlaceholder('type REVOKE',{exact:true}));await page.keyboard.type('REVOKE');
        assert.equal(await page.getByRole('button',{name:'Revoke row',exact:true}).isDisabled(),false);
        row.additionalScreenshots.push(await shot('-armed-no-submit'));
        await tabTo(page.getByRole('button',{name:'Cancel',exact:true}));await page.keyboard.press('Enter');
        assert.equal(await page.getByPlaceholder('type REVOKE',{exact:true}).count(),0);proof({confirmationOpenedArmedCancelled:true,mutationRequests:0});
      }
    }
    proof({actualPersonLookup:fixture.person,rows:fixture.expectedPersonRows,branch:state});
  }
  if(id==='studio.page.hq-health'){
    assert.equal(await page.getByText(fixture.expectedHealth,{exact:true}).count(),1);
    if(variant==='red-failed')assert.match(await page.locator('#hq-content').innerText(),/failed/);
    proof({actualHealth:fixture.expectedHealth,fixtureClock:fixture.seededAt,swallowedReadFailure:variant==='unread',cronExecuted:false});
  }
  if(id==='studio.page.hq-atlas'){
    const search=page.getByPlaceholder('search title, summary, tags…');
    if(state==='empty') {await search.fill('__synthetic-no-atlas-entry__');assert.equal(await page.locator('.atlas-row').count(),0);assert.match(await page.locator('#hq-content').innerText(),/no entries match/);}
    if(state==='keyboard-only') {
      await tabTo(search);await page.keyboard.type('__synthetic-no-atlas-entry__');assert.equal(await page.locator('.atlas-row').count(),0);
      await page.keyboard.press('Control+A');await page.keyboard.press('Backspace');assert.ok(await page.locator('.atlas-row').count());
      for(const name of ['products','processes','data','all']){await tabTo(page.getByRole('button',{name,exact:true}));await page.keyboard.press('Enter');assert.ok(await page.locator('.atlas-row').count());}
      proof({keyboardSearchClearAndAllLenses:true});
    }
    proof({actualCatalogueRows:await page.locator('.atlas-row').count(),zeroMatch:state==='empty'});
  }
  if(id==='studio.page.hq-atlas-by-slug'){
    await page.locator('.atlas-mermaid[data-rendered="true"] svg').first().waitFor({state:'visible'});
    assert.equal(await page.locator('.atlas-mermaid[data-render-error]').count(),0);
    const labels=await page.locator('.atlas-mermaid svg .nodeLabel').allTextContents();
    assert.deepEqual(labels.map(x=>x.trim()).sort(),['cycle opens — copy work','read BRAND.md §','draft against rules','catch-net second read','stage + commit','fix in place'].sort());
    proof({actualMermaidLabels:labels});
    if(state==='keyboard-only'){
      const diagram=page.getByRole('region',{name:'Diagram',exact:true}).first();await tabTo(diagram);
      const before=await diagram.evaluate(e=>e.scrollLeft);await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);
      const geometry=await diagram.evaluate(e=>({left:e.scrollLeft,width:e.clientWidth,total:e.scrollWidth}));
      if(geometry.total>geometry.width)assert.ok(geometry.left>before);
      proof({keyboardDiagram:geometry});
    }
  }
  if(id==='studio.page.hq-org-by-slug'){
    assert.match(await page.locator('h1').innerText(),state==='long-content'?/Director of Engineering/:/Director of Product/);
    assert.equal(await page.locator('#hq-content form, #hq-content input, #hq-content textarea').count(),0);
    proof({readOnlyDirectorProfile:true,saveControls:0});
  }
  if(['studio.page.hq-cards','studio.page.hq-socials'].includes(id)){
    const images=page.locator('#hq-content img');assert.equal(await images.count(),12);
    for(const img of await images.all()) {await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    const assets=await images.evaluateAll(list=>list.map(el=>({src:el.getAttribute('src'),width:el.naturalWidth,height:el.naturalHeight,complete:el.complete})));
    assert.ok(assets.every(a=>a.complete&&a.width>0&&a.height>0&&a.src.startsWith('/brand/collateral/')));
    const links=await page.locator('#hq-content a[href^="/brand/collateral/"]').evaluateAll(list=>list.map(el=>el.getAttribute('href')));
    assert.ok(links.length>=12);
    for(const href of [...new Set(links)]) {const response=await page.request.head(new URL(href,page.url()).href);assert.equal(response.status(),200,'tracked collateral download exists');}
    proof({localImages:assets,localDownloadsChecked:links.length,externalRequest:false});
  }
  if(id==='studio.page.hq-marketing'){
    const view=state==='error'?'engine':state==='empty'?'this week':variant==='week-empty'||variant==='queue'?'this week':variant.startsWith('ledger')?'ledger':['timeline','engine'].includes(variant)?variant:'ideas';
    const tab=page.getByRole('tab',{name:new RegExp('^'+view+'(?: ·|$)')}).first();await tab.click();assert.equal(await tab.getAttribute('aria-selected'),'true');
    if(state==='empty'||variant==='week-empty')assert.match(await page.locator('.mkt-empty').innerText(),/The queue is empty/);
    if(state==='error')assert.match(await page.locator('.mkt-engine').innerText(),/Live partner funnel unavailable/);
    if(variant==='ledger-empty')assert.match(await page.locator('.mkt-empty').innerText(),/Nothing closed yet/);
    if(state==='populated') {
      if(variant==='queue')assert.equal(await page.locator('.mkt-note').inputValue(),'Synthetic queued review item');
      else assert.match(await page.locator('.mkt-ledger-note').innerText(),/Synthetic fixture outcome/);
    }
    if(state==='keyboard-only'){
      await tabTo(page.locator('.mkt-note-add').first());await page.keyboard.press('Enter');
      const note=page.locator('.mkt-note').first();await tabTo(note);await page.keyboard.type('Synthetic keyboard note; no outreach');
      await page.waitForFunction(()=>localStorage.getItem('signal-mkt-hub-v1')?.includes('Synthetic keyboard note'));
      proof({keyboardLocalNotePersisted:true,providerCalls:0});
    }
    proof({marketingView:view,syntheticLocalState:state==='populated',remoteAnalytics:'unconfigured; fallback is not observed use'});
  }
  if(id==='studio.page.hq-platform-readiness')proof({trackedLedger:true,statusText:(await page.locator('#hq-content').innerText()).slice(0,350)});
  if(id==='studio.page.hq-product-hero-design-motion')proof({externalDirections:await page.locator('.hero-room-direction').count(),externalPreviewsFollowed:false});
  if(id==='studio.page.hq-venues')proof({authoredStrategy:true,outreachPerformed:false});
}

export async function proveExperimentationGeometry(page) {
  const rows=await page.locator('.experiment-row').evaluateAll(list=>list.map(row=>{
    const section=row.closest('section').getBoundingClientRect(), box=row.getBoundingClientRect(), description=row.querySelector('.experiment-description');
    const span=description.getBoundingClientRect();
    const range=document.createRange();range.selectNodeContents(description);
    const rects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);
    return {description:description.textContent,containerWidth:section.width,rowWidth:box.width,descriptionWidth:span.width,
      stacked:getComputedStyle(description).gridColumnStart==='1',clipped:rects.some(r=>r.left<section.left-1||r.right>section.right+1),
      allTextInside:rects.every(r=>r.top>=span.top-1&&r.bottom<=span.bottom+1)};
  }));
  assert.equal(rows.length,8);assert.ok(rows.every(r=>r.descriptionWidth>0&&!r.clipped&&r.allTextInside),'all current description text stays inside its visible row');
  return rows;
}
