package me.kafeitu.demo.activiti.entity.mock;

import javax.persistence.*;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Entity
@Table(name = "MOCK_USER_ROLE_R")
public class MockUserRoleR {

    private String id;
    private String userId;
    private String roleId;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Column(name = "USER_ID")
    public String getUserId() {
        return userId;
    }

    @Column(name = "ROLE_ID")
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }
}
