window.onload = function onload() {
  criaLista();
 };

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

const criaLista = () => {
  const itens = document.querySelector('.items');
  const link = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(link)
  .then(resposta => resposta.json())
  .then(obj => obj.results)
  .then((array) => {
    array.forEach((obj) => {
      const { id: sku , title: name, thumbnail: image } = obj;
      const section = createProductItemElement({ sku, name, image });
      itens.appendChild(section);
    });
  })
  .catch(error => window.alert(error));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui nha
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
