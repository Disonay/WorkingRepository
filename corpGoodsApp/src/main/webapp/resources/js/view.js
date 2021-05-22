class View {
    #adCollecton;
    #userName;
    #isVendor;
    #adTemplate;
    #commentTemplate;
    #id;
    #top;
    createId() {
        this.#id = this.#id + 1;
        return this.#id.toString();
    }
    constructor(userName, isVendor) {
        this.#id = 0;
        this.#top = 3;
        this.#adCollecton = new adModel();
        this.#userName = userName;
        this.#isVendor = isVendor;
        this.#adTemplate = document.querySelector(".ad-template").content;
        this.#commentTemplate = this.#adTemplate.querySelector(".comment-template").content;
    }
    showUser() {
        if (this.#userName && this.#userName.length) {
            document.querySelector(".user-name").textContent = this.#userName;
            document.querySelector(".user-icon").style.visibility = "visible";
            document.querySelector(".sign-button").textContent = "Sign out";
        }
        else {
            document.querySelector(".user-name").textContent = "";
            document.querySelector(".user-icon").style.visibility = "hidden";
            document.querySelector(".sign-button").textContent = "Sign in";

        }
        if (this.#userName && this.#isVendor ) {
             document.querySelector(".new-button").style.visibility = "visible";
        }
        else {
            document.querySelector(".new-button").style.visibility = "hidden";
        }
    }
    #createDomElement(ad) {
        let template = document.importNode(this.#adTemplate, true);
        template.querySelector(".ad-img").setAttribute("src", ad.photoLink);
        template.querySelector(".vendor-name").setAttribute("value",ad.vendor );
        template.querySelector(".name").setAttribute("value", ad.nameOfService);
        template.querySelector(".rating-number").textContent = ad.rating;
        template.querySelector(".short-description").textContent = ad.description;
        template.querySelector(".link").setAttribute("href", ad.link);
        template.querySelector(".link").textContent = ad.link;
        let comments = template.querySelector(".main-feedback-field");
        let comment;
        ad.reviews.forEach(review => {
            comment = document.importNode(this.#commentTemplate, true);
            comment.querySelector(".comment-text").textContent = review;
            comments.appendChild(comment);
        })
        template.querySelector(".time").setAttribute("datetime", ad.createdAt.toDateString());
        template.querySelector(".time").textContent = ad.createdAt.toDateString();
        template.querySelector(".until").textContent = ad.validUntil.toDateString();
        template.querySelector(".percent").textContent = ad.discount.slice(0, -1);
        template.querySelector(".ad-info").setAttribute("id", ad.id)
        let tags = template.querySelector(".hashtags");
        ad.hashTags.forEach(tag => {
            let hashTag = document.createElement('a');
            hashTag.setAttribute("href", "");
            hashTag.textContent = "#" + tag;
            tags.appendChild(hashTag);
        })
        if (!this.#userName || !this.#userName.length) {
            template.querySelector(".add-comment").style.visibility = "hidden";
        }
        if (this.#userName && this.#isVendor && this.#userName === ad.vendor) {
            template.querySelector(".edit").style.visibility = "visible";
            template.querySelector(".delete").style.visibility = "visible";
        }
        else {
            template.querySelector(".edit").style.visibility = "hidden";
            template.querySelector(".delete").style.visibility = "hidden";
        }
        return template;
    }
    showAds(filterConfig, skip = 0, top = 0) {
        let tape = document.querySelector(".tape");
        document.querySelectorAll(".ad-class").forEach( ad => ad.remove());
        this.#top = this.#top + top;
        this.#adCollecton.getPage(skip, this.#top, filterConfig).forEach(ad => tape.appendChild(this.#createDomElement(ad)));
        if (tape.querySelector(".more")) {
            tape.querySelector(".more").remove();
        }
        if (this.#top < localStorage.length) {
            let b = document.createElement("button");
            b.innerHTML = "More";
            b.className= "more";
            tape.appendChild(b);
        }
    }
    addAd(ad) {
        if (this.#adCollecton.add(ad)) {
            this.save(ad);
            return true;
        }
        return false;
    }
    save() {
        localStorage.clear();
        this.#adCollecton.getAll().forEach(element => {
            localStorage.setItem(element.id, JSON.stringify(element))
        });
        if (localStorage.length > this.#id) {
            this.#id = localStorage.length;
        }
    }
    restore() {
        let len = localStorage.length;
        if (len > this.#id) {
            this.#id = len;
        }
        let keys = Object.keys(localStorage);
        let adList = [];
        for (let i = 0; i < len; i++) {
            let item = JSON.parse(localStorage.getItem(keys[i]));
            item.createdAt = new Date(item.createdAt);
            item.validUntil = new Date(item.validUntil);
            item.rating = Number(item.rating);
            adList.push(item);
         }
         this.#adCollecton = new adModel(adList);
    }
    editAd(id, ad){
        if(this.#adCollecton.edit(id, ad)){
            return true;
        }
        return false;
    }
    remove(id) {
        if (this.#adCollecton.remove(id)) {
            this.showAds();
            return true;
        }
        return false;
    }
    filterTags() {
        let uniqTags = [];
        this.#adCollecton.getAll().forEach(ad => {
            ad.hashTags.forEach(tag => {
                if (!uniqTags.includes(tag)) {
                    uniqTags.push(tag);
                }
            });
        });
        let select = document.querySelector(".select-filter-tags");
        select.querySelectorAll(".option").forEach( op => op.remove());
        uniqTags.forEach(tag => {
            let tags = document.createElement("option");
            tags.textContent = tag;
            select.append(tags);
        })
    }
    filterVendors() {
        let uniqVendors = [];
        this.#adCollecton.getAll().forEach(ad => {
                if (!uniqVendors.includes(ad.vendor)) {
                    uniqVendors.push(ad.vendor);
                }
            });
        let select = document.querySelector(".select-filter-vendor");
        select.querySelectorAll(".option").forEach( op => op.remove());
        uniqVendors.forEach(v => {
            let vendor = document.createElement("option");
            vendor.textContent = v;
            select.append(vendor);
        });
    }
    showEditAddPage() {
        document.querySelector(".main-page").remove();
        let editAddPage = document.createElement("main");
        editAddPage.className = "edit-add-page";
        let form = this.#getForm();
        let figure = this.#getDragAndDrop();
        editAddPage.innerHTML = figure + form;
        editAddPage.querySelector(".vendor-input").value = this.#userName;
        editAddPage.querySelector(".vendor-input").setAttribute("readonly", "");
        document.querySelector("header").after(editAddPage);
        window.scroll(0, 0);
    }
    #getDragAndDrop() {
        return `
        <div class="figure-container">
        <figure class="drag-and-drop">
            <img src="./resources/svges/stackImg.svg" alt="" />
            <figcaption>Drag and drop</figcaption>
        </figure>
        </div> 
        `;
    }
    #getForm() {
        return `
        <form class = "new-ad-form" action="">
		<div class="container">
			<div ><p>Supplier name</p></div>
			<input class = "vendor-input" type="">
		</div>
		<div class="container">
			<div class="p-container"><p>Service name</p></div>
			<input class = "service-input" type="">
		</div>
		<div class="container">
		<div><p>Short description</p></div>
			<input class = "short-description-input" type="">
		</div>
		<div class="container">
		<div><p>Full description</p></div>
			<input class = "full-description-input" type="">
		</div>
		<div class="container">
		<div><p>Tags</p></div>
			<input class="tags-input" type="">
		</div>
		<div class="container">
		<div><p>Validity</p></div>
			<input class="valid-input" type="date">
		</div>
		<div class="container">
		<div><p>Amount of discount</p></div>
			<input class="dicsount-input" type="">
		</div>
        <input class = "submit-input" type ="submit">
	</form>
        `;
    }
    showLogInPage() {
        let sign = document.createElement("div");
        sign.className = "sign";
        sign.innerHTML = this.#getSign();
        document.querySelector("main").after(sign);
    }
    #getSign() {
        return `
        <p>Sign in</p>
		<img src="./resources/svges/signin.svg">
		<input type="text" class = "login">
		<input type="password" class = "password">
        <div>
        <p>is vendor</p>
        <input type="checkbox" class="is-vendor"> 
        </div>  
		<button>Sign in</button>`;
    }
    #getFeedBack() {
        return `
        <div class="overall-rating">
									<img src="./resources/svges/rating.svg" alt="rating">
									<select class = "rating-number">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
									</select>
								</div>
								<div>
								<input class = "reviewer-name" type="text">
								</div>
								<div>
								<input class = "review" type="text">	
								</div>
						`;
    }
    deleteAd(id) {
        this.#adCollecton.remove(id);
        this.showAds(filterConfig);
    }
    showAddFeedBack(id) {
        let ad = document.getElementById(id).parentElement.querySelector(".ad");
        ad.className = "new-review";
        console.log(ad);
        ad.querySelector(".description").remove();
        let feedback = ad.querySelector(".feedback");
        feedback = feedback.querySelector(".main-feedback-field");
        feedback.querySelectorAll(".comment").forEach( c => c.remove());
        feedback.className = "review-field";
        feedback.innerHTML = this.#getFeedBack();
        feedback.querySelector(".reviewer-name").value = this.#userName;
        feedback.querySelector(".reviewer-name").setAttribute("readonly", "");
    }
}