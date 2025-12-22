const key = 'skill-posts';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const defaults = [
  {id:1,name:'Aarav',offer:'Guitar',want:'Spanish',desc:'Beginner lessons',mode:'online',city:'',contact:'aarav@mail.com',tags:['music']},
  {id:2,name:'Maya',offer:'Python',want:'UI feedback',desc:'Data basics',mode:'online',city:'',contact:'@maya',tags:['coding']}
];

let posts = JSON.parse(localStorage.getItem(key)) || defaults;

const listEl = $('#skills');
const countEl = $('#resultsCount');
const tpl = $('#skillTemplate');

function save(){ localStorage.setItem(key, JSON.stringify(posts)); }

function render(data){
  listEl.innerHTML='';
  data.forEach(p=>{
    const n = tpl.content.cloneNode(true);
    n.querySelector('h4').textContent = `${p.offer} • ${p.name}`;
    n.querySelector('.meta').textContent = p.desc;
    const tags = n.querySelector('[data-tags]');
    (p.tags||[]).forEach(t=>{
      const s=document.createElement('span');
      s.className='tag'; s.textContent='#'+t;
      tags.appendChild(s);
    });
    n.querySelector('[data-contact]').onclick=()=>navigator.clipboard.writeText(p.contact);
    n.querySelector('[data-swap]').onclick=()=>alert('Swap request sent');
    listEl.appendChild(n);
  });
  countEl.textContent = `${data.length} results`;
}

render(posts);

$('#postForm').onsubmit=e=>{
  e.preventDefault();
  const f=e.target;
  const post={
    id:Date.now(),
    name:f.name.value,
    offer:f.offer.value,
    want:f.want.value,
    desc:f.desc.value,
    mode:$('#location').value,
    city:f.city.value,
    contact:f.contact.value,
    tags:f.tags.value.split(',').map(x=>x.trim())
  };
  posts.unshift(post);
  save();
  render(posts);
  f.reset();
};

$('#searchForm').onsubmit=e=>{
  e.preventDefault();
  const q=$('#q').value.toLowerCase();
  const m=$('#mode').value;
  render(posts.filter(p=>{
    return (p.offer+p.want+p.desc).toLowerCase().includes(q) &&
           (m==='any'||p.mode===m);
  }));
};

$('#clearSearch').onclick=()=>{ $('#q').value=''; render(posts); };

$('#exportBtn').onclick=()=>{
  const b=new Blob([JSON.stringify(posts,null,2)]);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);
  a.download='skills.json';
  a.click();
};
