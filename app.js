(() => {
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const today=()=>new Date().toISOString().slice(0,10);
const addDays=(date,days)=>{const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);};
const dateLabel=d=>d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";
const uid=()=>"T"+Math.random().toString(36).slice(2,8).toUpperCase();
const catalogue=[
["B101","The Alchemist","Paulo Coelho",1988,5,"Fiction"],["B102","Wings of Fire","A. P. J. Abdul Kalam",1999,4,"Biography"],["B103","Atomic Habits","James Clear",2018,6,"Self-help"],["B104","The Psychology of Money","Morgan Housel",2020,4,"Finance"],["B105","Clean Code","Robert C. Martin",2008,3,"Technology"],["B106","Harry Potter and the Philosopher's Stone","J. K. Rowling",1997,5,"Fantasy"],["B107","The Hobbit","J. R. R. Tolkien",1937,4,"Fantasy"],["B108","1984","George Orwell",1949,4,"Classics"],["B109","To Kill a Mockingbird","Harper Lee",1960,3,"Classics"],["B110","Pride and Prejudice","Jane Austen",1813,3,"Classics"],["B111","The Great Gatsby","F. Scott Fitzgerald",1925,3,"Classics"],["B112","The Book Thief","Markus Zusak",2005,3,"Fiction"],["B113","The Silent Patient","Alex Michaelides",2019,4,"Mystery"],["B114","And Then There Were None","Agatha Christie",1939,3,"Mystery"],["B115","The Da Vinci Code","Dan Brown",2003,4,"Mystery"],["B116","The Fault in Our Stars","John Green",2012,3,"Fiction"],["B117","Sapiens","Yuval Noah Harari",2011,4,"History"],["B118","A Brief History of Time","Stephen Hawking",1988,3,"Science"],["B119","The Diary of a Young Girl","Anne Frank",1947,3,"Biography"],["B120","Rich Dad Poor Dad","Robert T. Kiyosaki",1997,4,"Finance"],["B121","Deep Work","Cal Newport",2016,3,"Self-help"],["B122","The Pragmatic Programmer","Andrew Hunt & David Thomas",1999,3,"Technology"],["B123","The Catcher in the Rye","J. D. Salinger",1951,2,"Classics"],["B124","The Lord of the Rings","J. R. R. Tolkien",1954,3,"Fantasy"],["B125","The Midnight Library","Matt Haig",2020,4,"Fiction"],["B126","Think Like a Monk","Jay Shetty",2020,3,"Self-help"],["B127","The Immortals of Meluha","Amish Tripathi",2010,3,"Fiction"],["B128","The Blue Umbrella","Ruskin Bond",1980,3,"Fiction"]];
const sampleStudents=[{id:"S101",name:"Aarav Sharma",email:"aarav.sharma@college.edu",since:"2026-07-12"},{id:"S102",name:"Ananya Das",email:"ananya.das@college.edu",since:"2026-08-04"},{id:"S103",name:"Ishaan Roy",email:"ishaan.roy@college.edu",since:"2026-08-19"},{id:"S104",name:"Meera Sen",email:"meera.sen@college.edu",since:"2026-09-02"}];
const starter={books:catalogue.map(([id,title,author,year,total,category])=>({id,title,author,year,total,available:total,category})),students:sampleStudents,transactions:[]};
let db;try{db=JSON.parse(localStorage.getItem("librasys_db_v1"))||structuredClone(starter);}catch{db=JSON.parse(JSON.stringify(starter));}
db.books=db.books||[];db.students=db.students||[];db.transactions=db.transactions||[];db.requests=db.requests||[];
catalogue.forEach(([id,title,author,year,total,category])=>{if(!db.books.some(b=>b.id===id))db.books.push({id,title,author,year,total,available:total,category});});
sampleStudents.forEach(s=>{if(!db.students.some(x=>x.id===s.id))db.students.push(s);});
db.transactions.forEach(t=>{if(!t.dueDate)t.dueDate=addDays(t.issued||today(),14);});
let currentStudentId=localStorage.getItem("librasys_student_v1")||"S101";if(!db.students.some(s=>s.id===currentStudentId))currentStudentId="S101";
const currentStudent=()=>db.students.find(s=>s.id===currentStudentId)||db.students[0],save=()=>{localStorage.setItem("librasys_db_v1",JSON.stringify(db));localStorage.setItem("librasys_student_v1",currentStudentId);},book=id=>db.books.find(b=>b.id===id);
const activeForMe=()=>db.transactions.filter(t=>t.studentId===currentStudentId&&!t.returned),isOverdue=t=>!t.returned&&t.dueDate<today();
let toastTimer;function toast(m){const el=$("#toast");el.textContent=m;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(n){return n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function status(b){return b.available>0?'<span class="status available">Available</span>':'<span class="status unavailable">All copies borrowed</span>';}
function bookCell(b,i){const cover='<span class="book-cover cover-'+(i%6)+'">'+esc(b.title.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase())+'</span>';return '<div class="book-cell">'+cover+'<div><div class="book-name">'+esc(b.title)+'</div><div class="book-author">'+esc(b.category)+' · '+esc(b.year)+'</div></div></div>';}
function renderProfile(){const s=currentStudent();$("#sideStudentName").textContent=s.name;$("#sideInitials").textContent=initials(s.name);$("#topInitials").textContent=initials(s.name);$("#welcomeName").textContent=s.name.split(" ")[0];$("#studentSwitch").innerHTML=db.students.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===currentStudentId?'selected':'')+'>'+esc(x.name)+'</option>').join("");}
function renderDashboard(){const active=activeForMe();$("#statBooks").textContent=db.books.length;$("#statAvailable").textContent=db.books.reduce((n,b)=>n+b.available,0);$("#statIssued").textContent=active.length;$("#statOverdue").textContent=active.filter(isOverdue).length;$("#navBookCount").textContent=db.books.length;
$("#popularBooks").innerHTML=db.books.slice(0,6).map((b,i)=>'<article class="popular-book">'+bookCell(b,i)+'<div class="popular-bottom">'+status(b)+'<div class="book-actions"><button class="detail-btn" data-action="details" data-id="'+esc(b.id)+'">Details</button>'+(b.available>0?'<button class="mini-btn borrow-btn" data-action="borrow" data-id="'+esc(b.id)+'">Borrow</button>':'<button class="mini-btn borrow-btn" data-action="request" data-id="'+esc(b.id)+'">Request</button>')+'</div></div></article>').join("");
$("#dashboardLoans").innerHTML=active.slice(0,4).map(t=>{const b=book(t.bookId);return '<div class="loan-row"><div class="loan-icon">▤</div><div class="loan-copy"><strong>'+esc(b?.title||t.bookId)+'</strong><small>Due '+dateLabel(t.dueDate)+'</small></div><span class="status '+(isOverdue(t)?'unavailable':'issued')+'">'+(isOverdue(t)?'Overdue':'On loan')+'</span></div>';}).join("");$("#dashboardLoansEmpty").classList.toggle("hidden",active.length>0);}
function renderBooks(){const q=$("#bookSearch").value.toLowerCase(),f=$("#bookFilter").value;const rows=db.books.filter(b=>([b.id,b.title,b.author,b.category].join(" ").toLowerCase().includes(q))&&(f==="all"||(f==="available"?b.available>0:f==="unavailable"?b.available===0:b.category===f)));$("#booksTable").innerHTML=rows.map((b,i)=>'<tr><td>'+bookCell(b,i)+'</td><td>'+esc(b.author)+'</td><td>'+b.year+'</td><td>'+b.available+' of '+b.total+' available</td><td>'+'<div class="book-actions"><button class="detail-btn" data-action="details" data-id="'+esc(b.id)+'">Details</button>'+(b.available>0?'<button class="mini-btn borrow-btn" data-action="borrow" data-id="'+esc(b.id)+'">Borrow</button>':'<button class="mini-btn borrow-btn" data-action="request" data-id="'+esc(b.id)+'">Request</button>')+'</div>'+'</td></tr>').join("");$("#booksEmpty").classList.toggle("hidden",rows.length>0);$("#catalogueCount").textContent=rows.length+" titles shown · "+db.books.length+" in collection";}
function renderTransactions(){const q=$("#transactionSearch").value.toLowerCase(),f=$("#transactionFilter").value;const rows=db.transactions.filter(t=>t.studentId===currentStudentId).slice().reverse().filter(t=>{const b=book(t.bookId);return (String(t.id)+" "+(b?.title||t.bookId)).toLowerCase().includes(q)&&(f==="all"||(f==="issued"?!t.returned:f==="returned"?!!t.returned:isOverdue(t)));});$("#transactionsTable").innerHTML=rows.map(t=>{const b=book(t.bookId),late=isOverdue(t);return '<tr><td><span class="book-name">'+esc(b?.title||t.bookId)+'</span><div class="book-author">'+esc(b?.author||"")+'</div></td><td>'+dateLabel(t.issued)+'</td><td>'+dateLabel(t.dueDate)+'</td><td>'+dateLabel(t.returned)+'</td><td><span class="status '+(t.returned?'returned':late?'unavailable':'issued')+'">'+(t.returned?'Returned':late?'Overdue':'Borrowed')+'</span></td><td>'+(t.returned?'<span class="toolbar-note">Complete</span>':'<button class="mini-btn" data-action="return" data-id="'+esc(t.id)+'">Return book</button>')+'</td></tr>';}).join("");$("#transactionsEmpty").classList.toggle("hidden",rows.length>0);$("#loanSummary").textContent=activeForMe().length+" active · "+db.transactions.filter(t=>t.studentId===currentStudentId&&t.returned).length+" returned";}
function render(){renderProfile();renderDashboard();renderBooks();renderTransactions();renderRequests();}

function descriptionFor(b){
 const descriptions={
 "The Alchemist":"A young shepherd follows a recurring dream on a journey about purpose, courage and finding one's own path.",
 "Wings of Fire":"The autobiography of A. P. J. Abdul Kalam, tracing his childhood and journey in India's scientific and space programmes.",
 "Atomic Habits":"A practical guide to building better routines through small, repeatable changes.",
 "The Psychology of Money":"Lessons about how behaviour, emotion and personal experience shape financial decisions.",
 "Clean Code":"A software craftsmanship guide focused on readable, maintainable code.",
 "Harry Potter and the Philosopher's Stone":"A young boy discovers a hidden magical world and begins an extraordinary first year at Hogwarts.",
 "The Hobbit":"Bilbo Baggins is drawn into an unexpected adventure across Middle-earth.",
 "1984":"A classic dystopian novel about surveillance, authoritarian power and the struggle to hold on to truth.",
 "To Kill a Mockingbird":"A story of childhood, justice and empathy in a small Southern town.",
 "Pride and Prejudice":"Jane Austen's novel follows Elizabeth Bennet as she navigates family, first impressions and love.",
 "The Great Gatsby":"A portrait of ambition, wealth and longing in the Jazz Age.",
 "The Book Thief":"Set in Nazi Germany, a young girl's life is shaped by books, friendship and courage.",
 "The Silent Patient":"A psychological thriller about a woman who stops speaking after a violent event.",
 "And Then There Were None":"Ten strangers are invited to an isolated island, where a chilling sequence of events begins.",
 "The Da Vinci Code":"A fast-paced mystery involving puzzles, art and secret histories.",
 "The Fault in Our Stars":"Two teenagers meet at a support group and build a moving connection.",
 "Sapiens":"A sweeping account of human history and the forces that shaped civilisation.",
 "A Brief History of Time":"An introduction to cosmology, black holes and the nature of the universe.",
 "The Diary of a Young Girl":"Anne Frank's diary documents her thoughts while hiding during the Second World War.",
 "Rich Dad Poor Dad":"A personal-finance book about attitudes toward money, work and financial independence.",
 "Deep Work":"A case for focused, distraction-free work and how to develop that skill.",
 "The Pragmatic Programmer":"Practical ideas for becoming a more adaptable and effective software developer.",
 "The Catcher in the Rye":"A coming-of-age novel following Holden Caulfield through New York City.",
 "The Lord of the Rings":"An epic fantasy journey in which a fellowship sets out to destroy a powerful ring.",
 "The Midnight Library":"Nora explores alternate versions of her life and the choices that shaped them.",
 "Think Like a Monk":"Lessons on focus, purpose, gratitude and everyday life.",
 "The Immortals of Meluha":"The first book in the Shiva Trilogy, reimagining the legend of Shiva.",
 "The Blue Umbrella":"A gentle novella about a young girl in the hills and a beautiful umbrella."
 };
 return descriptions[b.title]||("A "+String(b.category||"library").toLowerCase()+" title by "+b.author+". Explore its catalogue details and current availability.");
}
function renderRequests(){
 const mine=db.requests.filter(r=>r.studentId===currentStudentId).slice().reverse();
 $("#requestCount").textContent=mine.length+" request"+(mine.length===1?"":"s");
 $("#myRequests").innerHTML=mine.map(r=>'<div class="request-row"><div class="request-row-main"><strong>'+esc(r.title)+'</strong><small>'+esc(r.author||"Author not specified")+' · Requested '+dateLabel(r.requested)+'</small></div><span class="request-state">'+esc(r.status||"Pending review")+'</span></div>').join("");
 $("#requestsEmpty").classList.toggle("hidden",mine.length>0);
}
function closeModal(){$("#modalHost").innerHTML="";}
function openDetails(id){
 const b=book(id);if(!b)return;
 const initials=b.title.split(/\s+/).slice(0,3).map(w=>w[0]).join("").toUpperCase();
 $("#modalHost").innerHTML='<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><div class="modal-head"><div><div class="eyebrow">LIBRARY CATALOGUE</div><h2 id="detailTitle">Book details</h2></div><button class="icon-btn" data-action="close-modal" aria-label="Close">×</button></div><div class="detail-layout"><div class="detail-cover">'+esc(initials)+'</div><div><h3 style="font:700 17px Manrope;margin:0;color:#f1f3fb">'+esc(b.title)+'</h3><div style="font-size:10px;color:#aab2c8;margin-top:5px">by '+esc(b.author)+'</div><div class="detail-meta"><span>'+esc(b.category)+'</span><span>'+esc(b.year)+'</span><span>'+esc(b.id)+'</span></div><p class="detail-description">'+esc(descriptionFor(b))+'</p><div class="detail-stock">'+b.available+' of '+b.total+' copies currently available</div><div class="book-actions">'+(b.available>0?'<button class="primary-btn" data-action="borrow" data-id="'+esc(b.id)+'">Borrow this book</button>':'<button class="primary-btn" data-action="request" data-id="'+esc(b.id)+'">Request this book</button>')+'<button class="secondary-btn" data-action="close-modal">Close</button></div></div></div></section></div>';
}
function openRequestForm(bookId){
 const b=bookId?book(bookId):null;if(bookId&&!b)return;
 if(b&&db.requests.some(r=>r.studentId===currentStudentId&&r.bookId===b.id&&r.status==="Pending review")){toast("You already have a pending request for this title.");return;}
 $("#modalHost").innerHTML='<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="requestTitle"><div class="modal-head"><div><div class="eyebrow">STUDENT BOOK REQUEST</div><h2 id="requestTitle">'+(b?'Request this book':'Suggest a new title')+'</h2></div><button class="icon-btn" data-action="close-modal" aria-label="Close">×</button></div><form id="requestForm" data-book-id="'+(b?esc(b.id):'')+'"><div class="form-grid"><div class="field full"><label for="requestBookTitle">BOOK TITLE</label><input id="requestBookTitle" name="title" maxlength="100" required value="'+(b?esc(b.title):'')+'" '+(b?'readonly':'')+' placeholder="Enter the book title"></div><div class="field full"><label for="requestAuthor">AUTHOR (IF KNOWN)</label><input id="requestAuthor" name="author" maxlength="80" value="'+(b?esc(b.author):'')+'" '+(b?'readonly':'')+' placeholder="Author name"></div></div><p class="detail-description">This request is saved in this browser as Pending review. It is not sent to a librarian in this demo.</p><div class="modal-actions"><button type="button" class="secondary-btn" data-action="close-modal">Cancel</button><button type="submit" class="primary-btn">Submit request</button></div></form></section></div>';
}
function submitRequest(form){
 const data=new FormData(form),title=String(data.get("title")||"").trim(),author=String(data.get("author")||"").trim(),bookId=form.dataset.bookId||null;
 if(!title)return;
 if(db.requests.some(r=>r.studentId===currentStudentId&&r.title.toLowerCase()===title.toLowerCase()&&r.status==="Pending review")){closeModal();toast("You already have a pending request for this title.");return;}
 db.requests.push({id:uid(),studentId:currentStudentId,bookId,title,author,requested:today(),status:"Pending review"});
 save();renderRequests();closeModal();toast("Your book request has been saved.");
}

function showView(n){$$(".page").forEach(p=>p.classList.add("hidden"));$("#view-"+n).classList.remove("hidden");$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===n));$("#crumbName").textContent=({overview:"Dashboard",books:"Explore books",transactions:"My borrowings"})[n];$("#sidebar").classList.remove("open");}
function borrowBook(id){const b=book(id);if(!b)return toast("Book not found.");if(b.available<1)return toast("Sorry, no copies are available right now.");if(activeForMe().some(t=>t.bookId===id))return toast("You already have this title on loan.");if(activeForMe().length>=5)return toast("You have reached the demo limit of 5 active books.");b.available--;db.transactions.push({id:uid(),bookId:id,studentId:currentStudentId,issued:today(),dueDate:addDays(today(),14),returned:null});save();render();toast("Enjoy your book! Return it by "+dateLabel(addDays(today(),14))+".");}
function returnBook(id){const t=db.transactions.find(x=>x.id===id&&x.studentId===currentStudentId&&!x.returned);if(!t)return toast("This borrowing is already complete.");const b=book(t.bookId);t.returned=today();if(b)b.available=Math.min(b.total,b.available+1);save();render();toast("Book return recorded. Thank you!");}
document.addEventListener("click",e=>{const v=e.target.closest("[data-view]");if(v){showView(v.dataset.view);return;}const a=e.target.closest("[data-action]");if(!a)return;if(a.dataset.action==="borrow"){closeModal();borrowBook(a.dataset.id);}if(a.dataset.action==="return")returnBook(a.dataset.id);if(a.dataset.action==="details")openDetails(a.dataset.id);if(a.dataset.action==="request")openRequestForm(a.dataset.id);if(a.dataset.action==="request-new")openRequestForm();if(a.dataset.action==="close-modal")closeModal();});
document.addEventListener("submit",e=>{if(e.target.id==="requestForm"){e.preventDefault();submitRequest(e.target);}});
$("#studentSwitch").addEventListener("change",e=>{currentStudentId=e.target.value;save();render();toast("Switched student demo profile.");});
$("#bookSearch").addEventListener("input",renderBooks);$("#bookFilter").addEventListener("change",renderBooks);$("#transactionSearch").addEventListener("input",renderTransactions);$("#transactionFilter").addEventListener("change",renderTransactions);$("#menuToggle").onclick=()=>$("#sidebar").classList.toggle("open");$("#todayLabel").textContent=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});save();render();
})();