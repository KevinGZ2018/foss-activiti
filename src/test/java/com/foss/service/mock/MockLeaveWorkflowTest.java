package com.foss.service.mock;

import com.foss.entity.oa.Leave;
import com.foss.service.oa.leave.LeaveManager;
import com.foss.modules.test.spring.SpringTransactionalTestCase;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertNotNull;

/**
 * @author kevin
 * @date 2017/6/12
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
@Transactional(readOnly = false)
//显式指定不回滚
//@Rollback(false)  // 4.2的写法
@TransactionConfiguration(defaultRollback = false)
public class MockLeaveWorkflowTest extends SpringTransactionalTestCase {

    @Autowired
    private WorkflowTestService workflowService;

    @Autowired
    protected RuntimeService runtimeService;

    @Autowired
    protected TaskService taskService;

    @Autowired
    protected HistoryService historyService;

    @Autowired
    protected LeaveManager leaveManager;

    private  String PROCESS_DEFINITION_KEY = "MockLeave";

    @Test
    public void clear() {
        workflowService.deleteFinishedProcessInstaces();
    }

    @Test
    public void testFullWorkflowProcess() {

        // 发起流程
        testStart();
        System.out.println("");

        // 查看当前流程节点
        //testFindRunningProcessInstaces();
        System.out.println("");

        // 主管查看待办事项
        testSupervisorShowTodoTasks();
        System.out.println("");
        // 主管办理
        testSupervisorComplete();
        System.out.println("");
        // 主管再次查看待办事项
        testSupervisorShowTodoTasks();
        System.out.println("");

        // 查看当前流程节点
        //testFindRunningProcessInstaces();
        System.out.println("");

        // 总监查看待办事项
        testDirectorShowTodoTasks();
        System.out.println("");
        // 总监办理
        testDirectorComplete();
        System.out.println("");
        // 总监再次查看待办事项
        testDirectorShowTodoTasks();
        System.out.println("");

        // 查看当前流程节点
        //testFindRunningProcessInstaces();
        System.out.println("");

        // 经理查看待办事项
        testManagerShowTodoTasks();
        System.out.println("");
        // 经理办理
        testManagerComplete();
        System.out.println("");
        // 经理再次查看待办事项
        testManagerShowTodoTasks();
        System.out.println("");

        // 验证流程是否结束
        testFinished();
        System.out.println("");

        // 查看历史流程
        //testFindFinishedProcessInstaces();
    }

    @Test
    public void testStart() {

        System.out.println("准备走申请假期流程...");

        String currentUser = "u_1_张三";

        Leave leave = new Leave();
        leave.setUserId(currentUser);
        leave.setApplyTime(new Date());
        leave.setStartTime(new jodd.datetime.JDateTime("2017-06-22 12:00").convertToDate());
        leave.setEndTime(new jodd.datetime.JDateTime("2017-06-23 09:00").convertToDate());
        leave.setLeaveType("事假");
        leave.setReason("家里有事");
        leaveManager.saveLeave(leave);

        // 启动流程
        Map<String, Object> variables = new HashMap<String, Object>();
        ProcessInstance startProcessInstance =
                workflowService.startWorkflow(PROCESS_DEFINITION_KEY,
                        leave.getId().toString(), leave.getUserId(), variables);

        // 将流程和业务实体关联起来
        leave.setProcessInstanceId(startProcessInstance.getId());
        leaveManager.saveLeave(leave);

        // 验证
        assertNotNull(leave.getProcessInstanceId());

        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processDefinitionKey(PROCESS_DEFINITION_KEY)
                .processInstanceBusinessKey(leave.getId().toString())
                .singleResult();
        assertNotNull(processInstance);

        System.out.println("已经发起申请假期流程...");
    }

    @Test
    public void testSupervisorShowTodoTasks() {

        System.out.println("主管查看待办事项...");

        String currentUser = "u_2_李四";
        workflowService.findTodoTasks(currentUser);
    }

    @Test
    public void testDirectorShowTodoTasks() {

        System.out.println("总监查看待办事项...");

        String currentRole = "r_3_总监_Director";
        workflowService.findTodoTasks(currentRole);
    }

    @Test
    public void testManagerShowTodoTasks() {

        System.out.println("经理查看待办事项...");

        String currentRole = "r_4_经理_Manager";
        workflowService.findTodoTasks(currentRole);
    }

    @Test
    public void testSupervisorComplete() {

        System.out.println("主管处理流程...");

        String user = "u_2_李四";
        boolean isAudit = true;
        String auditDesc = "主管同意";

        handle(user, isAudit, auditDesc);
    }

    @Test
    public void testDirectorComplete() {

        System.out.println("总监处理流程...");

        String claimUser = "u_4_马六";
        String role = "r_3_总监_Director";
        boolean isAudit = true;
        String auditDesc = "总监同意";

        handle(role, claimUser, isAudit, auditDesc);
    }

    @Test
    public void testManagerComplete() {

        System.out.println("经理处理流程...");

        String claimUser = "u_6_丁八";
        String role = "r_4_经理_Manager";
        boolean isAudit = true;
        String auditDesc = "经理同意";

        handle(role, claimUser, isAudit, auditDesc);
    }

    @Test
    public void testFinished() {

        System.out.println("查看流程是否结束...");

        // 验证已结束流程
        long count = historyService.createHistoricProcessInstanceQuery().processDefinitionKey(PROCESS_DEFINITION_KEY).finished().count();
        // assertEquals(6, count);

        System.out.println("已经有 " + count + "条 流程结束...");
    }

    @Test
    public void testFindRunningProcessInstaces() {

        System.out.println("++++++++++++++++++++++++++++++++");
        System.out.println("查看正前运行中的流程...");

        workflowService.findRunningProcessInstaces(0, 20);

        System.out.println("++++++++++++++++++++++++++++++++");
    }

    @Test
    public void testFindFinishedProcessInstaces() {

        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        System.out.println("查看已完成的流程...");

        workflowService.findFinishedProcessInstaces(0, 20);
    }

    private void handle(String user, boolean isAudit, String auditDesc) {
       // Task task = taskService.createTaskQuery().taskCandidateOrAssigned(user).singleResult();
        List<Task> list = taskService.createTaskQuery().taskCandidateOrAssigned(user).list();
        for(Task task : list) {
            String taskId = task.getId();
            String pass_key = taskId.concat("_passed");
            String desc_key = taskId.concat("_desc");
            taskService.setVariable(taskId, pass_key, isAudit);
            taskService.setVariable(taskId, desc_key, auditDesc);

            taskService.complete(task.getId());
        }
    }

    private void handle(String group, String claimUser, boolean isAudit, String auditDesc) {
        //Task task = taskService.createTaskQuery().taskCandidateGroup(group).singleResult();

        List<Task> list = taskService.createTaskQuery().taskCandidateGroup(group).list();
        for(Task task : list) {
            String taskId = task.getId();
            String pass_key = taskId.concat("_passed");
            String desc_key = taskId.concat("_desc");
            taskService.setVariable(taskId, pass_key, isAudit);
            taskService.setVariable(taskId, desc_key, auditDesc);

            // 任务认领，将公有任务转成私有任务
            taskService.claim(taskId, claimUser);

            taskService.complete(task.getId());
        }

    }
}
