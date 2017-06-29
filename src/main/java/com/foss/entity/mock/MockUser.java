package com.foss.entity.mock;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Entity
@Table(name = "MOCK_USER")
public class MockUser implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String email;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Column(name = "NAME")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "EMAIL")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "MockUser: " +
                "id=" + this.id + " " +
                "name=" + this.name + " " +
                "email=" + this.email;
    }
}
