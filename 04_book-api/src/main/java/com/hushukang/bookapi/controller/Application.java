package com.hushukang.bookapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class Application {
    @GetMapping("/stat")
    public String stat() {
        return "OK";
    }
}
