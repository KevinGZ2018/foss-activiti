package me.kafeitu.demo.activiti.service.mock;

import me.kafeitu.demo.activiti.service.WorkflowService;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;
import org.activiti.engine.FormService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertNotNull;

/**
 * @author kevin
 * @date 2017/6/14
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
@Transactional(readOnly = false)
//显式指定不回滚
//@Rollback(false)  // 4.2的写法
@TransactionConfiguration(defaultRollback = false)
public class MockLeaveVoteWorkflowTest extends SpringTransactionalTestCase {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    protected RuntimeService runtimeService;

    @Autowired
    protected FormService formService;

    @Autowired
    protected TaskService taskService;

    private  String PROCESS_DEFINITION_KEY = "leaveVote";

    private String PROCESS_DEFINITION_ID = "leaveVote:1:210016";

    final String ALL_KEY = "countersignSize";
    final String YES_KEY = "countersignYes";
    final String NO_KEY = "countersignNo";

    @Test
    public void clear() {
        workflowService.deleteFinishedProcessInstaces();
    }

    @Test
    public void testPass() {
        testStart();

        showTodoTasks("u_2_李四");
        handle("u_2_李四", true, "李四主管同意");

        showTodoTasks("u_3_王五");
        handle("u_3_王五", true, "王五主管同意");
    }

    @Test
    public void testRefuse() {
        testStart();

        showTodoTasks("u_2_李四");
        handle("u_2_李四", true, "李四主管同意");

        showTodoTasks("u_3_王五");
        handle("u_3_王五", false, "王五主管不同意");
    }

    @Test
    public void testStart() {

        System.out.println("准备走申请假期流程...");

        String currentUser = "u_1_张三";

        //Map<String, String> properties = new HashMap<>();
        //properties.put("startDate", "06-14-2017 14:00");
        //properties.put("endDate", "06-15-2017 18:00");
        //properties.put("reason", "身体不适，申请病假，请领导批准！！");

        // 用来设置启动流程的人员ID，引擎会自动把用户ID保存到activiti:initiator中
        //identityService.setAuthenticatedUserId(currentUser);
        //formService.submitStartFormData(PROCESS_DEFINITION_ID, properties);

        List<String> countersignUsers = new ArrayList<>();
        countersignUsers.add("u_2_李四");
        countersignUsers.add("u_3_王五");
        Map<String, Object> variables = new HashMap<>();
        variables.put("countersignUsers", countersignUsers);
        variables.put("startDate", "06-14-2017 14:00");
        variables.put("endDate", "06-15-2017 18:00");
        variables.put("reason", "连夜加班累倒，特申请休假，请领导批准！！");
        variables.put(ALL_KEY, countersignUsers.size());
        variables.put(YES_KEY, 0);
        variables.put(NO_KEY, 0);

        workflowService.startWorkflow(PROCESS_DEFINITION_KEY, "123456", currentUser, variables);

        // 验证
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processDefinitionId(PROCESS_DEFINITION_ID)
                .singleResult();
        assertNotNull(processInstance);

        System.out.println("已经发起申请假期流程...");

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

    private void showTodoTasks(String currentUser) {
        System.out.println("【" + currentUser + "】主管查看待办事项...");
        workflowService.findTodoTasks(currentUser);
    }

    private void handle(String user, boolean isAudit, String auditDesc) {

        System.out.println("【" + user + "】主管处理流程...");

        Task task = taskService.createTaskQuery().taskCandidateOrAssigned(user).singleResult();
        String taskId = task.getId();

        String pass_key = taskId.concat("_passed");
        String desc_key = taskId.concat("_desc");
        taskService.setVariable(taskId, pass_key, isAudit);
        taskService.setVariable(taskId, desc_key, auditDesc);

        setVariable(task.getProcessInstanceId(), isAudit, auditDesc);

        //formService.submitTaskFormData(taskId, properties);
        taskService.complete(taskId);
    }

    private void setVariable(String executionId, boolean isPass, String auditDesc){

        //取出流程实例中存储的自定义变量值
        Object countersignYes = runtimeService.getVariable(executionId, YES_KEY);
        Object countersignNo = runtimeService.getVariable(executionId, NO_KEY);
        int _countersignYes = countersignYes==null ? 0: Integer.parseInt(countersignYes.toString());
        int _countersignNo = countersignNo==null ? 0 : Integer.parseInt(countersignNo.toString());

        //设置新值
        _countersignYes = isPass ? (_countersignYes + 1) : _countersignYes;
        _countersignNo = isPass ? (_countersignNo) : (_countersignNo + 1);
        System.out.println("_countersignYes:" + (_countersignYes) +", _countersignNo:"+(_countersignNo));

        runtimeService.setVariable(executionId, YES_KEY, _countersignYes);
        runtimeService.setVariable(executionId, NO_KEY, _countersignNo);
    }
}
