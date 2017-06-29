package com.foss.entity.workflow;

/**
 * @author kevin
 * @date 2017/6/12
 */
public class TaskBo {

    private String taskName;
    private String approveUserName;
    private Boolean audit;
    private String auditDesc;
    private String startTime;
    private String endTime;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getApproveUserName() {
        return approveUserName;
    }

    public Boolean isAudit() {
        return audit;
    }

    public void setAudit(Boolean audit) {
        this.audit = audit;
    }

    public String getAuditDesc() {
        return auditDesc;
    }

    public void setAuditDesc(String auditDesc) {
        this.auditDesc = auditDesc;
    }

    public void setApproveUserName(String approveUserName) {
        this.approveUserName = approveUserName;
    }


    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getAuditText() {
        return this.audit.equals(true) ? "同意" : "不同意";
    }
}
