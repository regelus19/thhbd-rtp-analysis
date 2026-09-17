(() => {
  const colors = {fast:'#177c7d', mid:'#d28a22', delayed:'#a65353', navy:'#0a2740', grid:'#dce6ec'};
  const bandData = {
    fast:{title:'≤60-minute cohort', n:53, pct:'51.0%', text:'Median RTP → assignment was approximately <strong>19 minutes</strong> in this cohort.'},
    mid:{title:'61–120-minute cohort', n:22, pct:'21.2%', text:'This middle group accounted for <strong>22 cases</strong>. The available summary did not retain a separate median for this band.'},
    delayed:{title:'>120-minute cohort', n:29, pct:'27.9%', text:'Median RTP → assignment was approximately <strong>267 minutes (4.4 hours)</strong> in this cohort.'}
  };

  Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  Chart.defaults.color = '#607382';

  const dist = new Chart(document.getElementById('distributionChart'), {
    type:'bar',
    data:{labels:['≤60 min','61–120 min','>120 min'],datasets:[{data:[53,22,29],backgroundColor:[colors.fast,colors.mid,colors.delayed],borderRadius:10,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>`${ctx.raw} cases (${(ctx.raw/104*100).toFixed(1)}%)`}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,suggestedMax:60,ticks:{precision:0},grid:{color:colors.grid}}},onClick:(evt,elements)=>{if(!elements.length)return; const idx=elements[0].index; setBand(['fast','mid','delayed'][idx]);}}
  });

  new Chart(document.getElementById('censusChart'), {
    type:'bar',
    data:{labels:['≤60 min','>120 min'],datasets:[{label:'Mean census at RTP',data:[15.25,16.96],backgroundColor:[colors.fast,colors.delayed],borderRadius:12,borderSkipped:false}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>`Mean census: ${ctx.raw}`}}},scales:{x:{grid:{display:false}},y:{beginAtZero:false,min:12,max:20,ticks:{stepSize:1},title:{display:true,text:'Mean 1 East census at RTP'},grid:{color:colors.grid}}}}
  });

  const insight = document.getElementById('bandInsight');
  function setBand(key){
    document.querySelectorAll('.seg').forEach(b=>b.classList.toggle('active',b.dataset.band===key));
    const d=bandData[key];
    insight.innerHTML=`<div class="insight-number">${d.n} cases</div><h3>${d.title}</h3><p>${d.text}</p><p class="muted">${d.pct} of the 104-case cohort.</p>`;
    dist.setActiveElements([{datasetIndex:0,index:{fast:0,mid:1,delayed:2}[key]}]);
    dist.update();
  }
  document.querySelectorAll('.seg').forEach(btn=>btn.addEventListener('click',()=>setBand(btn.dataset.band)));

  const shiftStory=document.getElementById('shiftStory');
  const shiftContent={
    day:{icon:'☀',title:'Daytime pattern',body:'Observed cases were more heavily represented in the prolonged-delay tail. The analysis does not establish whether the difference reflects census, discharge timing, procedural demand, bed compatibility, staffing, or another factor.'},
    night:{icon:'☾',title:'Nighttime pattern',body:'Observed cases were more heavily represented among shorter waits. Exact numeric day/night rates are intentionally not displayed because they were not retained in the summarized source extract.'}
  };
  document.querySelectorAll('.shift-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.shift-btn').forEach(b=>b.classList.toggle('active',b===btn));
    const d=shiftContent[btn.dataset.shift];
    shiftStory.innerHTML=`<div class="shift-icon">${d.icon}</div><div><h3>${d.title}</h3><p>${d.body}</p></div>`;
  }));
})();
