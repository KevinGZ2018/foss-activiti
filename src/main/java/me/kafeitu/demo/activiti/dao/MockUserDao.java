package me.kafeitu.demo.activiti.dao;

import me.kafeitu.demo.activiti.entity.mock.MockUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author kevin
 * @date 2017/6/9
 */

@Repository
public interface MockUserDao extends JpaRepository<MockUser, String> {
}

