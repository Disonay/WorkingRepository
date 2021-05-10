package com.restapi.servlets;

import com.collection.AdClass;
import com.collection.adCollection;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Array;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.stream.Collectors;

@WebServlet("/ads/search")
public class pageServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String skip = req.getParameter("skip");
        String top = req.getParameter("top");
        String createdAt = req.getParameter("createdAt");
        String vendor = req.getParameter("vendor");
        String[] tags = req.getParameterValues("hashTags");
        adCollection ads = new adCollection();
        ArrayList<AdClass> page = ads.getAds();
        System.out.println(top);
        System.out.println(skip);
        skip = skip == null ? "0" : skip;
        top = top == null ? "10" : top;
        System.out.println(top);
        System.out.println(skip);
        page.sort((a,b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
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
            String jsonPage = ow.writeValueAsString(page.subList(Integer.parseInt(skip), Integer.parseInt(skip) + Integer.parseInt(top)));
            resp.getOutputStream().println(jsonPage);
        }
        catch (Exception e) {
            resp.getOutputStream().println("[ ]");
        }

    }
}
