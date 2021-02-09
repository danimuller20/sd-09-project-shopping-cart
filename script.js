function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

let total = 0;
const sectionCart = document.querySelector('.cart');
sectionCart.appendChild(createCustomElement('p', 'total-price', `Total: R$${total}`));

function sum(value) {
  const p = document.querySelector('.total-price');
  total += value;
  console.log(total);
  p.innerHTML = `Total: R$${total}`;
  return p;
}

// Salvando o item no localStorage

function saveOnLocalStorage({ sku, name, salePrice }) {
  const item = { sku, name, salePrice };
  localStorage.setItem(sku, JSON.stringify(item));
  sum(salePrice);
}

// Remover o item clicado do carrinho

function cartItemClickListener(event) {
  event.currentTarget.remove();
}

// Remover o item do localStorage

function deleteFromLocalStorage({ sku, name, salePrice }) {
  localStorage.removeItem(sku);
  console.log(name);
  sum(-salePrice);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => { deleteFromLocalStorage({ sku, name, salePrice }); });
  return li;
}

async function fetchCartItem(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const itemCart = document.querySelector('.cart__items');
  const response = await fetch(endpoint);
  const itemValues = await response.json();
  const { id: sku, title: name, price: salePrice } = itemValues;
  // Adicionando item ao carrinho
  itemCart.appendChild(createCartItemElement({ sku, name, salePrice }));
  saveOnLocalStorage({ sku, name, salePrice });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  button.addEventListener('click', () => fetchCartItem(sku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchListItem(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  const response = await fetch(endpoint);
  const responseItem = await response.json();
  const itemObj = responseItem.results;
  const listItems = document.querySelector('.items');

  listItems.removeChild(document.querySelector('.loading'));

  itemObj.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const productItem = createProductItemElement({ sku, name, image });
    listItems.appendChild(productItem);
  });

  const getButton = document.querySelector('.item__add');
  const section = getButton.parentNode.querySelector('.item__sku');
  console.log(section);
}

// Botão para limpar carrinho e o localStorage
const buttonCleaner = document.querySelector('.empty-cart');
buttonCleaner.addEventListener('click', () => {
  const Cart = document.querySelector('.cart__items');
  Cart.innerHTML = '';
  localStorage.clear();
  const p = document.querySelector('.total-price');
  total = 0;
  p.innerHTML = `Total: R$${total}`;
});

function loadFromLocalStorage() {
  const arrayLocalStorage = Object.keys(localStorage);
  arrayLocalStorage.forEach(key => fetchCartItem(key));
  console.log(arrayLocalStorage);
}

function load() {
  const secLoad = createCustomElement('p', 'loading', 'loading...');
  const cart = document.querySelector('.items');
  cart.appendChild(secLoad);
}

window.onload = function onload() {
  load();
  loadFromLocalStorage();
  fetchListItem('computador');
};
