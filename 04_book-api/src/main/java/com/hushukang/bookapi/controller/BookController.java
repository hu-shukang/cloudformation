package com.hushukang.bookapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("book")
public class BookController {
    @GetMapping("")
    public List<Map<String, String>> bookList() {
        List<Map<String, String>> result = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Map<String, String> map = new HashMap<>();
            map.put("name", "book_name" + i);
            map.put("price", Integer.toString(i));
            result.add(map);
        }
        
        return result;
    }
}
