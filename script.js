function stopLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function mercadoLivreResults(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const obj = await response.json();
  const results = obj.results;
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  stopLoading();
}


function createCartListItem(itemList) {
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(itemList);
}

function searchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const itemList = createCartItemElement({ sku, name, salePrice });
    createCartListItem(itemList);
  })
  .catch(error => window.alert(error));
}

function getId(button) {
  if (button.target.className === 'item__add') {
    const id = button.target.parentNode.firstChild.innerText;
    searchID(id);
  }
}

function addList() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', getId);
}
// Requisito 2 feito com auxílio e colaboraçao do colega Layo Kaminky

// Limpar o carrinho de compras ao clicar no botão

function setLocalStorage() {
  const cartItem = document.querySelector('.cart__items');
  localStorage.setItem('cartItem', cartItem.innerText);
}

function getLocalStorage() {
  document.querySelector('.cart__items').innerText = localStorage.getItem('cartItem');
}

function btnEmptyCart() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', function() {
    const cartLists = document.querySelector('.cart_items');
    cartLists.innerText = null;
  });
}

window.onload = function onload() {
  mercadoLivreResults('computador');
  addList();
  btnEmptyCart();
  setLocalStorage();
};
