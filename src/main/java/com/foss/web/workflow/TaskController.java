package com.foss.web.workflow;

import com.foss.entity.workflow.FormBo;
import com.foss.entity.workflow.TaskBo;
import com.foss.service.WorkflowService;
import com.foss.util.Page;
import com.foss.util.PageUtil;
import jodd.util.StringUtil;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * @author kevin
 * @date 2017/6/27
 */
@RestController
@RequestMapping(value = "/workflow/task")
public class TaskController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    IdentityService identityService;

    @Autowired
    FormService formService;

    @Autowired
    TaskService taskService;

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    WorkflowService workflowService;

    @Autowired
    HistoryService historyService;

    /**
     * 活动流程列表
     */
    @RequestMapping(value = "/process/list/{currentPage}/{pageSize}")
    public Object processList(@PathVariable Integer currentPage, @PathVariable Integer pageSize) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery().active().orderByDeploymentId().desc();
        List<ProcessDefinition> processDefinitionList = processDefinitionQuery.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        for (ProcessDefinition processDefinition : processDefinitionList) {
            map = new HashMap<>();
            map.put("id", processDefinition.getId());
            map.put("deploymentId", processDefinition.getDeploymentId());
            map.put("name", processDefinition.getName());
            map.put("key", processDefinition.getKey());
            map.put("version", processDefinition.getVersion());
            map.put("suspended", processDefinition.isSuspended());
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setTotalCount(processDefinitionQuery.count());
        page.setResult(result);
        return page;
    }

    /**
     * 读取启动流程的表单字段
     */
    @RequestMapping(value = "/start-processinstance/{processDefinitionId}")
    public Object submitStartFormAndStartProcessInstance(
            @PathVariable("processDefinitionId") String processDefinitionId, HttpServletRequest request) {

        Map<String, String> result = new HashMap<>();

        Map<String, String> formProperties = new HashMap<String, String>();
        Map<String, String[]> parameterMap = request.getParameterMap();
        Set<Map.Entry<String, String[]>> entrySet = parameterMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {
            String key = entry.getKey();
            String value = entry.getValue()[0];
            formProperties.put(key, value);
        }

        try {
            identityService.setAuthenticatedUserId(getCurrentUser(request));

            ProcessInstance processInstance = formService.submitStartFormData(processDefinitionId, formProperties);

            result.put("state", "success");
            result.put("msg", "启动成功，流程ID：" + processInstance.getId());
        }
        catch (Exception e) {
            result.put("state", "error");
            result.put("msg", "启动失败");
        } finally {
            identityService.setAuthenticatedUserId(null);
        }

        return result;
    }

    @RequestMapping(value = "/todo-task/list/{currentPage}/{pageSize}")
    public Object todoTaskList(@PathVariable Integer currentPage, @PathVariable Integer pageSize, HttpServletRequest request) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        // 根据当前人的ID查询
        //TaskQuery taskQuery = taskService.createTaskQuery().taskCandidateOrAssigned(getCurrentUser(request)).orderByTaskCreateTime().desc();
        //TaskQuery groupTaskQuery = taskService.createTaskQuery().taskCandidateGroup(userIdOrGroupId);
        //List<Task> taskList = taskQuery.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        //taskList.addAll(groupTaskQuery.list());

        Page<Task> todoTaskPage = workflowService.getTodoTaskPage(getCurrentUser(request), getCurrentGroup(request), currentPage, pageSize);

        for (Task task : todoTaskPage.getResult()) {

            ProcessDefinition processDefinition = workflowService.getProcessDefinition(task.getProcessDefinitionId());

            map = new HashMap<>();
            map.put("id", task.getId());
            map.put("taskDefinitionKey", task.getTaskDefinitionKey());
            map.put("name", task.getName());
            map.put("processDefinitionId", task.getProcessDefinitionId());
            map.put("processDefinitionName", processDefinition.getName());
            map.put("processInstanceId", task.getProcessInstanceId());
            map.put("priority", task.getPriority());
            map.put("createTime", task.getCreateTime());
            map.put("dueDate", task.getDueDate());
            map.put("description", task.getDescription());
            map.put("owner", task.getOwner());
            map.put("assignee", task.getAssignee());
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setTotalCount(todoTaskPage.getTotalCount());
        page.setResult(result);
        return page;
    }

    /**
     * 签收任务
     */
    @RequestMapping(value = "/claim-task/{taskId}")
    public Object claimTask(@PathVariable("taskId") String taskId, HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();
        try {
            taskService.claim(taskId, getCurrentUser(request));
            result.put("state", "success");
            result.put("msg", "签收成功");
        } catch (Exception e) {
            result.put("state", "error");
            result.put("msg", "任务签收失败");
        }
        return result;
    }

    /**
     * 办理任务，提交task的并保存form
     */
    @RequestMapping(value = "/complete-task/{taskId}")
    public Object completeTask(@PathVariable("taskId") String taskId, HttpServletRequest request) {

        Map<String, String> result = new HashMap<>();

        // 从request中读取参数然后转换
        String _isAudit = request.getParameter("_isAudit");
        String _auditDesc = request.getParameter("_auditDesc");

        Map<String, String> formProperties = new HashMap<String, String>();
        formProperties.put(taskId.concat("_isAudit"), _isAudit);
        formProperties.put(taskId.concat("_auditDesc"), _auditDesc);

        try {
            identityService.setAuthenticatedUserId(getCurrentUser(request));
            formService.submitTaskFormData(taskId, formProperties);

            result.put("state", "success");
            result.put("msg", "任务完成，任务ID：" + taskId);
        }
        catch (Exception e) {
            result.put("state", "error");
            result.put("msg", "审批失败");
        }
        finally {
            identityService.setAuthenticatedUserId(null);
        }

        return result;
    }

    /**
     * 运行中的流程实例
     */
    @RequestMapping(value = "/running-process/list/{currentPage}/{pageSize}")
    public Object runningProcessList(@PathVariable Integer currentPage, @PathVariable Integer pageSize, HttpServletRequest request) {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        HistoricProcessInstanceQuery query = historyService
                .createHistoricProcessInstanceQuery()
                .involvedUser(getCurrentUser(request))
                .orderByProcessInstanceStartTime()
                .desc()
                .unfinished();
        List<HistoricProcessInstance> list = query.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        for(HistoricProcessInstance historicProcessInstance: list) {

            // 设置当前任务信息
            List<Task> tasks = taskService.createTaskQuery().processInstanceId(historicProcessInstance.getId()).active().orderByTaskCreateTime().desc().listPage(0, 1);
            String currentTaskName = tasks != null && tasks.size() > 0 ? tasks.get(0).getName() : "";

            map = new HashMap<>();
            map.put("id", historicProcessInstance.getId());
            map.put("processDefinitionId", historicProcessInstance.getProcessDefinitionId());
            map.put("currentTaskName", currentTaskName);
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setResult(result);
        page.setTotalCount(query.count());
        return page;
    }

    /**
     * 已结束的流程实例
     */
    @RequestMapping(value = "/history-process/list/{currentPage}/{pageSize}")
    public Object finishedProcessList(@PathVariable Integer currentPage, @PathVariable Integer pageSize, HttpServletRequest request) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        HistoricProcessInstanceQuery query = historyService
                .createHistoricProcessInstanceQuery()
                .involvedUser(getCurrentUser(request))
                .orderByProcessInstanceEndTime()
                .desc()
                .finished();
        List<HistoricProcessInstance> list = query.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        for(HistoricProcessInstance historicProcessInstance: list) {

            map = new HashMap<>();
            map.put("id", historicProcessInstance.getId());
            map.put("processDefinitionId", historicProcessInstance.getProcessDefinitionId());
            map.put("startTime", historicProcessInstance.getStartTime());
            map.put("endTime", historicProcessInstance.getEndTime());
            map.put("completedReason", historicProcessInstance.getDeleteReason());
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setResult(result);
        page.setTotalCount(query.count());
        return page;
    }

    /**
     * 初始化启动流程，读取启动流程的表单内容来渲染start form
     */
    @RequestMapping(value = "/get-form/start/{processDefinitionId}")
    public Object findStartForm(@PathVariable("processDefinitionId") String processDefinitionId) throws Exception {
        // 根据流程定义ID读取外置表单
        Object startForm = formService.getRenderedStartForm(processDefinitionId);
        return startForm;
    }

    /**
     * 读取任务表单
     */
    @RequestMapping(value = "/get-form/task/{taskId}")
    public Object findTaskForm(@PathVariable("taskId") String taskId) throws Exception {

        Map<String, Object> result = new HashMap<>();

        Object taskForm = formService.getRenderedTaskForm(taskId);

        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();

        Object startForm = formService.getRenderedStartForm(task.getProcessDefinitionId());
        List<FormBo> startFormBos = parseFormHtml(String.valueOf(startForm));
        for (FormBo formBo: startFormBos) {
            HistoricVariableInstance historicVariableInstance = historyService
                    .createHistoricVariableInstanceQuery()
                    .processInstanceId(task.getProcessInstanceId())
                    .variableName(formBo.getName()).singleResult();
            if(historicVariableInstance != null) {
                formBo.setValue(historicVariableInstance.getValue());
            }
        }

        //获取流程变量
        //Map<String, Object> startFormProperties = taskService.getVariables(taskId);

        // 查看上游的审批记录
        List<TaskBo> taskBos = workflowService.getApproveHistory(task.getProcessInstanceId());

        result.put("taskForm", taskForm);
        result.put("taskBos", taskBos);
        result.put("startFormBos", startFormBos);
        //result.put("startForm", startFormProperties);
        return result;
    }

    /**
     * 读取历史任务的表单
     */
    @RequestMapping(value = "/get-form/history-task/{processInstanceId}")
    public Object findHistoryTaskForm(@PathVariable("processInstanceId") String processInstanceId) throws Exception {

        Map<String, Object> result = new HashMap<>();

        List<TaskBo> taskBos = workflowService.getApproveHistory(processInstanceId);

        HistoricProcessInstance hisProcessInstance = historyService
                .createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();

        Object startForm = formService.getRenderedStartForm(hisProcessInstance.getProcessDefinitionId());
        List<FormBo> startFormBos = parseFormHtml(String.valueOf(startForm));
        for (FormBo formBo: startFormBos) {
            HistoricVariableInstance historicVariableInstance = historyService
                    .createHistoricVariableInstanceQuery()
                    .processInstanceId(processInstanceId)
                    .variableName(formBo.getName()).singleResult();
            formBo.setValue(historicVariableInstance.getValue());
        }

/*        List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery().processInstanceId(processInstanceId).list();

        for (HistoricVariableInstance variable : list) {
            System.out.println("variable: " + variable.getVariableName() + " = " + variable.getValue());
        }*/

/*        List<HistoricDetail> formProperties = historyService.createHistoricDetailQuery().processInstanceId(processInstanceId).formProperties().list();
        for (HistoricDetail historicDetail : formProperties) {
            HistoricFormProperty field = (HistoricFormProperty) historicDetail;
            System.out.println("field id: " + field.getPropertyId() + ", value: " + field.getPropertyValue());
        }*/

        result.put("taskBos", taskBos);
        result.put("startFormBos", startFormBos);
        return result;
    }

    private List<FormBo> parseFormHtml(String html) {
        if(StringUtil.isNotBlank(html)) {
            List<FormBo> formBos = new ArrayList<>();
            formBos.add(new FormBo("applyUserId", "申请人"));

            Document doc = Jsoup.parse(html);
            Elements elements = doc.select("Form-item");
            for(Element e: elements) {
                String paramLabel = e.attr("label");
                Element childElement = e.children().get(0);
                String vModelTag = childElement.attr("v-model");
                String paramName = vModelTag.replaceAll("model.", "");

                formBos.add(new FormBo(paramName, paramLabel));
            }
            return formBos;
        }
        return null;
    }

    private String getCurrentGroup(HttpServletRequest request) {
        return request.getParameter("currentGroup");
    }

    private String getCurrentUser(HttpServletRequest request) {
        //User user = UserUtil.getUserFromSession(request.getSession());
        return request.getParameter("currentUser");
    }
}
