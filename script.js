//******** SELECT ITEMS ************/
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");




// edit option
let editElement;
let editFlag = false;
let editID = "";

//EVENT LISTENERS
// submit form
form.addEventListener("submit", addItem);

//clear items
clearBtn.addEventListener("click", clearItems);// pag kinlick yung clear items, mare-remove yung item sa lahat

//load items
window.addEventListener("DOMContentLoaded", setupItems)




//FUNCTION

// add item 
function addItem(e){
    e.preventDefault();// ayaw natin mawala yung sinubmit natin
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
       const element = document.createElement("article");
       // add id
       let attr = document.createAttribute("data-id");//create attri bute na may data-id
       attr.value = id;// then yung value ng attribute  na yun ay nilagay mo sa id 
       element.setAttributeNode(attr);// then nilagay mo yung attr sa may element which is yung article na grocery-item
       //add class
       element.classList.add("grocery-item"); //inadd mo yung element. sa classlist na grocery-item
       element.innerHTML = `<p class="title">${value}</p>
       <div class="btn-container">
           <button type="button" class="edit-btn">
               <i class="fas fa-edit"></i>
           </button>
           <button type="button" class="delete-btn">
               <i class="fas fa-trash"></i>
           </button>
       </div>`;


        //deletebtn
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);

        //editbtn
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem); 
       
     

       // append child
       list.appendChild(element);//ibog sabihin ay kinabit mo yung grocery list sa element, which is yung article yung element

       //display elert
       displayAlert("item added to the list", "success");

       //show container
       container.classList.add("show-container");// inadd mo yung show container na class sa container na variable

       //add to local storage
       addToLocalStorage(id, value);

       //set back to default
       setBackToDefault();// balik ulit sa dati after mag-add ng item or magedit
    } else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");

        //edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger")
    }
}

//display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

//clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });// kapag mas higit sa zero yung items, ireremove each item. 
    }
    container.classList.remove("show-container");// tanggal din ang show-container
    displayAlert("empty list", "danger");//then magpa-popup tong display alert
    setBackToDefault();//then balik ulit sa default
    localStorage.removeItem("list");// then tanggal sa local storage yung mga item na yun.
}

//delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;// gumawa ng var na element tapos nilagyan sya ng value kung saan yung target ng event ay yung grandparent ng element na yun, in this case ay yung grocery-list at yung parentelement nabtn-container
    const id = element.dataset.id;// inaccess mo yung id ng item sa grocery-item. bawat item ay may id

    list.removeChild(element);// iremove mo sa list yung element)grocery-item

    if (list.children.length === 0) {
        container.classList.remove("show-container");//kapag zero na ang list, remove container na
    }
    displayAlert("item removed", "danger");//then display tong alert na to

    setBackToDefault();//the back again sa defualt na empty
    //remove from local storage
    removeFromLocalStorage(id);//then iremove din yung item sa localstorage
}

// edit function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;//tinarget ulit yung grocery-item at ginawa syang laman ng element

    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;// tinarget naman dito yung btn container na parentelement tapos yung p tag na previous element sibling
    //set form value
    grocery.value = editElement.innerHTML;//kasi nga ieedit mo yung loob ng html
    editFlag = true;//true sya kasi nageedit ka
    editID = element.dataset.id;//maeedit din yung dataset id nung item

    submitBtn.textContent = "edit";// mababago yung text content nung submitbtn, magiging edit siya
}

//set back to default
function setBackToDefault(){
    grocery.value = ""; // balik ulit sa empty yung value ng grocery
    editFlag = false; // balik ulit sa flase yung edit
    editID = ""; // wala ulit laman yung id
    submitBtn.textContent = "submit"; // then balik sa submit yung textcontent
}; 

// LOCAL STORAGE 

//local storage
function addToLocalStorage(id, value){
    const grocery = { id, value }; 
    let items = getLocalStorage(); // setting the value of items sa kung ano ang meron sa getLocalStorage, array na to. 
    items.push(grocery);// dagdag mo yung grocery sa items, item is yung laman ng getlocalstorage.magiging part na ng array yung dinagdag mo.
    localStorage.setItem("list", JSON.stringify(items));//naka-array yung laman ng list kaya iko-convert sya sa string kasi di pwede na array laman ng localStorage
}

//getlocalstorage
function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : []; // ire-retirieve mo yung laman ng local storage then ico-convert mo sya sa array kaya may parse.
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();// retrieve current items on loclstorge

    items = items.filter(function (item) {
        if (item.id !== id) {//It filters the array of items by creating a new array that contains only the items whose id does not match the provided id.
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));// store again in the local storage
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {//map kasi whole content ng array ang babaguhin, It maps the array of items to a new array, where each item is modified if its id matches the provided id. 
        if (item.id === id) {//If the id matches, the function updates the value property of the item to the provided value. If the id does not match, the function returns the original item.
            item.value = value; 
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}


//set-up items
function setupItems() {// this function ay yung process ng paggawa ng items ulit. 
    let items = getLocalStorage();

    if (items.length > 0) {//It checks if the length of the array is greater than 0. If it is, the function continues to the next step. If not, the function ends.
    items.forEach(function (item){
        createListItem(item.id, item.value);
    }); // It uses the forEach() method to iterate over the array of items and call the createListItem() function for each item. The createListItem() function is called with the id and value properties of the item as arguments.
    container.classList.add("show-container");
    } //It adds the class "show-container" to an element with the container variable
}

function createListItem(id, value){//this function is the template /structure kapag gagawa ka ulit ng items. 
    const element = document.createElement("article");
       // add id
       let attr = document.createAttribute("data-id");
       attr.value = id;
       element.setAttributeNode(attr);
       //add class
       element.classList.add("grocery-item");
       element.innerHTML = `<p class="title">${value}</p>
                <div class="btn-container">
                    <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;

       //deletebtn
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);

        //editbtn
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);

       // append child
       list.appendChild(element);
}

