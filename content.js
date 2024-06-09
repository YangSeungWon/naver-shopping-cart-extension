
function copyCart() {
    const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    let tsv = '';
    for (const [key, value] of Object.entries(shoppingCart)) {
        tsv += `${value.title}\t${value.price}\t${value.quantity}\t${value.price * value.quantity}\t${key}\n`;
    }
    setClipboard(tsv);
}

function setClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('[*] Copied to clipboard');
        toast('복사 완료!');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function toast(msg, duration=3000) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.backgroundColor = 'black';
    toast.style.color = 'white';
    toast.style.padding = '15px';
    toast.style.borderRadius = '5px';
    toast.style.opacity = 0.8;
    toast.style.fontSize = '20px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = 1000;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, duration);
}

function crawlInfo() {
    const link = window.location.href;
    // remove query string
    const url = new URL(link);
    url.search = '';
    const productUrl = url.toString();
    let title = document.querySelector('#content > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div._3k440DUKzy > div._1eddO7u4UC > h3')?.innerText || 'No title';
    let price = document.querySelector('#content > div._2-I30XS1lA > div._2QCa6wHHPy > fieldset > div.market.bd_2htWC.bd_xMsL8.bd_7h93m > div.bd_3XvVU > strong > span')?.innerText || 'No price';
    price = parseInt(price.replace(/[^0-9]/g, ''));
    const productInfo = {
        title: title,
        price: price,
    };
    let shoppingCart = {};
    try {
        shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    } catch (error) {
        console.error('Error:', error);
        localStorage.setItem('shoppingCart', '{}');
    }
    if (shoppingCart[productUrl]) {
        shoppingCart[productUrl].quantity++;
    } else {
        productInfo.quantity = 1;
        shoppingCart[productUrl] = productInfo;
    }
    console.log('[+] Product info:', productInfo);
    console.log('[i] Shopping cart:', shoppingCart);
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    toast(`${productInfo.title}를 장바구니에 추가했습니다.`);
}

function addButton() {
    const button = document.createElement('button');
    button.innerText = '이 상품 장바구니에 담기';
    button.style.fontSize = '16px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginTop = '10px';
    button.style.marginBottom = '10px';
    button.style.marginRight = '10px';

    if (!window.location.href.includes
        ('https://shopping.naver.com/window-products/')) {
        button.disabled = true;
        button.style.backgroundColor = '#ccc';
        button.style.cursor = 'not-allowed';
    }

    button.addEventListener('click', crawlInfo);
    button.addEventListener('click', loadUI);

    return button;
}

function shoppingCart() {
    const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    let div = document.createElement('div');
    div.style.zIndex = 1000;
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.maxHeight = '300px';
    div.style.overflow = 'auto';

    for (const [key, value] of Object.entries(shoppingCart)) {
        let divItem = document.createElement('div');
        divItem.style.display = 'flex';
        divItem.style.justifyContent = 'space-between';
        divItem.style.marginBottom = '10px';

        let pTitle = document.createElement('p');
        pTitle.innerText = `${value.title}`;
        pTitle.style.fontSize = '16px';
        pTitle.style.margin = 0;
        pTitle.style.padding = 0;
        pTitle.style.lineHeight = '20px';
        pTitle.style.width = '300px';
        pTitle.style.textOverflow = 'ellipsis';
        pTitle.style.overflow = 'hidden';
        pTitle.style.whiteSpace = 'nowrap';

        let pInfo = document.createElement('p');
        let priceTextComma = value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        pInfo.innerText = `${priceTextComma}원 x ${value.quantity}개`;
        pInfo.style.fontSize = '16px';
        pInfo.style.margin = 0;
        pInfo.style.padding = 0;
        pInfo.style.lineHeight = '20px';
        pInfo.style.width = '150px';

        let buttonOpen = document.createElement('button');
        buttonOpen.innerText = '열기';
        buttonOpen.style.fontSize = '16px';
        buttonOpen.style.padding = '5px';
        buttonOpen.style.backgroundColor = '#4CAF50';
        buttonOpen.style.color = 'white';
        buttonOpen.style.border = 'none';
        buttonOpen.style.marginRight = '10px';
        buttonOpen.style.borderRadius = '5px';
        buttonOpen.style.cursor = 'pointer';


        let buttonRemove = document.createElement('button');
        buttonRemove.innerText = '삭제';
        buttonRemove.style.fontSize = '16px';
        buttonRemove.style.padding = '5px';
        buttonRemove.style.backgroundColor = '#AF4C50';
        buttonRemove.style.color = 'white';
        buttonRemove.style.border = 'none';
        buttonRemove.style.borderRadius = '5px';
        buttonRemove.style.cursor = 'pointer';
            

        buttonOpen.addEventListener('click', () => {
            window.open(key, '_blank');
        });

        buttonRemove.addEventListener('click', () => {
            delete shoppingCart[key];
            localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
            loadUI();
        });


        divItem.appendChild(pTitle);
        divItem.appendChild(pInfo);
        divItem.appendChild(buttonOpen);
        divItem.appendChild(buttonRemove);

        div.appendChild(divItem);
    }

    return div;
}

function clearCartButton() {
    const button = document.createElement('button');
    button.innerText = '장바구니 비우기';
    button.style.fontSize = '16px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#AF4C50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginTop = '10px';
    button.style.marginBottom = '10px';
    button.style.marginRight = '10px';

    button.addEventListener('click', () => {
        localStorage.setItem('shoppingCart', '{}');
        console.log('[*] Shopping cart cleared');
        toast('장바구니를 비웠습니다.');
    });
    button.addEventListener('click', loadUI);

    return button;    
}

function copyCartButton() {
    const button = document.createElement('button');
    button.innerText = '장바구니 복사하기'
    button.style.fontSize = '16px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.marginTop = '10px';
    button.style.marginBottom = '10px';
    button.style.marginRight = '10px';

    button.addEventListener('click', copyCart);

    return button;
}

function loadUI() {
    let div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '10px';
    div.style.left = '10px';
    div.style.zIndex = 1000;
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.maxHeight = '300px';
    div.style.overflow = 'auto';

    let h1 = document.createElement('h1');
    h1.innerText = '장바구니';
    h1.style.textAlign = 'center';
    h1.style.margin = 0;
    h1.style.padding = 0;
    h1.style.fontSize = '24px';
    h1.style.fontWeight = 'bold';

    div.appendChild(h1);
    div.appendChild(addButton());
    div.appendChild(copyCartButton());
    div.appendChild(clearCartButton());
    div.appendChild(shoppingCart());

    div.id = 'shopping-cart';
    if (document.getElementById('shopping-cart')) {
        document.getElementById('shopping-cart').remove();
    }
    
    document.body.appendChild(div);
}

window.addEventListener('load', loadUI);

