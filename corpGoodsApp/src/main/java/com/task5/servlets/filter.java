package com.example.WebApplication;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter("/*")
public class filter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        long start = System.currentTimeMillis();
        filterChain.doFilter(servletRequest, servletResponse);
        long end = System.currentTimeMillis();
        HttpServletRequest req = (HttpServletRequest)  servletRequest;
        String path = req.getRequestURL().toString();
        String method = req.getMethod();
        System.out.println(method + " - " + path + " - " + (end - start) + "ms");
    }
}
