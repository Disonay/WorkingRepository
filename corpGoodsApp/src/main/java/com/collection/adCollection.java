package com.collection;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class adCollection {
    private static ArrayList<adClass> ads;
    public adCollection() {
        if (ads == null) {
            ads = new ArrayList<>();
        }
    }
    public adClass getById (String id) {
        System.out.println(ads.size());
        List<adClass> idAds = ads.stream().filter(ad -> ad.getId().equals(id)).collect(Collectors.toList());
        System.out.println(idAds);
        System.out.println(ads.size());
        return idAds.size() == 1 ? idAds.get(0) : null;
    }
    public boolean deleteById (String id) {
        int size = ads.size();
        ads.removeIf(ad -> ad.getId().equals(id));
        return size != ads.size();
    }
    public ArrayList<adClass> getAds() {
        return ads;
    }

    public boolean add(adClass ad) {
        if (ad.validateAd()) {
            if (getById(ad.getId()) == null) {
                ads.add(ad);
                return true;
            }
        }
        return false;
    }
}
