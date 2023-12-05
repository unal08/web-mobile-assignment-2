let url = "https://dummyjson.com/products?limit=100";

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        LoadCategory(data.products);
        search(data);
        btnDropdownConfiguration(data.products);
        pagination(data.products);
    })
    .catch(error => {
        console.error('Looks like there was a problem:', error);
    });


//Data-display1
function displayData(data) {
    let output = '';
    data.forEach((product) => {
        if (product.title.toLowerCase() === "handcraft chinese style") {
            output += `<div class="product">
            <div class="incompatible" style=" background-image: url(${product.thumbnail});" ></div>
            <div class="togglediv">
            <h2>${product.title}</h2>
            <p>Price: ${product.price}$</p>
            <p>Discount: ${product.discountPercentage}%</p>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock} units</p>
            </div> 
    </div>`;
        }
        else {
            output += `<div class="product">
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="togglediv">
            <h2>${product.title}</h2>
            <p>Price: ${product.price}$</p>
            <p>Discount: ${product.discountPercentage}%</p>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock} units</p>
            </div> 
    </div>`;
        }
    });
    document.getElementById('root').innerHTML = output;
}


//displaydata2
function displayData2(data) {
    let products = document.getElementsByClassName("product");
    for (let product of products) {
        let clickcnt = 0;
        product.addEventListener('click', e => {

            clickcnt++;
            if (clickcnt % 2 == 0) {
                if (clickcnt >= 2) {
                    product.children[1].classList.toggle('is-close', true);
                    if (product.children[1].lastElementChild.getAttribute('id') === 'description') {
                        product.children[1].removeChild(product.children[1].lastElementChild);
                    }
                }
                popdown(product);
            }
            else {
                popup(product);
                for (let i = 0; i < 100; i++) {
                    if (product.children[1].firstElementChild.textContent == data.products[i].title) {
                        let opened = document.getElementsByClassName('is-open');
                        opened[0].innerHTML += `<div class="description p-1 d-flex flex-column align-items-center justify-content-center " id="description" >
                    <h6>Description</h6>
                    <p>${data.products[i].description}</p>
                    </div>`
                        break;
                    }
                }
                product.addEventListener('mouseleave', (e) => {
                    e.preventDefault();
                    product.children[1].classList.toggle('is-close', true);
                    popdown(product);
                    if (product.children[1].lastElementChild.getAttribute('id') === 'description') {
                        product.children[1].removeChild(product.children[1].lastElementChild);
                    }
                })
            }
            e.preventDefault();
        })
    }

    function popdown(data) {
        data.classList.toggle('describe', false);
        data.children[1].classList.toggle('is-open', false);
    }

    function popup(data) {
        data.classList.toggle('decribe', true);
        data.children[1].classList.toggle('is-open', true);
        data.children[1].classList.toggle('is-close', false);
    }
}




//search
function search(data) {
    let searchBar = document.getElementById('search');  
    let searchicon = document.getElementById('searchbtn');
    searchBar.oninput = function (event) {
        event.preventDefault();
        let searchValue = event.target.value.toLowerCase();
        var filteredData = data.products.filter(product => {
            return product.title.toLowerCase().includes(searchValue) ||
                product.description.toLowerCase().includes(searchValue) ||
                product.category.toLowerCase().includes(searchValue)
        });
        searchicon.onclick = function (e) {
            e.preventDefault();
            pagination(filteredData);
        }
    }
}


//adding categoires to selection box
function LoadCategory(data) {
    let dmenu = document.getElementById("dropdown-menu");
    const differentcategories = new Set();
    for (let product of data) {
        differentcategories.add(String(product.category));
    }

    let lists = "";

    differentcategories.forEach(function (element) {
        lists += `<li><a class="dropdown-item" href="#">${element.charAt(0).toUpperCase() + element.slice(1)}</a></li>`;
    })

    dmenu.innerHTML = lists;
}

// btn-dropdown configuration
function btnDropdownConfiguration(data) {
    var btnselect = document.getElementById('select-category');
    let dd = document.getElementById("dropdown");
    let dmenu = document.getElementById("dropdown-menu");

    var clicked = 0
    btnselect.addEventListener('mouseenter', function (e) {

        ++clicked;

        if (clicked == 1) {
            dd.ariaExpanded = 'true';

            for (let index = 0; index < dmenu.childElementCount; index++) {
                dd.addEventListener('mouseleave', (e) => {
                    dd.ariaExpanded = 'false';
                    clicked = 0;
                    return 0;
                })
                dmenu.children[index].addEventListener('click', (e) => {

                    btnselect.textContent = dmenu.children[index].textContent;
                    var selectvalue = btnselect.textContent;
                    selectvalue = selectvalue.toLowerCase();
                    selectFromCategory(data, selectvalue);
                    dd.ariaExpanded = 'false';
                    clicked = 0;
                    e.preventDefault();
                    return 0;
                })
            }
        }
        else {
            dd.ariaExpanded = 'false';
            clicked = 0;
        }
    });

}



//selecting category
function selectFromCategory(data, selectvalue) {
    if (selectvalue != 'All Categories') {
        const filteredData = data.filter(product => product.category === selectvalue);
        pagination(filteredData);
    }
    else {
        pagination(data);
    }
}

//pagination bonus
function pagination(data) {
    
    var filteredData;
    let currentPage= 0;
    let offset = 9; 
    var flag = 1;
    let maxPage = Math.ceil(data.length / 10);
    InitialData(data);


    function nextPage() {
        if (flag < maxPage) {
            flag++;
            currentPage +=10; 
            offset += 10;
            finalize(flag,currentPage,offset);
        }
    }

    function prevPage() {
        if (flag > 1) {
            flag--;
            currentPage -=10; 
            offset -= 10;
            finalize(flag,currentPage,offset);
        }

    }

    document.getElementById('nextPage').addEventListener('click', nextPage);
    document.getElementById('prevPage').addEventListener('click', prevPage);

    function finalize(flag,currentPage,offset) {
        switch (flag) {
            case 1:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 2:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 3:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 4:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 5:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 6:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 7:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 8:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 9:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
            case 10:
                filteredData = data.filter((product, index) => { return (index >= currentPage && index <= offset) });
                break;
        }
        displayData(filteredData);
        displayData2({ "products": filteredData });
    }

    function InitialData(data) {
        filteredData = data.filter((product, index) => { return (index >= 0 && index <= 9) });
        if (Math.ceil(data.length / 10) == 1) {
            document.getElementById('nextPage').disabled = true;
            document.getElementById('prevPage').disabled = true;
        }
        displayData(filteredData);
        displayData2({ "products": filteredData });
    }
}


