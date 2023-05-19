// load all product from cloud when page load
document.addEventListener('DOMContentLoaded',domLoaded);
const axiosInstance = axios.create({
    baseURL:'https://crudcrud.com/api/484d0c2262054839a805c19638461151'
});

let form = document.querySelector('form');
form.addEventListener('submit',formSubmit);

let ul = document.getElementsByTagName('ul');
for(let i=0; i<ul.length;i++){
    // adding event listener to each item category list
    ul[i].addEventListener('click',itemAction);
}

function formSubmit(event){
    event.preventDefault();
    let productPrice = event.target.product_price.value;
    let productName = event.target.product_name.value;
    let productCategory = event.target.product_category.value;

    if(productPrice==='' || productName==='' || productCategory===''){
        alert('enter all details');
    }else{
        addProductToCloud(productPrice,productName,productCategory);
        // resetting all values
        event.target.product_price.value = '';
        event.target.product_name.value = '';
        event.target.product_category.value = '';
    }
}

function addProductToCloud(productPrice,productName,productCategory){
    axiosInstance.post('/products',{
        "productPrice":productPrice,
        "productName":productName,
        "productCategory":productCategory
    })
    .then(res =>{
        console.log('product added successfully');
        // console.log(res.data._id);
        addProductToScreen(productPrice,productName,productCategory,res.data._id);
    })
    .catch(err =>{
        console.log(err);
    })
}

function addProductToScreen(productPrice,productName,productCategory,productId){
    let li = document.createElement('li'); 
    li.className='list-group-item';
    li.setAttribute('id',productId);
    // console.log(li);
    let pName = document.createElement('span');
    pName.className='px-1 product_name';
    pName.appendChild(document.createTextNode(productName));
    let pPrice = document.createElement('span');
    pPrice.className='px-1 product_price';
    pPrice.appendChild(document.createTextNode(productPrice));
    let pCategory = document.createElement('span');
    pCategory.className='px-1 product_category';
    pCategory.appendChild(document.createTextNode(productCategory));
    let button = document.createElement('button');
    button.className = 'btn btn-sm btn-danger delete float-end';
    button.appendChild(document.createTextNode('delete'));

    li.appendChild(pPrice);
    li.appendChild(pName);
    li.appendChild(pCategory);
    li.appendChild(button);
    let ul = document.getElementById(productCategory);
    ul.appendChild(li);
    // console.log(li);
}

// this fuction triggers when we click on any li element
function itemAction(event){
    if(event.target.classList.contains('delete')){
        let li = event.target.parentElement;
        // console.log(li.id);
        deleteFromCloud(li.id, li);
    }
}

function deleteFromCloud(id, li){
    axiosInstance.delete(`/products/${id}`)
     .then(res =>{
        console.log('deleted successfully');
        deleteFromScreen(li);
     })
     .catch(err =>{
        console.log(err);
     })
}

function deleteFromScreen(li){
    li.parentElement.removeChild(li);
}
function domLoaded(){
    axiosInstance.get('/products')
     .then(res =>{
        for(let i=0; i<res.data.length;i++){
            // productPrice,productName,productCategory,productId
            let pPrice = res.data[i].productPrice;
            let pName = res.data[i].productName;
            let pCategory = res.data[i].productCategory;
            // console.log(pPrice,pName,pCategory,res.data[i]._id);
            addProductToScreen(pPrice,pName,pCategory,res.data[i]._id);
        }
     })
     .catch(err =>{
        console.log(err);
     })
}