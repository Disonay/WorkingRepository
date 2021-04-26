(function() {
    class adModel {
        #adList;
        constructor(adList) {
            this.#adList = new Array();
            this.addAll(adList);
        }
        #addAllValidation(ad) {
            return this.add(ad);
        }
        addAll(adList) {
            if (!Array.isArray(adList)) {
                return adList;
            }
            let wrongAds = []
            adList.forEach(ad => this.#addAllValidation(ad) ? true : wrongAds.push(ad));
            return wrongAds;
        }
        clear() {
            this.#adList = [];
        }
        #filterTags(ad, filterTags) {
            if (ad.hashTags.length > filterTags.length) {
                let includeTags = filterTags.filter(fTags => ad.hashTags.includes(fTags));
                return filterTags.every(ftag => includeTags.find(tag => ftag === tag));
            }
            else {
                return ad.hashTags.every(tag => filterTags.find(ftag => ftag === tag));
            }
        }
        getAll() {
            return this.#adList;
        }
        getPage(skip = 0, top = 10, filterConfig = undefined) {
            if (typeof skip !== "number" || typeof top !== "number" ) {
                console.log("Skip or top are not numbers!");
                return;
            }
            let filterAds = this.#adList;
            filterAds.sort(function compareDate(Ad1, Ad2) {
                return Ad1.createdAt - Ad2.createdAt;
             })
            if (filterConfig) {
                if (filterConfig.vendor) {
                   filterAds = filterAds.filter(ad => ad.vendor == filterConfig.vendor);
                }
                if (filterConfig.date) {
                    filterAds = filterAds.filter(ad => ad.createdAt == filterConfig.date );
                }
                 if (filterConfig.tags) {
                    if (Array.isArray(filterConfig.tags)) {
                        filterAds = filterAds.filter(ad => ad.hashTags.length >= filterConfig.tags.length);
                        
                        filterAds = filterAds.filter(ad => this.#filterTags(ad, filterConfig.tags));
                    }
                 }
            }
            filterAds = filterAds.slice(skip, skip+top);
            return filterAds;
        }

        get(id) {
            return this.#adList.find(ad => ad.id == id);
        }

        static validateAd(adItem) {
            let requiredFileds = ["id", "nameOfService","description", "link", "createdAt", "vendor", "hashTags", "discount", "validUntil"];
        for (let i = 0; i < requiredFileds.length; i++) {
            if (adItem[requiredFileds[i]] == undefined) {
                return false;
            }
        }
        for (let field in adItem) {
            switch (field) {
                case "id":
                    if (typeof adItem.id !== "string" && !adItem.id.length) {
                        return false;
                    }
                    break;
                case "nameOfService": {
                    if (typeof adItem.nameOfService !== "string" && !adItem.nameOfService.length) {
                        return false;
                    }
                    break;
                }
                case "description":
                    if (typeof adItem.description !== "string" || adItem.description.length >= 200 || !adItem.description.length) {
                        return false;
                    }
                    break;
                case "createdAt":
                    if (!(adItem.createdAt instanceof Date)) {
                        return false;
                    }
                    break;
                case "link":
                    if (typeof adItem.link !== "string" || !adItem.link.length) {
                        return false;
                    }
                    break;
                case "vendor":
                    if (typeof adItem.vendor !== "string" && !adItem.vendor.length) {
                        return false;
                    }
                    break;
                case "photoLink":
                    if (typeof adItem.photoLink !== "string") {
                        return false;
                    }
                    break;
                case "hashTags":
                    if (Array.isArray(adItem.hashTags) && adItem.hashTags.length){
                        if (!adItem.hashTags.every(hashtag => typeof hashtag == "string")){
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                    break;
                case "discount":
                    if (typeof adItem.discount !== "string" && adItem.description.length == 0) {
                        return false;
                    }
                    break;
                case "validUntil":
                    if (!(adItem.validUntil instanceof Date)) {
                        return false;
                    }
                    break;
                case "rating":
                    if (!(typeof adItem.rating == null || typeof adItem.rating == "number")){
                        return false;
                    }
                    break;
                case "reviews":
                    if (!Array.isArray(adItem.reviews)) {
                        return false;
                    }
                    break;
                default:
                    return false;
                }
            }
            return true;
            }

        add(adItem) {
            if (adModel.validateAd(adItem)) {
                this.#adList.push(adItem);
                return true;
            }
            return false;
        }

        edit(id, adItem) {
            if (typeof id !== "string") {
                return false;
            }
            let clone = Object.assign({}, this.get(id));
            for (let field in adItem) {
                if (field !== "id" && field !== "createdAt") {
                    clone[field] = adItem[field];
                }
                else {
                    return false;
                }
            }
            if (adModel.validateAd(clone)) {
                let edit = this.get(id);
                for (let field in edit) {
                    edit[field] = clone[field];
                }
                return true;
            }
            return false;
        }

        remove(id) {
            let index = this.#adList.findIndex(ad => ad.id == id);
        if (index >= 0) {
            this.#adList.splice(index, 1);
            return true;
        }
        return false;
        }
    }
    class View {
        #adCollecton;
        #userName;
        #isVendor;
        #adTemplate;
        #commentTemplate
        constructor(ads, userName, isVendor) {
            this.#adCollecton = new adModel(ads);
            this.#userName = userName;
            this.#isVendor = isVendor;
            this.#adTemplate = document.querySelector(".ad-template").content;
            this.#commentTemplate = this.#adTemplate.querySelector(".comment-template").content;
        }
        showUser() {
            if (this.#userName && this.#userName.length) {
                document.querySelector(".user-name").textContent = this.#userName;
                document.querySelector(".sign-button").textContent = "Sign out";
            }
            else {
                document.querySelector(".user-icon").style.visibility = "hidden";
                document.querySelector(".sign-button").textContent = "Sign in";

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
            }
            else {
                template.querySelector(".edit").style.visibility = "hidden";
            }
            return template;
        }
        showAds() {
            let tape = document.querySelector(".tape");
            document.querySelectorAll(".ad-class").forEach( ad => ad.remove());
            this.#adCollecton.getPage().forEach(ad => tape.appendChild(this.#createDomElement(ad)));
        }
        addAd(ad) {
            if (this.#adCollecton.add(ad)) {
                this.showAds();
                return true;
            }
            return false;
        }
        editAd(id, ad){
            if(this.#adCollecton.edit(id, ad)){
                this.showAds();
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
            uniqVendors.forEach(v => {
                let vendor = document.createElement("option");
                vendor.textContent = v;
                select.append(vendor);
            });
        }
    }
    var adCollection = new adModel([
        {
            id: "1",
            nameOfService: "education",
            description: "Скидка на курсы немецкого языка",
            createdAt: new Date("2021-03-02T00:00:00"),
            link: "germancourse2021.by",
            vendor: "Germ Teacher",
            photoLink: "https://germanfox.ru/wp-content/uploads/2020/01/german-home.jpg",
            hashTags: ["german", "forIT", "course"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best courses you can find", "Nice!"],
        },
        {
            id: "2",
            nameOfService: "shop",
            description: "Товары и услуги #1",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "corpshop.by",
            vendor: "corpShop",
            photoLink: "https://www.mcgua.com/wp-content/uploads/2019/06/magazin.png",
            hashTags: ["shop", "forIT", "number1"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best!", "Nice!"],
        },
        {
            id: "3",
            nameOfService: "shop",
            description: "Товары и услуги #2",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "corpshop.by",
            vendor: "corpShop",
            photoLink: "https://www.mcgua.com/wp-content/uploads/2019/06/magazin.png",
            hashTags: ["shop", "forIT", "number2"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best!", "Nice!"],
        },
        {
            id: "4",
            nameOfService: "shop",
            description: "Товары и услуги #3",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "corpshop.by",
            vendor: "corpShop",
            photoLink: "https://www.mcgua.com/wp-content/uploads/2019/06/magazin.png",
            hashTags: ["shop", "forIT", "number3"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best!", "Nice!"],
        },
        {
            id: "5",
            nameOfService: "shop",
            description: "Товары и услуги #4",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "corpshop.by",
            vendor: "corpShop",
            photoLink: "https://www.mcgua.com/wp-content/uploads/2019/06/magazin.png",
            hashTags: ["shop", "forIT", "number4"],
            discount: "10%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best!", "Nice!"],
        },
        {
            id: "6",
            nameOfService: "shop",
            description: "Товары и услуги #5",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "corpshop.by",
            vendor: "corpShop",
            photoLink: "https://www.mcgua.com/wp-content/uploads/2019/06/magazin.png",
            hashTags: ["shop", "forIT", "number5"],
            discount: "15%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best!", "Nice!"],
        },
        {
            id: "7",
            nameOfService: "repair",
            description: "Окна",
            createdAt: new Date("2021-03-03T00:00:00"),
            link: "windows2021.by",
            vendor: "WindowCompany",
            photoLink: "https://www.evrofasad.by/new_tpl/i/price/01_SALAMANDER.png",
            hashTags: ["windows", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 2, 
            reviews: ["The worst windows I ever have"],
        },
        {
            id: "8",
            nameOfService: "repair",
            description: "Окна",
            createdAt: new Date("2021-03-04T00:00:00"),
            link: "GoodWindows2021.by",
            vendor: "GoodWindowCompany",
            photoLink: "https://www.evrofasad.by/new_tpl/i/price/01_SALAMANDER.png",
            hashTags: ["windows", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 3, 
            reviews: ["no bad"],
        },
        {
            id: "9",
            nameOfService: "repair",
            description: "Окна",
            createdAt: new Date("2021-03-05T00:00:00"),
            link: "NiceWindows2021.by",
            vendor: "NiceWindowCompany",
            photoLink: "https://www.evrofasad.by/new_tpl/i/price/01_SALAMANDER.png",
            hashTags: ["windows", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 4, 
            reviews: ["nice!", "good windows"],
        },
        {
            id: "10",
            nameOfService: "repair",
            description: "Окна",
            createdAt: new Date("2021-03-06T00:00:00"),
            link: "BestWindows2021.by",
            vendor: "BestWindowCompany",
            photoLink: "https://www.evrofasad.by/new_tpl/i/price/01_SALAMANDER.png",
            hashTags: ["windows", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best windows!"],
        },
        {
            id: "11",
            nameOfService: "repair",
            description: "Двери",
            createdAt: new Date("2021-03-07T00:00:00"),
            link: "worstdoors.by",
            vendor: "WorstDoorsCompany",
            photoLink: "https://virtoni.by/upload/iblock/5b9/emalirovannye_dveri_2.jpg",
            hashTags: ["doors", "forIT", "worst"],
            discount: "100%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 1, 
            reviews: ["its really worst!", "-5"],
        },
        {
            id: "12",
            nameOfService: "repair",
            description: "Двери",
            createdAt: new Date("2021-03-08T00:00:00"),
            link: "nobaddoors.by",
            vendor: "NoBadDoorsCompany",
            photoLink: "https://virtoni.by/upload/iblock/5b9/emalirovannye_dveri_2.jpg",
            hashTags: ["doors", "forIT", "nobad"],
            discount: "70%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 3, 
            reviews: ["No bad"],
        },
        {
            id: "13",
            nameOfService: "repair",
            description: "Двери",
            createdAt: new Date("2021-03-09T00:00:00"),
            link: "gooddoors.by",
            vendor: "GoodDoorsCompany",
            photoLink: "https://virtoni.by/upload/iblock/5b9/emalirovannye_dveri_2.jpg",
            hashTags: ["doors", "forIT", "good"],
            discount: "60%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 4, 
            reviews: ["no bad!"],
        },
        {
            id: "14",
            nameOfService: "repair",
            description: "Двери",
            createdAt: new Date("2021-03-10T00:00:00"),
            link: "nicedoors.by",
            vendor: "NiceDoorsCompany",
            photoLink: "https://virtoni.by/upload/iblock/5b9/emalirovannye_dveri_2.jpg",
            hashTags: ["doors", "forIT", "nice"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["nice!", "its for you!"],
        },
        {
            id: "15",
            nameOfService: "repair",
            description: "Двери",
            createdAt: new Date("2021-03-11T00:00:00"),
            link: "greatdoors.by",
            vendor: "GreatDoorsCompany",
            photoLink: "https://virtoni.by/upload/iblock/5b9/emalirovannye_dveri_2.jpg",
            hashTags: ["doors", "forIT", "great"],
            discount: "10%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["You can't find better"],
        },
        {
            id: "16",
            nameOfService: "shop",
            description: "Ноутбуки",
            createdAt: new Date("2021-03-20T00:00:00"),
            link: "notebooks.by",
            vendor: "NoteCompany",
            photoLink: "https://ert-group.by/%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA%D0%B8.jpg",
            hashTags: ["notebook", "forIT", "device"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["Nice!"],
        },
        {
            id: "17",
            nameOfService: "shop",
            description: "Телефоны",
            createdAt: new Date("2021-03-19T00:00:00"),
            link: "phone.by",
            vendor: "RingCompany",
            photoLink: "https://www.ixbt.com/img/n1/news/2020/4/2/6409301-1568887001_large.jpg",
            hashTags: ["phone", "forIT", "device"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best phones you can find", "Nice!"],
        },
        {
            id: "18",
            nameOfService: "education",
            description: "Скидка на курсы японского языка",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "japancourse2021.by",
            vendor: "Japan Teacher",
            photoLink: "https://cdn22.img.ria.ru/images/130058/95/1300589535_0:99:2000:1233_600x0_80_0_0_49cc5a56fb9ea9aa21d1776df47bc5d1.jpg",
            hashTags: ["japan", "forIT", "course"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best courses you can find", "Nice!"],
        },
        {
            id: "19",
            nameOfService: "education",
            description: "Скидка на курсы китайского языка",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "chinacourse2021.by",
            vendor: "China Teacher",
            photoLink: "https://cdn22.img.ria.ru/images/130058/95/1300589535_0:99:2000:1233_600x0_80_0_0_49cc5a56fb9ea9aa21d1776df47bc5d1.jpg",
            hashTags: ["china", "forIT", "course"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best courses you can find", "Nice!"],
        },
        {
            id: "20",
            nameOfService: "education",
            description: "Скидка на курсы испанского языка",
            createdAt: new Date("2021-03-22T00:00:00"),
            link: "spaincourse2021.by",
            vendor: "Spain Teacher",
            photoLink: "https://cdn22.img.ria.ru/images/130058/95/1300589535_0:99:2000:1233_600x0_80_0_0_49cc5a56fb9ea9aa21d1776df47bc5d1.jpg",
            hashTags: ["spain", "forIT", "course"],
            discount: "30%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 5, 
            reviews: ["The best courses you can find", "Nice!"],
        },
    ])

    console.log(adCollection.getPage());
    console.log(adCollection.getPage(0, 20));
    console.log(adCollection.getPage(5, 15));
    console.log(adCollection.getPage(0, 20, {vendor: 'corpShop'}));
    console.log(adCollection.getPage(0, 20, {tags: ['forIT']}));
    console.log(adCollection.getPage(0, 20, {tags: ['books']}));
    console.log(adCollection.getPage(0, 20, {tags: ['forIT', 'spain']}));
    console.log(adCollection.getPage(0, 20, {tags: ['forIT', 'course']}));
    console.log(adCollection.getPage(0, 20, {tags: ['forIT', 'course', 'spain']}));
    console.log(adCollection.getPage(0, 20, {vendor: 'Japan Teacher', date:  new Date("2021-03-22T00:00:00")}));
    console.log(adCollection.get("1"));
    console.log(adCollection.get("100"));
    console.log(adCollection.get("first"));
    console.log(adModel.validateAd({
        id: "1",
        description: "Скидка на курсы английского языка",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adModel.validateAd({
        id: "1",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "30%",
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adModel.validateAd({
        id: "1",
        description: "Скидка на курсы английского языка",
        createdAt: "today",
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adModel.validateAd({
        id: "1",
        description: "Скидка на курсы английского языка",
        createdAt: "today",
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: "5", 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adModel.validateAd({
        id: "1",
        nameOfService: "education",
        description: "Скидка на курсы английского языка",
        createdAt: "today",
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: "tag",
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: "5", 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.add({
        id: "100",
        description: "Скидка на курсы английского языка",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "40%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.add({
        id: "101",
        nameOfService: "education",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "10%",
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.adList);
    console.log(adCollection.add({
        id: "102",
        nameOfService: "education",
        description: "Скидка на курсы английского языка",
        createdAt: "today",
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "forIT", "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.add({
        id: "103",
        nameOfService: "education",
        description: "Скидка на курсы английского языка",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: "5", 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.add({
        id: "104",
        nameOfService: "education",
        description: "Скидка на курсы английского языка",
        createdAt: new Date("2021-03-02T00:00:00"),
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: "tag",
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: "5", 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.add({
        id: "102",
        nameOfService: "education",
        description: "Скидка на курсы английского языка",
        createdAt: "today",
        link: "englishcourse2021.by",
        vendor: "Eng Teacher",
        photoLink: "https://habrastorage.org/webt/ng/4m/kg/ng4mkgjfsqoc1_edoejigner-4g.jpeg",
        hashTags: ["english", 5, "course"],
        discount: "30%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 5, 
        reviews: ["The best courses you can find", "Nice!"],
    }));
    console.log(adCollection.getPage(0, 20));
    console.log(adCollection.edit(10,  {discount: "5%"}));
    console.log(adCollection.edit("11",  {discount: "5%", id: "124"}));
    console.log(adCollection.edit("12",  {discount: "5%", rating: 2, description: "new description"}));
    console.log(adCollection.edit("13", {rating: "5"}));
    console.log(adCollection.getPage(0, 25));
    console.log(adCollection.remove("1"));
    console.log(adCollection.getPage(0, 20));
    console.log(adCollection.remove("2"));
    console.log(adCollection.getPage(0, 20));
    console.log(adCollection.remove("first"));
    console.log(adCollection.getPage(0, 20));
    console.log(adCollection.getPage());
    console.log(adCollection.addAll([
        {
            id: "59",
            nameOfService: "repair",
            description: "Столы",
            createdAt: new Date("2021-03-05T00:00:00"),
            link: "NiceTables2021.by",
            vendor: "NiceTableCompany",
            photoLink: "https://images.by.prom.st/134403848_pismennye-stoly-iz.jpg",
            hashTags: ["table", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 4, 
            reviews: ["nice!", "good tables"],
        },
        {
            id: "60",
            nameOfService: "repair",
            description: "Столы",
            createdAt: new Date("2021-03-06T00:00:00"),
            link: "BestTalbe2021.by",
            vendor: "BestTableCompany",
            photoLink: "https://images.by.prom.st/134403848_pismennye-stoly-iz.jpg",
            hashTags: ["table", "forIT"],
            discount: "50%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: "5", 
            reviews: ["The best tables!"],
        },
        {
            id: "61",
            nameOfService: "repair",
            description: "Столы",
            createdAt: new Date("2021-03-07T00:00:00"),
            link: "worsttables.by",
            vendor: "WorstTableCompany",
            photoLink: "https://images.by.prom.st/134403848_pismennye-stoly-iz.jpg",
            hashTags: "table, forIT, worst",
            discount: "100%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 1, 
            reviews: ["its really worst!", "-5"],
        },
        {
            id: "62",
            nameOfService: "repair",
            description: "Столы",
            createdAt: new Date("2021-03-08T00:00:00"),
            link: "nobadtable.by",
            vendor: "NoBadTableCompany",
            photoLink: "https://images.by.prom.st/134403848_pismennye-stoly-iz.jpg",
            hashTags: ["table", "forIT", "nobad"],
            discount: "70%",
            validUntil: new Date("2021-06-01T00:00:00"),
            rating: 3, 
            reviews: ["No bad"],
        },
    ]));
    console.log(adCollection.getPage());
    let view = new View(adCollection.getPage(), "WindowCompany", true);
    view.showUser(); 
    view.showAds();
    view.filterVendors();
    view.filterTags();
    view.addAd({
        id: "62",
        description: "Столы",
        createdAt: new Date("2021-03-03T00:00:00"),
        link: "nobadtable.by",
        vendor: "NoBadTableCompany",
        photoLink: "https://images.by.prom.st/134403848_pismennye-stoly-iz.jpg",
        hashTags: ["table", "forIT", "nobad"],
        discount: "70%",
        validUntil: new Date("2021-06-01T00:00:00"),
        rating: 3, 
        reviews: ["No bad"],
    });
    view.remove(5);
    view.remove(7);
    view.editAd("8", {discount: "20%"});
    view.editAd("8", {vendor: "AnotherVendor"});
}());