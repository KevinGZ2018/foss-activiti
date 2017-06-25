package me.kafeitu.demo.activiti.service;

import jodd.datetime.JDateTime;
import me.kafeitu.demo.activiti.entity.mock.TaskBo;
import me.kafeitu.demo.activiti.entity.oa.Leave;
import me.kafeitu.demo.activiti.service.oa.leave.LeaveManager;
import me.kafeitu.demo.activiti.service.oa.leave.LeaveWorkflowService;
import org.activiti.engine.*;
import org.activiti.engine.history.*;
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

import java.util.*;

/**
 * @author kevin
 * @date 2017/6/13
 */
@Component
public class WorkflowService {

    private static Logger logger = LoggerFactory.getLogger(LeaveWorkflowService.class);

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

        ProcessInstance processInstance = null;
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
            List<TaskBo> taskBoList = getApproveHistory(processInstanceId);

            System.out.println("***************   上游审批意见开始    *************** ");
            for(TaskBo taskBo: taskBoList) {
                System.out.println("----------------------------------");
                System.out.println("审批人: " + taskBo.getApproveUserName());
                System.out.println("审批开始时间: " + taskBo.getStartTime());
                System.out.println("审批结束时间: " + taskBo.getEndTime());
                System.out.println("是否审批通过: " + taskBo.isPassed());
                System.out.println("审批意见: " + taskBo.getDesc());
                System.out.println("----------------------------------");
            }
            System.out.println("***************   上游审批意见结束    *************** ");
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

    private void printProcessInfo(ProcessInstance processInstance) {
        ProcessDefinition processDefinition = getProcessDefinition(processInstance.getProcessDefinitionId());

        System.out.println("流程定义ID: " + processDefinition.getId() + ", 流程定义Key(业务类型): " + processDefinition.getKey() + ", 流程定义名称：" + processDefinition.getName());
        System.out.println("流程实例ID: " + processInstance.getId() + ", 流程实例Key(业务ID): " + processInstance.getBusinessKey());
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

            ProcessDefinition processDefinition = getProcessDefinition(historicProcessInstance.getProcessDefinitionId());

            List<TaskBo> taskBoList= getApproveHistory(historicProcessInstance.getId());

            System.out.println("流程定义ID: " + processDefinition.getId() + ", 流程定义Key(业务类型): " + processDefinition.getKey() + ", 流程定义名称：" + processDefinition.getName());
            System.out.println("流程实例ID: " + historicProcessInstance.getId() + ", 流程实例Key(业务ID): " + historicProcessInstance.getBusinessKey());
            System.out.println("***************   审批意见开始    *************** ");
            for(TaskBo taskBo: taskBoList) {
                System.out.println("----------------------------------");
                System.out.println("审批人: " + taskBo.getApproveUserName());
                System.out.println("审批开始时间: " + taskBo.getStartTime());
                System.out.println("审批结束时间: " + taskBo.getEndTime());
                System.out.println("是否审批通过: " + taskBo.isPassed());
                System.out.println("审批意见: " + taskBo.getDesc());
                System.out.println("----------------------------------");
            }
            System.out.println("***************   审批意见结束    *************** ");
            System.out.println("");
            System.out.println("");
            System.out.println("");
        }
        return list;
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
                continue;
            }

            TaskBo taskBo = new TaskBo();

            String taskId = activityInstance.getTaskId();

            String pass_key = taskId.concat("_passed");
            String desc_key = taskId.concat("_desc");

            HistoricVariableInstance passed = historyService
                    .createHistoricVariableInstanceQuery()
                    .variableName(pass_key).singleResult();

            HistoricVariableInstance desc = historyService
                    .createHistoricVariableInstanceQuery()
                    .variableName(desc_key).singleResult();

            taskBo.setPassed(passed != null && passed.getValue() != null ? (Boolean) passed.getValue() : null);
            taskBo.setDesc(desc != null && desc.getValue() != null ? (String) desc.getValue() : null);

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

        List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery().processInstanceId(hisProcessInstance.getId()).list();
        //System.out.println("###################");
        for(HistoricVariableInstance hv: list) {
            //System.out.println(hv.getVariableName() + ": " + hv.getValue());
        }
        //System.out.println("###################");

        return taskBoList;
    }

    public void deleteFinishedProcessInstaces() {
        HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().finished().orderByProcessInstanceEndTime().desc();
        List<HistoricProcessInstance> list = query.listPage(0, 20);

        System.out.println("删除前：" + list.size());

        for (HistoricProcessInstance historicProcessInstance : list) {
            historyService.deleteHistoricProcessInstance(historicProcessInstance.getId());
        }
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
