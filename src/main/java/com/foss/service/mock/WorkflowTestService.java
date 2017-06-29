package com.foss.service.mock;

import com.foss.entity.oa.Leave;
import com.foss.entity.workflow.TaskBo;
import com.foss.service.WorkflowService;
import com.foss.service.oa.leave.LeaveManager;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author kevin
 * @date 2017/6/13
 */
@Component
public class WorkflowTestService {

    private static Logger logger = LoggerFactory.getLogger(WorkflowTestService.class);

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    protected TaskService taskService;

    @Autowired
    protected HistoryService historyService;

    @Autowired
    protected RepositoryService repositoryService;

    @Autowired
    private IdentityService identityService;

    @Autowired
    private LeaveManager leaveManager;

    @Autowired
    private WorkflowService workflowService;

    /**
     * 启动流程
     *
     * @param definitionKey
     * @param businessKey
     * @param authenticatedUserId
     * @param variables
     */
    public ProcessInstance startWorkflow(String definitionKey, String businessKey,
                                         String authenticatedUserId, Map<String, Object> variables) {

        ProcessInstance processInstance;
        try {
            // 用来设置启动流程的人员ID，引擎会自动把用户ID保存到activiti:initiator中
            identityService.setAuthenticatedUserId(authenticatedUserId);

            processInstance = businessKey != null && !"".equals(businessKey) ?
                    runtimeService.startProcessInstanceByKey(definitionKey, businessKey, variables) :
                    runtimeService.startProcessInstanceByKey(definitionKey, variables);

            String processInstanceId = processInstance.getId();
            logger.debug("start process of {key={}, bkey={}, pid={}, variables={}}", new Object[]{definitionKey, businessKey, processInstanceId, variables});
        } finally {
            identityService.setAuthenticatedUserId(null);
        }
        return processInstance;
    }

    /**
     * 查询待办任务
     *
     * @param userIdOrGroupId
     * @return
     */
    @Transactional(readOnly = true)
    public List<Task> findTodoTasks(String userIdOrGroupId) {

        // 根据当前人的ID查询
        TaskQuery taskQuery = taskService.createTaskQuery().taskCandidateOrAssigned(userIdOrGroupId);
        TaskQuery groupTaskQuery = taskService.createTaskQuery().taskCandidateGroup(userIdOrGroupId);
        List<Task> tasks = taskQuery.list();
        tasks.addAll(groupTaskQuery.list());

        System.out.println("============= 您有 " + tasks.size() + "条 待办记录：");

        // 根据流程的业务ID查询实体并关联
        for (Task task : tasks) {
            String processInstanceId = task.getProcessInstanceId();
            ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).active().singleResult();
            if (processInstance == null) {
                continue;
            }
            String businessKey = processInstance.getBusinessKey();
            if (businessKey == null) {
                continue;
            }
            Leave leave = leaveManager.getLeave(new Long(businessKey));

            if(leave != null) {
                System.out.println("请假类型: " + leave.getLeaveType());
                System.out.println("请假原因: " + leave.getReason());
                System.out.println("请假人: " + leave.getUserId());
            }

            printProcessInfo(processInstance);

            // 查看上游的审批记录
            List<TaskBo> taskBoList = workflowService.getApproveHistory(processInstanceId);
            printTaskBoListInfo(taskBoList);
        }

        return tasks;
    }

    /**
     * 读取运行中的流程
     *
     * @return
     */
    public List<ProcessInstance>  findRunningProcessInstaces(int currentPage, int pageSize) {

        ProcessInstanceQuery query = runtimeService.createProcessInstanceQuery().active().orderByProcessInstanceId().desc();
        List<ProcessInstance> list = query.listPage(currentPage, pageSize);

        // 关联业务实体
        for (ProcessInstance processInstance : list) {
            String businessKey = processInstance.getBusinessKey();
            if (businessKey == null) {
                continue;
            }

            // 设置当前任务信息
            List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstance.getId()).active().orderByTaskCreateTime().desc().listPage(0, 1);
            Task currentTask = tasks.get(0);

            System.out.println("流程当前所处节点： " + currentTask.getName());

            printProcessInfo(processInstance);
        }
        return list;
    }

    /**
     * 读取已结束中的流程
     *
     * @return
     */
    public List<HistoricProcessInstance> findFinishedProcessInstaces(int currentPage, int pageSize) {
        HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().finished().orderByProcessInstanceEndTime().desc();
        List<HistoricProcessInstance> list = query.listPage(currentPage, pageSize);

        for (HistoricProcessInstance historicProcessInstance : list) {

            printProcessInfo(historicProcessInstance);

            List<TaskBo> taskBoList = workflowService.getApproveHistory(historicProcessInstance.getId());
            printTaskBoListInfo(taskBoList);

        }
        return list;
    }

    public void deleteFinishedProcessInstaces() {
        HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().finished().orderByProcessInstanceEndTime().desc();
        List<HistoricProcessInstance> list = query.listPage(0, 20);

        System.out.println("删除前：" + list.size());

        for (HistoricProcessInstance historicProcessInstance : list) {
            historyService.deleteHistoricProcessInstance(historicProcessInstance.getId());
        }
    }

    private void printTaskBoListInfo(List<TaskBo> taskBoList) {
        System.out.println("***************   审批意见开始    *************** ");
        for(TaskBo taskBo: taskBoList) {
            System.out.println("----------------------------------");
            System.out.println("审批人: " + taskBo.getApproveUserName());
            System.out.println("审批开始时间: " + taskBo.getStartTime());
            System.out.println("审批结束时间: " + taskBo.getEndTime());
            System.out.println("是否审批通过: " + taskBo.isAudit());
            System.out.println("审批意见: " + taskBo.getAuditDesc());
            System.out.println("----------------------------------");
        }
        System.out.println("***************   审批意见结束    *************** ");
    }

    private void printProcessInfo(ProcessInstance processInstance) {
        ProcessDefinition processDefinition = workflowService.getProcessDefinition(processInstance.getProcessDefinitionId());

        System.out.println("流程定义ID: " + processDefinition.getId() + ", 流程定义Key(业务类型): " + processDefinition.getKey() + ", 流程定义名称：" + processDefinition.getName());
        System.out.println("流程实例ID: " + processInstance.getId() + ", 流程实例Key(业务ID): " + processInstance.getBusinessKey());
    }

    private void printProcessInfo(HistoricProcessInstance historicProcessInstance) {
        ProcessDefinition processDefinition = workflowService.getProcessDefinition(historicProcessInstance.getProcessDefinitionId());

        System.out.println("流程定义ID: " + processDefinition.getId() + ", 流程定义Key(业务类型): " + processDefinition.getKey() + ", 流程定义名称：" + processDefinition.getName());
        System.out.println("流程实例ID: " + historicProcessInstance.getId() + ", 流程实例Key(业务ID): " + historicProcessInstance.getBusinessKey());
    }
}
