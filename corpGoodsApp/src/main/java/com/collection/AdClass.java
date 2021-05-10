package com.collection;

import java.lang.reflect.Array;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AdClass {
    private String id;
    private String description;
    private Date createdAt;
    private String link;
    private String vendor;
    private String photoLink;
    private ArrayList<String> hashTags;
    private String discount;
    private Date validUntil;
    private double rating;
    private ArrayList<String> reviews;
    public AdClass() {
        id = new String();
        description = new String();
        createdAt = new Date();
        link = new String();
        vendor = new String();
        photoLink = new String();
        hashTags = new ArrayList<String>();
        discount = new String();
        validUntil = new Date();
        reviews = new ArrayList<String>();
    }
    public AdClass(String id, String description, String createdAt, String link, String vendor, String photoLink, ArrayList<String> hashTags, String discount, String validUntil, String rating,ArrayList<String> reviews) {
        this.id = id;
        setDescription(description);
        setLink(link);
        setVendor(vendor);
        setPhotoLink(photoLink);
        setHashTags(hashTags);
        setDiscount(discount);
        setReviews(reviews);
        setCreatedAt(createdAt);
        setValidUntil(validUntil);
        setRating(rating);
    }
    public void setDescription (String description) {
        this.description = description;
    }
    public void setCreatedAt (Date createdAt) {
        this.createdAt = createdAt;
    }
    public void setCreatedAt (String createdAt) {
        try {
            this.createdAt = new SimpleDateFormat("dd.MM.yyyy").parse(createdAt);
            System.out.println(createdAt);
        }
        catch (Exception e) {
            System.out.println(createdAt);
            this.createdAt = null;
            System.out.println("Wrong createdAt date");
        }
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
    public void setHashTags (ArrayList<String> hashTags) {
        this.hashTags = hashTags;
    }
    public void setDiscount (String discount) {
        this.discount = discount;
    }
    public void setValidUntil (Date validUntil) {
        this.validUntil = validUntil;
    }
    public void setValidUntil (String validUntil) {
        try {
            this.validUntil = new SimpleDateFormat("dd.MM.yyyy").parse(validUntil);
        }
        catch (Exception e) {
            this.validUntil = null;
            System.out.println("Wrong validUntil date");
        }
    }
    public void setRating (double rating) {
        this.rating = rating;
    }
    public void setRating(String rating) {
        try {
            this.rating = Double.parseDouble(rating);
        }
        catch (Exception e) {
            this.rating = -1;
            System.out.println("Wrong rating");
        }
    }
    public void setReviews (ArrayList<String> reviews) {
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
    public ArrayList<String> getHashTags () {
        return hashTags;
    }
    public String getDiscount () {
        return discount;
    }
    public Date getValidUntil () {
        return validUntil;
    }
    public double getRating () {
        return rating;
    }
    public ArrayList<String> getReviews () {
        return reviews;
    }

    public boolean isValid() {
        if (id.length() == 0 || description.length() == 0 || description.length() >= 200 || link.length() == 0
                || vendor.length() == 0 || hashTags.size() == 0 || discount.length() == 0 || validUntil == null || createdAt == null || rating == -1) {
            return false;
        }
        return true;
    }
    public boolean filterTags(ArrayList<String> tags) {
        for (String tag : tags) {
            if (!hashTags.contains(tag)) {
                return false;
            }
        }
        return true;
    }
}
