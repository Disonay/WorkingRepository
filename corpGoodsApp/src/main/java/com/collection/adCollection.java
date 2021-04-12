package com.restapi.servlets;

import java.util.ArrayList;
import java.util.stream.Collectors;

public class adCollection {
    private ArrayList<adClass> ads;
    adClass getById (String id) {
        return ads.stream().filter(ad -> ad.getId() == id).collect(Collectors.toList()).get(0);
    }
    boolean deleteById (String id) {
        int size = ads.size();
        ads.removeIf(ad -> ad.getId().equals(id));
        return size == ads.size();
    }
    ArrayList<adClass> getAds() {
        return ads;
    }
}
