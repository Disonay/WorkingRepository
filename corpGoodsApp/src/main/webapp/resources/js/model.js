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
            if (filterConfig.date && !filterConfig.until) {
                filterAds = filterAds.filter(ad => ad.createdAt >= filterConfig.date);
            }
            if (filterConfig.date && filterConfig.until) {
                filterAds = filterAds.filter(ad =>  ad.createdAt >= filterConfig.date && ad.createdAt <= filterConfig.until);
            }
            if (!filterConfig.date && filterConfig.until) {
                filterAds = filterAds.filter(ad => ad.createdAt <= filterConfig.until);
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
                if (field == "reviews") {
                    adItem[field].forEach(r => clone[field].push(r));
                }
                else if (field == "rating") {
                    clone[field] = (adItem[field] +  clone[field])/2;
                }
                else {
                clone[field] = adItem[field];
                }
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