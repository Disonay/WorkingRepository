package com.restapi.servlets;

import com.collection.AdClass;
import com.collection.AdCollection;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
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
        AdCollection ads = new AdCollection();
        List<AdClass> page = ads.getPage(skip, top, createdAt, vendor, tags);
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        if (page != null) {
            String jsonPage = ow.writeValueAsString(page);
            resp.getOutputStream().println(jsonPage);
        }
        else {
            resp.getOutputStream().println("[ ]");
        }
    }
}
