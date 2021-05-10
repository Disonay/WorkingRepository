package com.collection;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
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
    public List<AdClass> getPage(String skip, String top, String createdAt, String vendor, String[] tags) {
        ArrayList<AdClass> page = ads;
        skip = skip == null ? "0" : skip;
        top = top == null ? "10" : top;
        System.out.println(top);
        System.out.println(skip);
        page.sort((a,b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
        try {
            if (createdAt != null) {
                Date date = new SimpleDateFormat().parse(createdAt);
                page = page.stream().filter(ad -> ad.getCreatedAt().equals(date)).collect(Collectors.toCollection(ArrayList::new));
            }
            if (vendor != null) {
                page = page.stream().filter(ad -> ad.getVendor().equals(vendor)).collect(Collectors.toCollection(ArrayList::new));
            }
            if (tags != null) {
                ArrayList<String> hashTags = new ArrayList<>(Arrays.asList(tags));
                page = page.stream().filter(ad -> ad.filterTags(hashTags)).collect(Collectors.toCollection(ArrayList::new));
            }
            return page.subList(Integer.parseInt(skip), Integer.parseInt(skip) + Integer.parseInt(top));
        }
        catch (Exception e) {
            return null;
        }
    }
}
