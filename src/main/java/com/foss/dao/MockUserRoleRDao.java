package com.foss.dao;

import com.foss.entity.mock.MockUserRoleR;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Component
public class MockUserRoleRDao {

    @PersistenceContext
    private EntityManager entityManager;

    public List<MockUserRoleR> getMockRoleList() {
        Query query = entityManager.createQuery("from MockUserRoleR");
        List<MockUserRoleR>  result = query.getResultList();
        return result;
    }
}
