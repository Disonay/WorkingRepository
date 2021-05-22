(function() {
    view = new View();
    view.restore();
    filterConfig =  ({date: null, until: null, vendor: null, tags: []});
    filterClicked = {first: false, second: false, third: false, forth: false};
    view.showAds(filterConfig);
    view.filterTags();
    view.filterVendors();
    view.showUser();
    function filterSelect(event) {
        if (event.target.className === "checkbox-from") {
            if (event.target.checked) {
                filterClicked.first = true;
            }
            else {
                filterClicked.first = false;
                filterConfig.date = null;
            }
        }
        if (event.target.className === "checkbox-to") {
            if (event.target.checked) {
                filterClicked.second = true;
            }
            else {
                filterClicked.second = false;
                filterConfig.until = null;
            }
        }
        if (event.target.className === "checkbox-tags") {
            if (event.target.checked) {
                filterClicked.third = true;
            }
            else {
                filterClicked.third = false;
                filterConfig.tags = [];
            }
        }
        if (event.target.className === "checkbox-vendor") {
            if (event.target.checked ) {
                filterClicked.forth = true;
            }
            else {
                filterClicked.forth = false;
                filterConfig.vendor = null;
            }
        }
        if (event.target.className === "input-created-date" && filterClicked.first) {
            filterConfig.date = new Date(event.target.value);
        }
        if (event.target.className === "input-until-date" && filterClicked.second) {
            filterConfig.until = new Date(event.target.value);
        }
        if (event.target.className === "select-filter-tags" && filterClicked.third) {
            filterConfig.tags = [event.target.value];
        }
        if (event.target.className === "select-filter-vendor" && filterClicked.forth) {
            filterConfig.vendor = event.target.value;
        }
        view.showAds(filterConfig);
    }
    function ButtonClick(event) {
        if (event.target.className == "edit" || event.target.className == "new-button") {
        view.showEditAddPage();
        let editPage = document.querySelector(".edit-add-page");
        if (event.target.className == "new-button") {
        editPage.addEventListener("submit", sendButton);
        }
        else {
            console.log("test");
            editPage.addEventListener("submit",{handleEvent: sendButton, id: event.target.parentNode.parentNode.id});
        }
        }
        if (event.target.className == "delete") {
            view.deleteAd(event.target.parentNode.parentNode.id);
            view.save();
            view.filterTags();
            view.filterVendors();
        }
        if (event.target.className == "add-comment") {
            if (!event.target.parentNode.parentNode.parentNode.querySelector(".new-review")) {
            view.showAddFeedBack(event.target.parentNode.parentNode.parentNode.querySelector(".ad-info").id);
            }
            else {
                console.log(event.target.parentNode.parentNode);
                review = event.target.parentNode.parentNode.querySelector(".review").value;
                rat =  event.target.parentNode.parentNode.querySelector(".rating-number").value;
                view.editAd(event.target.parentNode.parentNode.parentNode.querySelector(".ad-info").id, {reviews: [review], rating: Number(rat)});
                view.save();
                view.restore();
                view.showAds(filterConfig, 0, 3);
            }
        }
        if (event.target.className == "more") {
            view.showAds(filterConfig, 0, 3);
        }
    }
    function sign(event) {
        if  (event.target.type == "submit") {
            user = event.target.parentNode.querySelector(".login").value;
            pass = event.target.parentNode.querySelector(".password").value;
            isVendor = event.target.parentNode.querySelector(".is-vendor").checked;
            console.log(isVendor);
            view = new View(user, isVendor);
            view.showUser();
            view.restore();
            event.target.parentNode.remove();
            view.showAds();
        }
    }
    function buttonSignClick(event) {
        console.log(event.target.innerHTML);
        if (event.target.innerHTML == "Sign in") {
            view.showLogInPage();
            console.log("test");
            console.log( document.querySelector(".sign"));
            document.querySelector(".sign").addEventListener('click', sign);
        }
        if (event.target.innerHTML == "Sign out") {
            view = new View();
            view.showUser();
            view.restore();
            view.showAds();
        }
    }
    function sendButton(event) {
       let main =  event.currentTarget;
       let ad =  {id: "",
       nameOfService: "",
       description: "",
       createdAt: null,
       link: "",
       vendor: "",
       photoLink: "",
       hashTags: [],
       discount: "",
       validUntil: null ,
       rating: 0, 
       reviews: []}
       if (!this.id) {
       ad.id = view.createId();
       ad.createdAt = new Date();
       }
       else {
        ad =  {
        nameOfService: "",
        description: "",
        link: "",
        vendor: "",
        photoLink: "",
        hashTags: [],
        discount: "",
        validUntil: null ,
        rating: 0, 
        reviews: []}
       }
       ad.vendor = document.querySelector(".vendor-input").value;
       document.querySelector(".vendor-input").setAttribute("readonly", "");
       ad.nameOfService = document.querySelector(".service-input").value;
       ad.description = document.querySelector(".short-description-input").value;
       ad.link = document.querySelector(".full-description-input").value;
       ad.hashTags = document.querySelector(".tags-input").value.split(" ");
       ad.validUntil = new Date(document.querySelector(".valid-input").value);
       ad.discount = document.querySelector(".dicsount-input").value;
       if (!this.id) {
         if (view.addAd(ad)) {
             view.save();
         }
        else {
            alert("wrong");
        }
        }
        else {
            alert("there");
            if (view.editAd(this.id, ad)) {
                view.save();
            }
            else {
                alert("wrong");
            }
        }
    }
    filter = document.querySelector(".filter");
    editButton = document.querySelector(".main-page");
    signIn = document.querySelector("header");
    console.log(editButton);
    filter.addEventListener('change', filterSelect);
    editButton.addEventListener('click', ButtonClick);
    signIn.addEventListener('click', buttonSignClick);
}());
    
