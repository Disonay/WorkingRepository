package com.restapi.servlets;

import java.lang.reflect.Array;
import java.util.Date;

public class adClass {
    private String id;
    private String description;
    private Date createdAt;
    private String link;
    private String vendor;
    private String photoLink;
    private Array hashTags;
    private String discount;
    private Date validUntil;
    private Number rating;
    private Array reviews;
    adClass(String id, String description, Date createdAt, String link, String vendor, String photoLink, Array hashTags, String
            discount, Date validUntil, Number rating, Array reviews) {
        this.reviews = reviews;
        this.description = description;
        this.createdAt = createdAt;
        this.link = link;
        this.vendor = vendor;
        this.photoLink = photoLink;
        this.hashTags = hashTags;
        this.discount = discount;
        this.validUntil = validUntil;
        this.rating = rating;
        this.reviews = reviews;
    }
    public void setId (String id) {
        this.id = id;
    }
    public void setDescription (String description) {
        this.description = description;
    }
    public void setCreatedAt (Date createdAt) {
        this.createdAt = createdAt;
    }
    public void setLink (String link) {
        this.link = link;
    }
    public void setVendor (String vendor) {
        this.vendor = vendor;
    }
    public void setPhotoLink (String photoLink) {
        this.photoLink = photoLink;
    }
    public void setHashTags (Array hashTags) {
        this.hashTags = hashTags;
    }
    public void setDiscount (String discount) {
        this.discount = discount;
    }
    public void setValidUntil (Date validUntil) {
        this.validUntil = validUntil;
    }
    public void setRating (Number rating) {
        this.rating = rating;
    }
    public void setReviews (Array reviews) {
        this.reviews = reviews;
    }
    public String getId () {
        return id;
    }
    public String getDescription () {
        return description;
    }
    public Date getCreatedAt () {
        return createdAt;
    }
    public String getLink () {
        return link;
    }
    public String getVendor () {
        return vendor;
    }
    public String getPhotoLink () {
        return photoLink;
    }
    public Array getHashTags () {
        return hashTags;
    }
    public String getDiscount () {
        return discount;
    }
    public Date getValidUntil () {
        return validUntil;
    }
    public Number getRating () {
        return rating;
    }
    public Array getReviews () {
        return reviews;
    }
}
