const products = JSON.parse(localStorage.getItem('mydripProducts') || '[]');
const cart = JSON.parse(localStorage.getItem('mydripCart') || '[]');
let isAdmin = JSON.parse(sessionStorage.getItem('mydripAdmin') || 'false');
let selectedProduct = null;

// DOM elements
const sidebar = document.getElementById('sidebar');
const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Modals
const productModal = document.getElementById('productModal');
const deleteBtn = document.getElementById('deleteProductBtn');
const addToCartBtn = document.getElementById('addToCartBtn');
const modalClose = productModal.querySelector('.close');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

const loginModal = document.getElementById('loginModal');
const adminPanel = document.getElementById('adminPanel');

// Admin elements
const adminSubmit = document.getElementById('adminSubmit');
const adminUser = document.getElementById('adminUser');
const adminPass = document.getElementById('adminPass');
const loginError = document.getElementById('loginError');
const logoutModalClose = loginModal.querySelector('.close');

const newName = document.getElementById('newName');
const newDesc = document.getElementById('newDesc');
const newImg = document.getElementById('newImg');
const newCat = document.getElementById('newCat');
const addProductBtn = document.getElementById('addProductBtn');

// Utility
function saveProducts() {
  localStorage.setItem('mydripProducts', JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem('mydripCart', JSON.stringify(cart));
}

// UI Updates
function updateCartCount() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  cartCount.textContent = count;
}
function renderProducts() {
  const filter = document.querySelector('#sidebar li.active').dataset.category;
  const term = searchInput.value.toLowerCase();

  productContainer.innerHTML = products.map(p => {
    if ((filter === 'all' || p.category === filter)
      && (p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term))) {
      return `<div class="product" onclick="openProduct(${p.id})">
        <img src="${p.img}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
        </div>
      </div>`;
    }
    return '';
  }).join('');
  document.querySelectorAll('.product').forEach(el => {
    el.addEventListener('animationend', () => el.style.opacity = 1);
  });
}

// Open/close functions
window.openProduct = id => {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;
  modalImg.src = selectedProduct.img;
  modalTitle.textContent = selectedProduct.name;
  modalDesc.textContent = selectedProduct.desc;
  deleteBtn.style.display = isAdmin ? 'block' : 'none';
  productModal.classList.add('active');
};
modalClose.onclick = () => productModal.classList.remove('active');
deleteBtn.onclick = () => {
  if (selectedProduct) {
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    if (idx >= 0) {
      products.splice(idx, 1);
      saveProducts();
      renderProducts();
      productModal.classList.remove('active');
    }
  }
};
addToCartBtn.onclick = () => {
  if (!selectedProduct) return;
  const item = cart.find(i => i.id === selectedProduct.id);
  if (item) item.qty++;
  else cart.push({ id: selectedProduct.id, qty: 1 });
  saveCart(); updateCartCount();
};

searchInput.oninput = renderProducts;
document.querySelectorAll('#sidebar li').forEach(li => {
  li.onclick = () => {
    document.querySelectorAll('#sidebar li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    renderProducts();
  };
});

// Admin login
const ADMIN_USER = 'admin', ADMIN_PASS = '1234';
loginBtn.onclick = () => loginModal.classList.add('active');
logoutBtn.onclick = () => {
  sessionStorage.setItem('mydripAdmin','false');
  isAdmin = false;
  loginBtn.style.display='inline-block';
  logoutBtn.style.display='none';
  adminPanel.classList.remove('active');
};
adminSubmit.onclick = () => {
  if (adminUser.value === ADMIN_USER && adminPass.value === ADMIN_PASS) {
    sessionStorage.setItem('mydripAdmin','true');
    isAdmin = true;
    loginModal.classList.remove('active');
    loginBtn.style.display='none';
    logoutBtn.style.display='inline-block';
    adminPanel.classList.add('active');
    renderProducts();
  } else loginError.textContent = 'Invalid credentials';
};
logoutModalClose.onclick = () => loginModal.classList.remove('active');

// Admin panel
addProductBtn.onclick = () => {
  const id = Date.now();
  products.push({
    id, name: newName.value,
    desc: newDesc.value,
    img: newImg.value,
    category: newCat.value
  });
  saveProducts(); renderProducts();
  newName.value=newDesc.value=newImg.value='';
};
adminPanel.querySelector('.close').onclick = () => adminPanel.classList.remove('active');

// Sidebar toggle
document.getElementById('menuToggle').onclick = () => sidebar.classList.toggle('show');

// Initialize
if (isAdmin) {
  loginBtn.style.display='none';
  logoutBtn.style.display='inline-block';
  adminPanel.classList.add('active');
}
renderProducts();
updateCartCount();
