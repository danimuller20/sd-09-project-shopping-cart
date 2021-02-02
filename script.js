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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAddToCartRequest = async (itemId) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const object = await response.json();
  const { id, title, price } = object;
  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(item);
};


function getSkuFromProductItem(item) {
  const id = item.querySelector('span.item__sku').innerText;
  fetchAddToCartRequest(id);
}
function addToCart() {
  document.querySelectorAll('.item__add').forEach((button) => {
    button.addEventListener('click', function (event) {
      const selectedElement = event.target.parentElement;
      getSkuFromProductItem(selectedElement);
    });
  });
}

async function fetchProducts(query) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  const object = await response.json();
  object.results.forEach((result) => {
    const { id, title, thumbnail } = result;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(item);
  });
  addToCart();
};
// function getProductId(event) {
//   const id = event.target.parentNode.firstChild.innerText;
//   fetchAddToCartRequest(id);
// }

window.onload = function onload() {
  fetchProducts('computador');
  

};
