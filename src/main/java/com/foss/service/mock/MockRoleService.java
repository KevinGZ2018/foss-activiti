package com.foss.service.mock;

import com.foss.entity.mock.MockRole;
import com.foss.dao.MockRoleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Service
@Transactional
public class MockRoleService {

    @Autowired
    private MockRoleDao mockRoleDao;

    public Page<MockRole> getMockRolePage(Integer currentPage, Integer pageSize) {
        // QUser user = QUser.user;
        // Predicate predicate = user.name.like((Expressions.asString("%").concat(name).concat("%")));
        // Sort sort = new Sort(new Sort.Order(Sort.Direction.ASC,"id"));
        // PageRequest pageRequest = new PageRequest(0,10,sort);
        Pageable page = new PageRequest(currentPage-1, pageSize);
        return mockRoleDao.findAll(page);
        //return mockUserRepository.findAll();
    }
}
