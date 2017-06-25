package me.kafeitu.demo.activiti.entity.mock;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Entity
@Table(name = "MOCK_ROLE")
public class MockRole implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String description;


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

    @Column(name = "DESCRIPTION")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "MockRole: " +
                "id=" + this.id + " " +
                "name=" + this.name + " " +
                "description=" + this.description;
    }
}
