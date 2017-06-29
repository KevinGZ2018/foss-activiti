package com.foss.service;

import com.foss.entity.workflow.TaskBo;
import com.foss.util.Page;
import com.foss.util.PageUtil;
import jodd.datetime.JDateTime;
import com.foss.service.mock.WorkflowTestService;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricActivityInstanceQuery;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.impl.persistence.entity.SuspensionState;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.NativeTaskQuery;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * @author kevin
 * @date 2017/6/29
 */
@Component
public class WorkflowService {

    private static Logger logger = LoggerFactory.getLogger(WorkflowTestService.class);

    @Autowired
    protected TaskService taskService;

    @Autowired
    protected HistoryService historyService;

    @Autowired
    protected RepositoryService repositoryService;

    /**
     *
     * 获得某个流程实例各个节点的审批记录
     *
     * @param processInstanceId
     * @return
     */
    public List<TaskBo> getApproveHistory(String processInstanceId) {

        List<TaskBo> taskBoList = new ArrayList<TaskBo>();
        HistoricProcessInstance hisProcessInstance = historyService
                .createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();

        // 该流程实例的所有节点审批记录
        List<HistoricActivityInstance> hisActInstList = getHisUserTaskActivityInstanceList(hisProcessInstance.getId());

        for (Iterator iterator = hisActInstList.iterator(); iterator.hasNext();) {

            HistoricActivityInstance activityInstance = (HistoricActivityInstance) iterator.next();

            //如果还没结束则不放里面
            if ("".equals(activityInstance.getEndTime()) || activityInstance.getEndTime() == null) {
                //continue;
            }

            TaskBo taskBo = new TaskBo();

            String taskId = activityInstance.getTaskId();

            String audit_key = taskId.concat("_isAudit");
            String auditDesc_key = taskId.concat("_auditDesc");

            HistoricVariableInstance audit = historyService
                    .createHistoricVariableInstanceQuery()
                    .variableName(audit_key).singleResult();

            HistoricVariableInstance desc = historyService
                    .createHistoricVariableInstanceQuery()
                    .variableName(auditDesc_key).singleResult();

            taskBo.setAudit(audit != null && audit.getValue() != null ? Boolean.valueOf(audit.getValue().toString()) : null);
            taskBo.setAuditDesc(desc != null && desc.getValue() != null ? (String) desc.getValue() : null);
            taskBo.setTaskName(activityInstance.getActivityName());

            // 获得审批人名称 Assignee存放的是审批用户id
            if (activityInstance.getAssignee() != null) {
                taskBo.setApproveUserName(getUserName(activityInstance
                        .getAssignee()));
            } else {
                taskBo.setApproveUserName("");
            }
            // 获取流程节点开始时间
            taskBo.setStartTime(DateTimeUtilGetFormatDate(activityInstance.getStartTime()));
            // 获取流程节点结束时间
            if (activityInstance.getEndTime() == null) {
                taskBo.setEndTime("");
            } else {
                taskBo.setEndTime(DateTimeUtilGetFormatDate(activityInstance.getEndTime()));
            }
            taskBoList.add(taskBo);
        }

        return taskBoList;
    }

    public Page<Task> getTodoTaskPage(String currentUser, String currentGroup, Integer currentPage, Integer pageSize) {

        // 已经签收的或者直接分配到当前人的任务
        String asigneeSql = "select distinct RES.* from ACT_RU_TASK RES inner join ACT_RE_PROCDEF D on RES.PROC_DEF_ID_ = D.ID_ WHERE RES.ASSIGNEE_ = #{userId}"
                + " and RES.SUSPENSION_STATE_ = #{suspensionState}";

        // 当前人在候选人或者候选组范围之内
        String needClaimSql = "select distinct RES.* from ACT_RU_TASK RES inner join ACT_RU_IDENTITYLINK I on I.TASK_ID_ = RES.ID_ inner join ACT_RE_PROCDEF D1 on RES.PROC_DEF_ID_ = D1.ID_ WHERE"
                + " RES.ASSIGNEE_ is null and I.TYPE_ = 'candidate'"
                + " and ( I.USER_ID_ = #{userId} or I.GROUP_ID_ IN (#{groupId}) )"
                + " and RES.SUSPENSION_STATE_ = #{suspensionState}";
        String sql = "select a.* from (" + asigneeSql + " union all " + needClaimSql + ") a order by a.CREATE_TIME_ desc";

        NativeTaskQuery query = taskService.createNativeTaskQuery().sql(sql)
                .parameter("suspensionState", SuspensionState.ACTIVE.getStateCode())
                .parameter("userId", currentUser)
                .parameter("groupId", currentGroup);
        List<Task> tasks = query.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);

        Page<Task> page = new Page<Task>();
        page.setResult(tasks);
        page.setTotalCount(query.sql("select count(*) from (" + sql + ") as CT").count());
        return page;
    }

    /**
     * 查询流程定义对象
     *
     * @param processDefinitionId 流程定义ID
     * @return
     */
    public ProcessDefinition getProcessDefinition(String processDefinitionId) {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
        return processDefinition;
    }

    /**
     * 在 ACT_HI_ACTINST 表中找到对应流程实例的userTask节点 不包括startEvent
     *
     * @param processInstanceId
     * @return
     */
    private List<HistoricActivityInstance> getHisUserTaskActivityInstanceList(
            String processInstanceId) {

        HistoricActivityInstanceQuery h = historyService
                .createHistoricActivityInstanceQuery()
                .processInstanceId(processInstanceId).activityType("userTask")
                .finished().orderByHistoricActivityInstanceEndTime().desc();

        List<HistoricActivityInstance> hisActivityInstanceList = h.list();
        return hisActivityInstanceList;
    }

    private String getUserName(String userId) {
        return userId;
    }

    private String DateTimeUtilGetFormatDate(Date date) {
        if(date == null) {
            return "";
        }
        JDateTime jdt = new JDateTime();
        jdt.setDateTime(date);
        return jdt.toString("YYYY-MM-DD hh:mm:ss");
    }

}
