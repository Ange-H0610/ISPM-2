// Simple localStorage-driven mini-app
const LS_KEY = 'tahiry_transactions_v1';

// DOM
const lastUpdateEl = document.getElementById('lastUpdate');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');
const thisMonthEl = document.getElementById('thisMonth');
const txTableBody = document.querySelector('#txTable tbody');

const modal = document.getElementById('modalAdd');
const openAdd = document.getElementById('openAdd');
const closeModal = document.getElementById('closeModal');
const cancelAdd = document.getElementById('cancelAdd');
const addForm = document.getElementById('addForm');
const txType = document.getElementById('txType');
const txCategory = document.getElementById('txCategory');
const txAmount = document.getElementById('txAmount');
const txDate = document.getElementById('txDate');

const quickAddIncome = document.getElementById('quickAddIncome');
const quickAddExpense = document.getElementById('quickAddExpense');

// helper formatting
function formatAr(n){
  if(isNaN(n)) return '0.00 Ar';
  return Number(n).toLocaleString('fr-FR') + ' Ar';
}
function nowStr(){ return new Date().toLocaleString(); }

// load store
function loadTransactions(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return [] }
}
function saveTransactions(arr){
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
  lastUpdateEl.textContent = nowStr();
}

// initial data if empty
if(!localStorage.getItem(LS_KEY)){
  saveTransactions([]);
}

// app state
let txs = loadTransactions();

// chart placeholders
let lineChart=null;

// UI updates
function recalcAndRender(){
  txs = loadTransactions();
  const incomes = txs.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount),0);
  const expenses = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount),0);
  const balance = incomes - expenses;

  totalIncomeEl.textContent = formatAr(incomes);
  totalExpenseEl.textContent = formatAr(expenses);
  totalBalanceEl.textContent = formatAr(balance);
  thisMonthEl.textContent = formatAr(txs.filter(t=>{
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }).reduce((s,t)=> s + (t.type==='income'? Number(t.amount) : -Number(t.amount)),0));

  // table
  txTableBody.innerHTML = '';
  txs.slice().reverse().forEach(t=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.ref}</td>
      <td>${t.type==='income'?'Revenu':'Dépense'}</td>
      <td>${t.category}</td>
      <td>${formatAr(t.amount)}</td>
      <td>${t.date}</td>
      <td><button data-ref="${t.ref}" class="del-btn">Suppr</button></td>
    `;
    txTableBody.appendChild(tr);
  });

  // attach delete handlers
  document.querySelectorAll('.del-btn').forEach(b=>{
    b.addEventListener('click', (ev)=>{
      const ref = ev.currentTarget.dataset.ref;
      txs = txs.filter(x=>x.ref!==ref);
      saveTransactions(txs);
      recalcAndRender();
    });
  });

  // chart: simple monthly sum for last 6 months
  const labels = [];
  const incData = [];
  const expData = [];
  for(let i=5;i>=0;i--){
    const d = new Date();
    d.setMonth(d.getMonth()-i);
    const key = d.getFullYear()+'-'+(d.getMonth()+1);
    labels.push(d.toLocaleString('default',{month:'short',year:'numeric'}));
    const monthTx = txs.filter(t=>{
      const dt = new Date(t.date);
      return dt.getFullYear()===d.getFullYear() && dt.getMonth()===d.getMonth();
    });
    incData.push(monthTx.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount),0));
    expData.push(monthTx.filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount),0));
  }

  if(lineChart) lineChart.destroy();
  const ctx = document.getElementById('lineChart').getContext('2d');
  lineChart = new Chart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[
        {label:'Revenus', data:incData, borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.06)', tension:0.25},
        {label:'Dépenses', data:expData, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.06)', tension:0.25}
      ]
    },
    options:{responsive:true,plugins:{legend:{position:'top'}}}
  });
}

// open modal
openAdd.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','false'); txDate.value = new Date().toISOString().slice(0,10); txAmount.value=''; txCategory.value=''; txType.value='income'; });

// quick actions
quickAddIncome.addEventListener('click', ()=>{ openAdd.click(); txType.value='income'; });
quickAddExpense.addEventListener('click', ()=>{ openAdd.click(); txType.value='expense'; });

// close
closeModal.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
cancelAdd.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));

// add form submit
addForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const type = txType.value;
  const category = txCategory.value || (type==='income'?'Revenu':'Dépense');
  const amount = Math.abs(Number(txAmount.value || 0));
  const date = txDate.value || new Date().toISOString().slice(0,10);
  if(amount<=0) return alert('Montant invalide');

  const ref = 'T-'+Date.now().toString().slice(-6);
  const newTx = {ref,type,category,amount,date};
  txs.push(newTx);
  saveTransactions(txs);
  modal.setAttribute('aria-hidden','true');
  recalcAndRender();
});

// initial render
lastUpdateEl.textContent = nowStr();
recalcAndRender();
