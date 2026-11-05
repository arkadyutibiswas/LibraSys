(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const today = () => new Date().toISOString().slice(0,10);
  const dateLabel = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
  const uid = (prefix) => prefix + Math.random().toString(36).slice(2,7).toUpperCase();
  const starter = {
    books:[
      {id:"B101",title:"The Alchemist",author:"Paulo Coelho",year:1988,total:5,available:5,category:"Fiction"},
      {id:"B102",title:"Wings of Fire",author:"A. P. J. Abdul Kalam",year:1999,total:4,available:3,category:"Biography"},
      {id:"B103",title:"Atomic Habits",author:"James Clear",year:2018,total:6,available:5,category:"Self-help"},
      {id:"B104",title:"The Psychology of Money",author:"Morgan Housel",year:2020,total:3,available:3,category:"Finance"},
      {id:"B105",title:"Clean Code",author:"Robert C. Martin",year:2008,total:2,available:1,category:"Technology"}
    ],
    students:[
      {id:"S101",name:"Aarav Sharma",email:"aarav.sharma@college.edu",since:"2026-07-12"},
      {id:"S102",name:"Ananya Das",email:"ananya.das@college.edu",since:"2026-08-04"},
      {id:"S103",name:"Ishaan Roy",email:"ishaan.roy@college.edu",since:"2026-08-19"},
      {id:"S104",name:"Meera Sen",email:"meera.sen@college.edu",since:"2026-09-02"}
    ],
    transactions:[
      {id:"T1001",bookId:"B102",studentId:"S101",issued:today(),returned:null},
      {id:"T1002",bookId:"B103",studentId:"S102",issued:today(),returned:null},
      {id:"T1003",bookId:"B105",studentId:"S103",issued:today(),returned:null}
    ]
  };
  let db;
  try { db = JSON.parse(localStorage.getItem("librasys_db_v1")) || structuredClone(starter); } catch { db = JSON.parse(JSON.stringify(starter)); }
  const save = () => localStorage.setItem("librasys_db_v1",JSON.stringify(db));
  const book = id => db.books.find(x=>x.id===id);
  const student = id => db.students.find(x=>x.id===id);
  const activeCount = sid => db.transactions.filter(t=>t.studentId===sid&&!t.returned).length;
  let toastTimer;
  function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function coverClass(i){return ["","c2","c3","c4"][i%4];}
  function bookCell(b,i){return '<div class="book-cell"><div class="book-cover '+coverClass(i)+'">'+esc(b.title.slice(0,1).toUpperCase())+'</div><div><div class="book-name">'+esc(b.title)+'</div><div class="book-author">'+esc(b.category||"General")+'</div></div></div>';}
  function statusFor(b){return b.available>0?'<span class="status available">Available</span>':'<span class="status unavailable">Out of stock</span>';}
  function activityRows(){return db.transactions.slice().reverse().slice(0,5).map(t=>{const b=book(t.bookId),s=student(t.studentId);return '<div class="activity-item"><div class="activity-symbol '+(t.returned?"return":"")+'">'+(t.returned?"↩":"⇄")+'</div><div class="activity-copy"><strong>'+(t.returned?"Book returned":"Book issued")+'</strong><p>'+esc(b?.title||t.bookId)+' · '+esc(s?.name||t.studentId)+'</p><time>'+dateLabel(t.returned||t.issued)+'</time></div></div>';}).join("");}
  function render(){
    const issued=db.transactions.filter(t=>!t.returned).length, available=db.books.reduce((n,b)=>n+b.available,0);
    $("#statBooks").textContent=db.books.reduce((n,b)=>n+b.total,0);$("#statAvailable").textContent=available;$("#statIssued").textContent=issued;$("#statStudents").textContent=db.students.length;$("#navBookCount").textContent=db.books.length;
    const recent=db.books.slice(-5).reverse();$("#recentBooks").innerHTML=recent.map((b,i)=>'<tr><td>'+bookCell(b,i)+'</td><td>'+esc(b.id)+'</td><td>'+b.available+' / '+b.total+' copies</td><td>'+statusFor(b)+'</td></tr>').join("");$("#recentEmpty").classList.toggle("hidden",recent.length>0);
    $("#recentActivity").innerHTML=activityRows();$("#activityEmpty").classList.toggle("hidden",db.transactions.length>0);
    renderBooks();renderStudents();renderTransactions();
  }
  function renderBooks(){
    const q=($("#bookSearch")?.value||"").toLowerCase(),f=$("#bookFilter")?.value||"all";
    const rows=db.books.filter(b=>([b.id,b.title,b.author,b.category].join(" ").toLowerCase().includes(q))&&(f==="all"||(f==="available"?b.available>0:b.available===0)));
    $("#booksTable").innerHTML=rows.map((b,i)=>'<tr><td>'+bookCell(b,i)+'</td><td>'+esc(b.id)+'</td><td>'+esc(b.author)+'</td><td>'+b.available+' / '+b.total+'</td><td>'+statusFor(b)+'</td><td><div class="row-actions"><button class="mini-btn" data-action="edit-book" data-id="'+esc(b.id)+'">Edit</button><button class="mini-btn danger" data-action="delete-book" data-id="'+esc(b.id)+'">Delete</button></div></td></tr>').join("");
    $("#booksEmpty").classList.toggle("hidden",rows.length>0);
  }
  function renderStudents(){
    const q=($("#studentSearch")?.value||"").toLowerCase();
    const rows=db.students.filter(s=>(s.id+" "+s.name+" "+s.email).toLowerCase().includes(q));
    $("#studentsTable").innerHTML=rows.map(s=>'<tr><td><div class="book-cell"><div class="avatar">'+esc(s.name.split(" ").map(x=>x[0]).slice(0,2).join(""))+'</div><span class="book-name">'+esc(s.name)+'</span></div></td><td>'+esc(s.id)+'</td><td>'+esc(s.email)+'</td><td>'+activeCount(s.id)+'</td><td>'+dateLabel(s.since)+'</td></tr>').join("");
    $("#studentsEmpty").classList.toggle("hidden",rows.length>0);$("#studentTotal").textContent=rows.length+" members";
  }
  function renderTransactions(){
    const q=($("#transactionSearch")?.value||"").toLowerCase(),f=$("#transactionFilter")?.value||"all";
    const rows=db.transactions.slice().reverse().filter(t=>{const b=book(t.bookId),s=student(t.studentId);return ([t.id,t.bookId,t.studentId,b?.title,s?.name].join(" ").toLowerCase().includes(q))&&(f==="all"||(f==="issued"?!t.returned:!!t.returned));});
    $("#transactionsTable").innerHTML=rows.map(t=>{const b=book(t.bookId),s=student(t.studentId);return '<tr><td><span class="book-name">'+esc(b?.title||t.bookId)+'</span><div class="book-author">'+esc(t.bookId)+'</div></td><td>'+esc(s?.name||t.studentId)+'<div class="book-author">'+esc(t.studentId)+'</div></td><td>'+dateLabel(t.issued)+'</td><td>'+dateLabel(t.returned)+'</td><td><span class="status '+(t.returned?"returned":"issued")+'">'+(t.returned?"Returned":"Issued")+'</span></td><td>'+(t.returned?'<span class="toolbar-note">Completed</span>':'<button class="mini-btn" data-action="return-book" data-id="'+esc(t.id)+'">Return</button>')+'</td></tr>';}).join("");
    $("#transactionsEmpty").classList.toggle("hidden",rows.length>0);
  }
  function showView(name){$$(".page").forEach(p=>p.classList.add("hidden"));$("#view-"+name).classList.remove("hidden");$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$("#crumbName").textContent=({overview:"Overview",books:"Book inventory",students:"Students",transactions:"Transactions"})[name];$("#sidebar").classList.remove("open");}
  function field(label,name,placeholder="",type="text",value="",required=true,full=false){return '<div class="field '+(full?"full":"")+'"><label for="f-'+name+'">'+label+'</label><input id="f-'+name+'" name="'+name+'" type="'+type+'" placeholder="'+placeholder+'" value="'+esc(value)+'" '+(required?"required":"")+'></div>';}
  function selectField(label,name,options){return '<div class="field"><label for="f-'+name+'">'+label+'</label><select id="f-'+name+'" name="'+name+'" required>'+options+'</select></div>';}
  let modalMode="",editingId="";
  function openModal(mode,id=""){
    modalMode=mode;editingId=id;const b=book(id),s=student(id);let title="",fields="",submit="";
    if(mode==="add-book"||mode==="edit-book"){title=mode==="add-book"?"Add a book":"Edit book details";submit=mode==="add-book"?"Add to inventory":"Save changes";fields=field("BOOK ID","id","e.g. B106","text",b?.id||"")+field("TITLE","title","Book title","text",b?.title||"",true,true)+field("AUTHOR","author","Author name","text",b?.author||"")+field("PUBLICATION YEAR","year","e.g. 2022","number",b?.year||"")+field("TOTAL COPIES","total","Number of copies","number",b?.total||"")+selectField("CATEGORY","category",["Fiction","Biography","Technology","Science","Self-help","Finance","History","Other"].map(x=>'<option '+((b?.category||"Fiction")===x?"selected":"")+'>'+x+'</option>').join(""));}
    else if(mode==="add-student"){title="Register a student";submit="Add student";fields=field("STUDENT ID","id","e.g. S105")+field("FULL NAME","name","Student name","text","",true,true)+field("EMAIL ADDRESS","email","student@college.edu","email","",true,true);}
    else if(mode==="issue-book"){title="Issue a book";submit="Confirm issue";fields=selectField("SELECT BOOK","bookId",'<option value="">Choose a book</option>'+db.books.filter(x=>x.available>0).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+' · '+esc(x.id)+' ('+x.available+' available)</option>').join(""))+selectField("SELECT STUDENT","studentId",'<option value="">Choose a student</option>'+db.students.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+' · '+esc(x.id)+'</option>').join(""));}
    $("#modalTitle").textContent=title;$("#modalSubmit").textContent=submit;$("#modalFields").innerHTML=fields;if(mode==="edit-book")$("#f-id").readOnly=true;$("#formError").classList.add("hidden");$("#modalBackdrop").classList.remove("hidden");setTimeout(()=>$("#modalFields input")?.focus(),50);
  }
  function closeModal(){$("#modalBackdrop").classList.add("hidden");}
  function error(msg){$("#formError").textContent=msg;$("#formError").classList.remove("hidden");}
  $("#modalForm").addEventListener("submit",e=>{
    e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());
    if(modalMode==="add-book"||modalMode==="edit-book"){
      const year=Number(d.year),total=Number(d.total);
      if(!d.id.trim()||!d.title.trim()||!d.author.trim())return error("Please complete all required book details.");
      if(!Number.isInteger(year)||year<0||year>new Date().getFullYear())return error("Enter a valid publication year.");
      if(!Number.isInteger(total)||total<1)return error("Total copies must be at least 1.");
      if(modalMode==="add-book"&&db.books.some(x=>x.id.toLowerCase()===d.id.trim().toLowerCase()))return error("That Book ID already exists.");
      if(modalMode==="edit-book"){const old=book(editingId),issued=old.total-old.available;if(total<issued)return error("Total copies cannot be less than the copies currently issued.");Object.assign(old,{title:d.title.trim(),author:d.author.trim(),year,total,available:total-issued,category:d.category});}
      else db.books.push({id:d.id.trim().toUpperCase(),title:d.title.trim(),author:d.author.trim(),year,total,available:total,category:d.category});
      toast(modalMode==="add-book"?"Book added to your inventory.":"Book details updated.");
    }else if(modalMode==="add-student"){
      if(db.students.some(x=>x.id.toLowerCase()===d.id.trim().toLowerCase()))return error("That Student ID already exists.");
      if(db.students.some(x=>x.email.toLowerCase()===d.email.trim().toLowerCase()))return error("That email is already registered.");
      db.students.push({id:d.id.trim().toUpperCase(),name:d.name.trim(),email:d.email.trim(),since:today()});toast("Student registered successfully.");
    }else if(modalMode==="issue-book"){
      const b=book(d.bookId),s=student(d.studentId);if(!b||!s)return error("Please select both a book and a student.");if(b.available<1)return error("No copies of this book are currently available.");
      b.available--;db.transactions.push({id:uid("T"),bookId:b.id,studentId:s.id,issued:today(),returned:null});toast("Book issued successfully.");
    }
    save();render();closeModal();
  });
  function returnTransaction(id){const t=db.transactions.find(x=>x.id===id&&!x.returned);if(!t)return toast("This issue has already been returned.");const b=book(t.bookId);if(!b)return toast("Book record not found.");t.returned=today();b.available=Math.min(b.total,b.available+1);save();render();toast("Book returned. Inventory updated.");}
  document.addEventListener("click",e=>{
    const view=e.target.closest("[data-view]");if(view){showView(view.dataset.view);return;}
    const action=e.target.closest("[data-action]");if(!action)return;
    const a=action.dataset.action,id=action.dataset.id;
    if(a==="add-book"||a==="add-student"||a==="issue-book")openModal(a);
    if(a==="edit-book")openModal(a,id);
    if(a==="delete-book"){const b=book(id);if(!b)return;if(db.transactions.some(t=>t.bookId===id&&!t.returned))return toast("Return all issued copies before deleting this book.");if(confirm("Delete “"+b.title+"” from the inventory?")){db.books=db.books.filter(x=>x.id!==id);save();render();toast("Book deleted.");}}
    if(a==="return-book")returnTransaction(id);
  });
  $("#modalClose").onclick=closeModal;$("#modalCancel").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
  $("#bookSearch").addEventListener("input",renderBooks);$("#bookFilter").addEventListener("change",renderBooks);$("#studentSearch").addEventListener("input",renderStudents);$("#transactionSearch").addEventListener("input",renderTransactions);$("#transactionFilter").addEventListener("change",renderTransactions);
  $("#menuToggle").onclick=()=>$("#sidebar").classList.toggle("open");
  $("#todayLabel").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  save();render();
})();