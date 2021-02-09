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

  return section;
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  event.target.remove();
  localStorage.setItem('productList', cartList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(btn => btn.addEventListener('click', async () => {
    const productId = btn.parentNode.querySelector('.item__sku').innerText;
    const endPoint = `https://api.mercadolibre.com/items/${productId}`;
    const response = await fetch(endPoint);
    const object = await response.json();
    const objInfo = { sku: object.id, name: object.title, salePrice: object.price };
    const cartList = document.querySelector('.cart__items');
    const item = createCartItemElement(objInfo);
    cartList.appendChild(item);
    localStorage.setItem('productList', cartList.innerHTML);
  }));
}

async function retriveItems(term) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endPoint);
  const object = await response.json();
  const itemsElement = document.querySelector('.items');
  const productList = object.results;
  itemsElement.removeChild(document.querySelector('.eraseMe'));
  productList.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const item = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(item);
  });
  addCart();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartStorage() {
  const itemsInCar = localStorage.getItem('productList');
  document.querySelector('.cart__items').innerHTML = itemsInCar;
  const list = document.querySelectorAll('ol li');
  list.forEach(li => li.addEventListener('click', cartItemClickListener));
}

function clearBtn() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const removeList = document.querySelector('.cart__items');
    localStorage.setItem('productList', removeList.innerHTML = '');
  });
}

function loading() {
  const paragraph = document.createElement('p');
  paragraph.className = 'eraseMe'
  paragraph.innerText = 'Aguarde';
  const itemsElement = document.querySelector('.items');
  itemsElement.appendChild(paragraph);
}

window.onload = function onload() {
  cartStorage();
  loading();
  retriveItems('computador');
  clearBtn();
};

