package com.github.millefoglie.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebPageController {

    @RequestMapping({"/", "/index"})
    public String index() {
	return "index";
    }
    
}
