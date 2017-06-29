package com.foss.entity.workflow;

/**
 * @author kevin
 * @date 2017/6/29
 */
public class FormBo {

    public String label;
    public String name;
    public Object value;

    public FormBo(String name, String label, Object value) {
        this.label = label;
        this.name = name;
        this.value = value;
    }

    public FormBo(String name, String label) {
        this.label = label;
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
