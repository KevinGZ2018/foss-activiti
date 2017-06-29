package com.foss.service.mock;

import com.foss.entity.mock.MockRole;
import com.foss.entity.mock.MockUser;
import com.foss.modules.test.spring.SpringTransactionalTestCase;
import org.activiti.engine.FormService;
import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ContextConfiguration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * @author kevin
 * @date 2017/6/9
 */
@ContextConfiguration(locations = { "/applicationContext-test.xml" })
public class MockServiceTest extends SpringTransactionalTestCase {

    @Autowired
    private MockUserService mockUserService;
    @Autowired
    private MockRoleService mockRoleService;
    @Autowired
    private WorkflowTestService workflowService;
    @Autowired
    private HistoryService historyService;
    @Autowired
    private FormService formService;
    @Autowired
    private TaskService taskService;

    @PersistenceContext
    private EntityManager em;

    @Test
    public void testGetMockUserPage() {
        Page<MockUser> mockUserPage = mockUserService.getMockUserPage(null, null);
        for(MockUser mockUser: mockUserPage.getContent()) {
            System.out.println(mockUser.toString());
        }
    }

    @Test
    public void testGetMockRolePage() {
        Page<MockRole> mockRolePage = mockRoleService.getMockRolePage(null, null);
        for(MockRole mockRole: mockRolePage.getContent()) {
            System.out.println(mockRole.toString());
        }
    }

    @Test
    public void test() {
        String currentUser = "u_4_马六";
        String currentGroup = "";
        //String currentUser = "u_6_丁八";
        //String currentGroup = "r_4_经理_Manager";
        com.foss.util.Page<Task> tasks = workflowService.getTodoTaskPage(currentUser, currentGroup, 1, 10);
        for(Task task: tasks.getResult()) {
            System.out.println("############   " + task.getName() + "   " + task.getCreateTime());
        }
    }

    @Test
    public void test2() {
/*        String processInstanceId = "437507";
        HistoricProcessInstanceQuery query = historyService
                .createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId);

        HistoricProcessInstance historicProcessInstance = query.singleResult();

        List<HistoricTaskInstance> list = historyService // 历史任务Service
                .createHistoricTaskInstanceQuery()       // 创建历史任务实例查询
                .processInstanceId(processInstanceId)
                .finished() // 查询已经完成的任务
                .orderByTaskCreateTime()
                .desc()
                .list();

        HistoricTaskInstance task = list.get(0);
        String taskId = task.getId();*/

        //Object taskForm = formService.getRenderedTaskForm(taskId);

        //System.out.println("++++++++  " + taskForm);

        //获取流程变量
/*        Map<String, Object> startFormProperties = historyService
                taskService.getVariables(taskId);
        for(String key: startFormProperties.keySet()) {
            System.out.println(" key: " + key);
            System.out.println(" value: " + startFormProperties.get(key));
        }*/

        // 查看上游的审批记录
/*        List<TaskBo> taskBos = workflowService.getApproveHistory(task.getProcessInstanceId());
        for(TaskBo key: taskBos) {
            System.out.println(" getTaskName: " + key.getTaskName());
        }*/

        Object startForm = formService.getRenderedStartForm("MockLeave:1:437506");
        //System.out.println(startForm);

        Document doc = Jsoup.parse(startForm.toString());
        Elements elements = doc.select("Form-item");
        for(Element e: elements) {
            System.out.println(e.attr("label"));
            Element childElement = e.children().get(0);
            String vModelTag = childElement.attr("v-model");
            String paramName = vModelTag.replaceAll("model.", "");
            System.out.println(paramName);
        }
    }

}
