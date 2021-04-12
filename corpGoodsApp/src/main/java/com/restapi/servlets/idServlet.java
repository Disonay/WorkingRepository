package com.restapi.servlets;

import com.collection.adCollection;
import com.collection.adClass;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Array;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

@WebServlet("/ads")
public class idServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        adCollection ads = new adCollection();
        String jsonAd = ow.writeValueAsString(ads.getById(id));
        resp.getOutputStream().println(jsonAd);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        adCollection ads = new adCollection();
        String id = req.getParameter("id");
        if (ads.deleteById(id)) {
            String json = "{'delete': 'true'}";
            resp.getOutputStream().println(json);
        }
        else {
            String json = "{'delete': 'false'}";
            resp.getOutputStream().println(json);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        String description = req.getParameter("description");
        String createdAt = req.getParameter("createdAt");
        String link = req.getParameter("link");
        String vendor = req.getParameter("vendor");
        String photoLink = req.getParameter("photoLink");
        String[] hashTags = req.getParameterValues("hashTags");
        String discount = req.getParameter("discount");
        String validUntil = req.getParameter("validUntil");
        String rating = req.getParameter("rating");
        String[] reviews = req.getParameterValues("reviews");
        adClass ad = new adClass();
        ad.validateDateAndNumber(createdAt, rating, validUntil);
        ad.setId(id);
        ad.setDescription(description);
        ad.setLink(link);
        ad.setVendor(vendor);
        ad.setPhotoLink(photoLink);
        ad.setHashTags(new ArrayList<String>(Arrays.asList(hashTags)));
        ad.setDiscount(discount);
        ad.setReviews(new ArrayList<String>(Arrays.asList(reviews)));
        adCollection ads = new adCollection();
        if (ads.add(ad)) {
            String json = "{'add': 'true'}";
            resp.getOutputStream().println(json);
        }
        else {
            String json = "{'add': 'false'}";
            resp.getOutputStream().println(json);
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            String jsonAd = ow.writeValueAsString(ad);
            resp.getOutputStream().println(jsonAd);
            resp.getOutputStream().println(validUntil);
        }
    }
}
