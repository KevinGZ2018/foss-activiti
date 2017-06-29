package com.foss.web;

import com.foss.service.mock.MockUserService;
import com.foss.service.mock.MockRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author kevin
 * @date 2017/6/2
 */
@RestController
public class MockController {

    @Autowired
    private MockUserService mockUserService;

    @Autowired
    private MockRoleService mockRoleService;

    @RequestMapping(value = "/user/list")
    public Object getMockUserPage(@RequestParam Integer currentPage, @RequestParam Integer pageSize) {
        return mockUserService.getMockUserPage(currentPage, pageSize);
    }

    @RequestMapping(value = "/role/list")
    public Object getMockRolePage(@RequestParam Integer currentPage, @RequestParam Integer pageSize) {
        return mockRoleService.getMockRolePage(currentPage, pageSize);
    }

    @RequestMapping(value = "/org/list")
    public Object mockOrgList() {

        List<Map<String, String>> orgList = new ArrayList<>();

        Map<String, String> map1 = new HashMap<>();
        map1.put("id", "1");
        map1.put("name", "development department");
        map1.put("alias", "开发部");

        Map<String, String> map2 = new HashMap<>();
        map2.put("id", "2");
        map2.put("name", "administration department");
        map2.put("alias", "行政部");

        Map<String, String> map3 = new HashMap<>();
        map3.put("id", "3");
        map3.put("name", "financial department");
        map3.put("alias", "财务部");

        orgList.add(map1);
        orgList.add(map2);
        orgList.add(map3);
        return orgList;
    }
}
