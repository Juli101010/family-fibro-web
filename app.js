const state={finish:"luces",number:3,letter:12,cart:[],reference:null,createdAt:null};
const finishes={luces:{label:"Terminado con luces",price:28000},pintado:{label:"Pintado sin luces",price:24000},crudo:{label:"Crudo MDF",price:20000}};
const numbers="0123456789".split(""),letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const money=value=>"$"+new Intl.NumberFormat("es-AR").format(value||0);
const asset=(number,finish)=>"assets/numero_"+number+"_"+finish+".jpg";
const ACTIVE_ORDER_KEY="familyFibro.activeOrder.v1";
const ORDER_HISTORY_KEY="familyFibro.orderHistory.v1";
function makeReference(){
  const now=new Date(),date=[now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("");
  const random=String(Math.floor(1000+Math.random()*9000));
  return"FF-"+date+"-"+random;
}
function ensureReference(){
  if(!state.reference){state.reference=makeReference();state.createdAt=new Date().toISOString()}
}
function saveActiveOrder(){
  if(!state.reference)return;
  try{localStorage.setItem(ACTIVE_ORDER_KEY,JSON.stringify({version:1,reference:state.reference,createdAt:state.createdAt,updatedAt:new Date().toISOString(),finish:state.finish,cart:state.cart}))}catch(error){console.warn("No se pudo guardar el pedido",error)}
}
function restoreActiveOrder(){
  try{
    const saved=JSON.parse(localStorage.getItem(ACTIVE_ORDER_KEY)||"null");
    if(!saved||!saved.reference||!Array.isArray(saved.cart))return false;
    state.reference=String(saved.reference);
    state.createdAt=saved.createdAt||new Date().toISOString();
    if(finishes[saved.finish])state.finish=saved.finish;
    state.cart=saved.cart.filter(item=>item&&item.key&&item.type&&item.value).map(item=>({...item,price:Number(item.price)||0,quantity:Math.max(1,Number(item.quantity)||1)}));
    return state.cart.length>0;
  }catch(error){console.warn("No se pudo recuperar el pedido",error);return false}
}
function archiveOrder(status){
  if(!state.reference)return;
  try{
    const history=JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY)||"[]");
    const snapshot={reference:state.reference,createdAt:state.createdAt,updatedAt:new Date().toISOString(),status,finish:state.finish,cart:state.cart};
    const next=[snapshot,...history.filter(order=>order.reference!==state.reference)].slice(0,30);
    localStorage.setItem(ORDER_HISTORY_KEY,JSON.stringify(next));
  }catch(error){console.warn("No se pudo registrar el historial",error)}
}
function surrounding(items,index){return[-1,0,1].map(offset=>items[(index+offset+items.length)%items.length])}
function renderCarousel(type){
  const values=type==="number"?numbers:letters,track=document.querySelector(type==="number"?"#number-track":"#letter-track"),index=state[type],classes=["back-left","center","back-right"];
  track.innerHTML="";
  surrounding(values,index).forEach((value,position)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="deck-piece "+classes[position]+(type==="letter"?" letter":"");
    if(type==="number")button.innerHTML='<img src="'+asset(value,state.finish)+'" alt="Número '+value+' '+finishes[state.finish].label+'"><span>Número '+value+"</span>";
    else button.textContent=value;
    button.addEventListener("click",()=>addPiece(type==="number"?"Número":"Letra",value));
    track.appendChild(button);
  });
}
function addPiece(type,value,options={}){
  const finish=options.finish||state.finish,price=options.price||finishes[finish].price,key=options.key||type+"-"+value+"-"+finish;
  const found=state.cart.find(item=>item.key===key);
  if(found)found.quantity+=options.quantity||1;
  else state.cart.push({key,type,value,finish,price,quantity:options.quantity||1,label:options.label||finishes[finish].label});
  renderCart();
}
function discountRule(){
  const pieces=state.cart.filter(item=>item.type!=="Pack").reduce((sum,item)=>sum+item.quantity,0);
  const completeSeries=numbers.every(number=>state.cart.some(item=>item.type==="Número"&&item.value===number));
  if(completeSeries)return{rate:.25,label:"Serie completa 0–9: 25% de descuento"};
  if(pieces>=20)return{rate:.15,label:"20 o más piezas: 15% de descuento"};
  if(pieces>=10)return{rate:.10,label:"10 o más piezas: 10% de descuento"};
  return{rate:0,label:"Desde 10 piezas: 10% de descuento"};
}
function changeQuantity(key,delta){
  const item=state.cart.find(entry=>entry.key===key);
  if(!item)return;
  item.quantity+=delta;
  if(item.quantity<1)state.cart=state.cart.filter(entry=>entry.key!==key);
  renderCart();
}
function renderCart(){
  if(state.cart.length)ensureReference();
  const list=document.querySelector("#cart-list");
  const subtotal=state.cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const discounted=state.cart.filter(item=>item.type!=="Pack").reduce((sum,item)=>sum+item.price*item.quantity,0);
  const rule=discountRule(),discount=Math.round(discounted*rule.rate),total=subtotal-discount,count=state.cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector("#cart-count").textContent=count+" "+(count===1?"pieza":"piezas");
  document.querySelector("#nav-count").textContent=count;
  document.querySelector("#copy-order-reference").textContent=state.reference||"Sin iniciar";
  document.querySelector("#cart-subtotal").textContent=money(subtotal);
  document.querySelector("#cart-total").textContent=money(total);
  document.querySelector("#discount-note").textContent=rule.label;
  const discountRow=document.querySelector("#discount-row");
  discountRow.hidden=!discount;
  if(discount)document.querySelector("#cart-discount").textContent="-"+money(discount);
  document.querySelector("#discount-description").textContent=discount?"Descuento aplicado automáticamente a las piezas sueltas. El Pack PROMO 2026 ya tiene precio promocional.":"Valores orientativos. Se confirma medida, disponibilidad, envío y fecha de entrega.";
  list.innerHTML="";
  if(!state.cart.length)list.innerHTML='<p class="empty"><i class="fa fa-shopping-basket"></i><b>Tu pedido está vacío</b><span>Seleccioná piezas para ver acá el detalle y el total estimado.</span></p>';
  state.cart.forEach(item=>{
    const row=document.createElement("div");
    row.className="cart-item";
    const visual=item.type==="Número"?'<img src="'+asset(item.value,item.finish)+'" alt="">':'<span class="glyph">'+item.value+"</span>";
    row.innerHTML=visual+"<div><b>"+item.type+" "+item.value+"</b><small>"+item.quantity+" u. · "+item.label+"</small><div class='quantity'><button class='minus' aria-label='Quitar una unidad'>−</button><b>"+item.quantity+"</b><button class='plus' aria-label='Sumar una unidad'>+</button></div></div><button class='remove' aria-label='Quitar pieza'>×</button>";
    row.querySelector(".minus").addEventListener("click",()=>changeQuantity(item.key,-1));
    row.querySelector(".plus").addEventListener("click",()=>changeQuantity(item.key,1));
    row.querySelector(".remove").addEventListener("click",()=>{state.cart=state.cart.filter(entry=>entry.key!==item.key);renderCart()});
    list.appendChild(row);
  });
  const lines=state.cart.map(item=>"- "+item.type+" "+item.value+": "+item.quantity+" u. · "+item.label).join("\n");
  const message="Hola Family Fibro, quiero cotizar el pedido "+(state.reference||"sin referencia")+":\n\n"+(lines||"Todavía no seleccioné piezas.")+"\n\nSubtotal: "+money(subtotal)+(discount?"\nDescuento: -"+money(discount):"")+"\nTotal estimado: "+money(total)+".\nQuedo atento/a a confirmar medida, fecha y envío.";
  document.querySelector("#send-order").href="https://wa.me/5491137857450?text="+encodeURIComponent(message);
  saveActiveOrder();
}
function addWord(input){
  const chars=input.value.toUpperCase().match(/[A-Z0-9]/g)||[];
  chars.forEach(char=>addPiece(/[0-9]/.test(char)?"Número":"Letra",char));
  if(chars.length)input.value="";
}
document.querySelectorAll(".finish").forEach(button=>button.addEventListener("click",()=>{
  state.finish=button.dataset.finish;
  document.querySelectorAll(".finish").forEach(other=>other.classList.toggle("active",other===button));
  renderCarousel("number");
}));
document.querySelectorAll(".carousel").forEach(carousel=>{
  const type=carousel.dataset.type,values=type==="number"?numbers:letters;
  carousel.querySelector(".prev").addEventListener("click",()=>{state[type]=(state[type]-1+values.length)%values.length;renderCarousel(type)});
  carousel.querySelector(".next").addEventListener("click",()=>{state[type]=(state[type]+1)%values.length;renderCarousel(type)});
});
document.querySelector("#add-word").addEventListener("click",()=>addWord(document.querySelector("#word-input")));
document.querySelector("#word-input").addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();addWord(event.target)}});
document.querySelector("#add-promo").addEventListener("click",()=>addPiece("Pack","PROMO 2026",{key:"pack-2026",finish:"luces",price:234000,label:"9 piezas terminadas con luces"}));
document.querySelector("#clear-cart").addEventListener("click",()=>{state.cart=[];renderCart()});
document.querySelector("#new-order").addEventListener("click",()=>{
  state.cart=[];state.reference=null;state.createdAt=null;
  try{localStorage.removeItem(ACTIVE_ORDER_KEY)}catch(error){console.warn(error)}
  document.querySelector("#restore-message").hidden=true;
  renderCart();
});
document.querySelector("#copy-order-reference").addEventListener("click",event=>{
  if(!state.reference)return;
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(state.reference);
  const original=state.reference;event.currentTarget.textContent="Copiada";setTimeout(()=>{event.currentTarget.textContent=original},1200);
});
document.querySelector("#send-order").addEventListener("click",event=>{
  if(!state.cart.length){event.preventDefault();alert("Agregá al menos una pieza antes de pedir la cotización.");return}
  saveActiveOrder();archiveOrder("Enviado a WhatsApp");
});
const modal=document.querySelector("#picker-modal"),matrix=document.querySelector("#picker-matrix"),modalTitle=document.querySelector("#modal-title"),modalDescription=document.querySelector("#modal-description"),modalWord=document.querySelector("#modal-word-wrap");
function openPicker(type){
  const values=type==="number"?numbers:letters;
  modalTitle.textContent=type==="number"?"Todos los números":"Todas las letras";
  modalDescription.textContent=type==="number"?"Elegí un número para sumarlo. Podés repetirlo y ajustar cantidades en tu pedido.":"Elegí una letra o escribí una palabra para sumar todas sus piezas.";
  modalWord.hidden=type==="number";
  matrix.innerHTML="";
  values.forEach(value=>{const button=document.createElement("button");button.type="button";button.textContent=value;button.addEventListener("click",()=>addPiece(type==="number"?"Número":"Letra",value));matrix.appendChild(button)});
  modal.showModal();
}
document.querySelector("#open-number-modal").addEventListener("click",()=>openPicker("number"));
document.querySelector("#open-letter-modal").addEventListener("click",()=>openPicker("letter"));
document.querySelector("#close-picker-modal").addEventListener("click",()=>modal.close());
modal.addEventListener("click",event=>{if(event.target===modal)modal.close()});
document.querySelector("#modal-add-word").addEventListener("click",()=>addWord(document.querySelector("#modal-word-input")));
const workCards=[...document.querySelectorAll(".work-card")];
let workIndex=0;
function syncWorkVideoState(){
  workCards.forEach((card,index)=>{
    const video=card.querySelector("video");
    if(!video)return;
    if(index===workIndex){
      video.play().catch(()=>{});
    }else{
      video.pause();
      video.currentTime=0;
    }
  });
}
function renderWorkCards(){
  workCards.forEach((card,index)=>{
    const diff=(index-workIndex+workCards.length)%workCards.length;
    card.classList.remove("left","center","right");
    if(diff===0)card.classList.add("center");
    else if(diff===1)card.classList.add("right");
    else card.classList.add("left");
  });
  syncWorkVideoState();
}
document.querySelector(".work-arrow.prev").addEventListener("click",()=>{workIndex=(workIndex-1+workCards.length)%workCards.length;renderWorkCards();});
document.querySelector(".work-arrow.next").addEventListener("click",()=>{workIndex=(workIndex+1)%workCards.length;renderWorkCards();});
const restoredOrder=restoreActiveOrder();
document.querySelectorAll(".finish").forEach(button=>button.classList.toggle("active",button.dataset.finish===state.finish));
document.querySelector("#restore-message").hidden=!restoredOrder;
renderCarousel("number");renderCarousel("letter");renderWorkCards();renderCart();
