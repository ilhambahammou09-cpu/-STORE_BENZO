const CONFIG={
  whatsapp:"212600000000",
  currency:"MAD",
  store:"STORE_BENZO"
};

const products=[
 {id:1,name:"T-Shirt Premium Noir",price:249,old:299,cat:"T-Shirts",sizes:["M","L","XL"],colors:["Noir","Blanc"],img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",desc:"T-shirt premium à coupe moderne."},
 {id:2,name:"Chemise Oversize Beige",price:329,old:0,cat:"Chemises",sizes:["M","L","XL"],colors:["Beige","Noir"],img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",desc:"Chemise élégante pour un look contemporain."},
 {id:3,name:"Jean Straight Premium",price:399,old:449,cat:"Jeans",sizes:["30","32","34","36"],colors:["Bleu","Noir"],img:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",desc:"Jean confortable à coupe droite."},
 {id:4,name:"Veste Minimal Black",price:599,old:699,cat:"Vestes",sizes:["M","L","XL"],colors:["Noir"],img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",desc:"Veste noire au style premium et intemporel."},
 {id:5,name:"Hoodie Essential",price:349,old:399,cat:"Hoodies",sizes:["M","L","XL","XXL"],colors:["Noir","Gris"],img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",desc:"Hoodie doux et confortable."},
 {id:6,name:"Pantalon Tailored",price:429,old:0,cat:"Pantalons",sizes:["30","32","34","36"],colors:["Noir","Gris"],img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",desc:"Pantalon moderne pour une silhouette élégante."},
 {id:7,name:"Sneakers Urban",price:549,old:649,cat:"Chaussures",sizes:["40","41","42","43","44"],colors:["Blanc","Noir"],img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",desc:"Sneakers urbaines au design contemporain."},
 {id:8,name:"Polo Signature",price:279,old:0,cat:"Polos",sizes:["M","L","XL"],colors:["Noir","Blanc"],img:"https://images.unsplash.com/photo-1625910513413-5fc45a6f4e54?auto=format&fit=crop&w=900&q=80",desc:"Polo minimaliste pour un style propre et élégant."}
];

let activeCat="Tous";
let cart=JSON.parse(localStorage.getItem("benzoCart")||"[]");

const categories=["Tous",...new Set(products.map(p=>p.cat))];

function renderFilters(){
 document.getElementById("filters").innerHTML=categories.map(c=>`<button class="filter ${c===activeCat?"active":""}" onclick="setCat('${c}')">${c}</button>`).join("");
}
function setCat(c){activeCat=c;renderFilters();renderProducts()}
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const list=products.filter(p=>(activeCat==="Tous"||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
 document.getElementById("products").innerHTML=list.map(p=>`
 <article class="product" onclick="openProduct(${p.id})">
  <img class="product-img" src="${p.img}" alt="${p.name}">
  <div class="product-info"><h3>${p.name}</h3><div><span class="price">${p.price} ${CONFIG.currency}</span>${p.old?`<span class="old">${p.old} ${CONFIG.currency}</span>`:""}</div></div>
 </article>`).join("");
}
function openProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`
 <div class="detail">
  <img src="${p.img}" alt="${p.name}">
  <div><p class="eyebrow">${p.cat}</p><h2>${p.name}</h2><p>${p.desc}</p>
  <h3 class="price">${p.price} ${CONFIG.currency}</h3>
  <label>Taille</label><select id="size" class="select">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
  <label>Couleur</label><select id="color" class="select">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select>
  <button class="btn" onclick="addToCart(${p.id})">Ajouter au panier</button>
  </div>
 </div>`;
 document.getElementById("modal").classList.add("show");
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function addToCart(id){
 const p=products.find(x=>x.id===id),size=document.getElementById("size").value,color=document.getElementById("color").value;
 const key=`${id}-${size}-${color}`,item=cart.find(x=>x.key===key);
 if(item)item.qty++;else cart.push({key,id,size,color,qty:1});
 saveCart();closeModal();openCart();
}
function saveCart(){localStorage.setItem("benzoCart",JSON.stringify(cart));updateCart()}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(i=>{
  const p=products.find(x=>x.id===i.id);
  return `<div class="cart-item"><img src="${p.img}"><div><b>${p.name}</b><small>${i.size} • ${i.color}</small><div>${p.price} MAD</div></div><div class="qty"><button onclick="changeQty('${i.key}',-1)">−</button> ${i.qty} <button onclick="changeQty('${i.key}',1)">+</button></div></div>`;
 }).join(""):"<p>Votre panier est vide.</p>";
 document.getElementById("cartTotal").textContent=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0)+" MAD";
}
function changeQty(key,n){const i=cart.find(x=>x.key===key);i.qty+=n;if(i.qty<=0)cart=cart.filter(x=>x.key!==key);saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open")}
function checkout(){
 if(!cart.length)return alert("Votre panier est vide.");
 const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} | Taille: ${i.size} | Couleur: ${i.color} | Qté: ${i.qty} | ${p.price*i.qty} MAD`}).join("%0A");
 const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 const text=`Bonjour STORE_BENZO, je souhaite commander:%0A%0A${lines}%0A%0ATotal: ${total} MAD%0A%0ANom:%0ATéléphone:%0AVille:%0AAdresse:`;
 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${text}`,"_blank");
}
document.getElementById("whatsappLink").href=`https://wa.me/${CONFIG.whatsapp}`;
renderFilters();renderProducts();updateCart();
