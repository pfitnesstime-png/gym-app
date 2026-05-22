// Simple shop demo: products from products.json, cart in localStorage
const productsGrid = document.getElementById('productsGrid');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const payableSpan = document.getElementById('payable');

let products = [];
let cart = JSON.parse(localStorage.getItem('shop_cart')||'{}');

function fetchProducts(){
  fetch('products.json').then(r=>r.json()).then(data=>{
    products = data;
    renderProducts();
    updateCartUI();
  }).catch(err=>{
    console.error(err);
    productsGrid.innerHTML = '<div>Error loading products</div>';
  });
}

function renderProducts(){
  productsGrid.innerHTML = products.map(p=>`
    <div class="card">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <div class="price">₹${p.price}</div>
      <div style="display:flex;gap:8px">
        <button class="primary" onclick="addToCart('${p.id}')">Add to cart</button>
        <button class="secondary" onclick="viewDetails('${p.id}')">View</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  saveCart();
  updateCartUI();
}

function viewDetails(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.name}\n\n${p.desc}\n\nPrice: ₹${p.price}`);
}

function saveCart(){
  localStorage.setItem('shop_cart', JSON.stringify(cart));
}

function updateCartUI(){
  const entries = Object.keys(cart);
  cartCount.innerText = entries.reduce((s,k)=>s+cart[k],0);
  if(entries.length===0){
    cartList.innerText = 'Cart is empty';
    cartTotal.innerText = 'Total: ₹0';
    checkoutBtn.disabled = true;
    return;
  }

  let html = '';
  let total = 0;
  entries.forEach(id=>{
    const p = products.find(x=>x.id===id) || {name:id,price:0};
    const qty = cart[id];
    total += p.price * qty;
    html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.02)">
      <div><b>${p.name}</b><br><small>₹${p.price} x ${qty}</small></div>
      <div style="display:flex;gap:6px">
        <button onclick="changeQty('${id}',-1)" class="secondary">-</button>
        <button onclick="changeQty('${id}',1)" class="secondary">+</button>
        <button onclick="removeItem('${id}')" class="secondary">Remove</button>
      </div>
    </div>`;
  });

  cartList.innerHTML = html;
  cartTotal.innerText = 'Total: ₹' + total;
  payableSpan && (payableSpan.innerText = total);
  checkoutBtn.disabled = false;
}

function changeQty(id,delta){
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(); updateCartUI();
}
function removeItem(id){ delete cart[id]; saveCart(); updateCartUI(); }

// navigation
const productsSection = document.getElementById('productsSection');
const cartSection = document.getElementById('cartSection');
const checkoutSection = document.getElementById('checkoutSection');
const thanksSection = document.getElementById('thanksSection');

document.getElementById('viewProductsBtn').addEventListener('click',()=>{ showSection('products'); });
document.getElementById('viewCartBtn').addEventListener('click',()=>{ showSection('cart'); });

document.getElementById('checkoutBtn').addEventListener('click',()=>{ showSection('checkout'); });
document.getElementById('backToCart').addEventListener('click',()=>{ showSection('cart'); });
document.getElementById('shopMore').addEventListener('click',()=>{ showSection('products'); });

function showSection(s){
  productsSection.classList.toggle('hidden', s!=='products');
  cartSection.classList.toggle('hidden', s!=='cart');
  checkoutSection.classList.toggle('hidden', s!=='checkout');
  thanksSection.classList.toggle('hidden', s!=='thanks');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  if(s==='products') document.getElementById('viewProductsBtn').classList.add('active');
  else document.getElementById('viewCartBtn').classList.add('active');
}

// checkout
const checkoutForm = document.getElementById('checkoutForm');
checkoutForm && checkoutForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  if(!name||!phone||!address) return alert('Fill details');

  // create demo order
  const order = { id: 'ORD'+Date.now(), name, phone, address, items: cart, total: payableSpan.innerText };
  // save orders locally
  const orders = JSON.parse(localStorage.getItem('shop_orders')||'[]');
  orders.push(order);
  localStorage.setItem('shop_orders', JSON.stringify(orders));

  // clear cart
  cart = {}; saveCart(); updateCartUI();

  document.getElementById('orderId').innerText = order.id;
  showSection('thanks');
});

// init
fetchProducts();

// expose helpers for inline onclick
window.addToCart = addToCart; window.viewDetails = viewDetails; window.choosePlanFromCard = function(name,days,price){
  // allow plan selection from homepage to registration
  const r_plan = document.getElementById('r_plan');
  if(r_plan){ r_plan.value = name+'|'+days+'|'+price; const ev = new Event('change'); r_plan.dispatchEvent(ev); window.scrollTo({top:document.getElementById('registerBox').offsetTop-20,behavior:'smooth'}); }
};