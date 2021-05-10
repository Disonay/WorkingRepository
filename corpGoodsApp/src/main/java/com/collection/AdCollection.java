package com.collection;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AdCollection {
    private static ArrayList<AdClass> ads = new ArrayList<>();
    public AdClass getById (String id) {
        System.out.println(ads.size());
        List<AdClass> idAds = ads.stream().filter(ad -> ad.getId().equals(id)).collect(Collectors.toList());
        System.out.println(idAds);
        System.out.println(ads.size());
        return idAds.size() == 1 ? idAds.get(0) : null;
    }
    public boolean deleteById (String id) {
        int size = ads.size();
        ads.removeIf(ad -> ad.getId().equals(id));
        return size != ads.size();
    }
    public ArrayList<AdClass> getAds() {
        return ads;
    }

    public boolean add(AdClass ad) {
        if (ad != null) {
            if (ad.isValid()) {
                if (getById(ad.getId()) == null) {
                    ads.add(ad);
                    return true;
                }
            }
        }
        return false;
    }
}
