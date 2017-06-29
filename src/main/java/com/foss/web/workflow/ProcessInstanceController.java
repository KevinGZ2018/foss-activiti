package com.foss.web.workflow;

import com.foss.util.Page;
import com.foss.util.PageUtil;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/workflow/processinstance")
public class ProcessInstanceController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    RuntimeService runtimeService;

    @Autowired
    HistoryService historyService;

    @Autowired
    TaskService taskService;

    @RequestMapping(value = "/running/list/{currentPage}/{pageSize}")
    public Object runningProcessInstanceList(@PathVariable Integer currentPage, @PathVariable Integer pageSize) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        ProcessInstanceQuery query = runtimeService.createProcessInstanceQuery();
        List<ProcessInstance> list = query.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        for(ProcessInstance processInstance: list) {

            // 设置当前任务信息
            List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstance.getId()).active().orderByTaskCreateTime().desc().listPage(0, 1);
            String currentTaskName = tasks != null && tasks.size() > 0 ? tasks.get(0).getName() : "";

            map = new HashMap<>();
            map.put("id", processInstance.getId());
            map.put("processInstanceId", processInstance.getProcessInstanceId());
            map.put("processDefinitionId", processInstance.getProcessDefinitionId());
            map.put("currentTaskName", currentTaskName);
            map.put("suspended", processInstance.isSuspended());
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setResult(result);
        page.setTotalCount(query.count());
        return page;
    }

    @RequestMapping(value = "/finished/list/{currentPage}/{pageSize}")
    public Object finishedProcessInstanceList(@PathVariable Integer currentPage, @PathVariable Integer pageSize) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map;

        HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery().orderByProcessInstanceEndTime().desc().finished();
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

    @RequestMapping(value = "/update/{state}/{processInstanceId}")
    public String updateState(@PathVariable("state") String state, @PathVariable("processInstanceId") String processInstanceId) {
        if (state.equals("active")) {
            runtimeService.activateProcessInstanceById(processInstanceId);
            return  "已激活ID为[" + processInstanceId + "]的流程实例。";
        } else if (state.equals("suspend")) {
            runtimeService.suspendProcessInstanceById(processInstanceId);
            return  "已挂起ID为[" + processInstanceId + "]的流程实例。";
        }
        return "";
    }











    @RequestMapping(value = "running")
    public ModelAndView running(Model model, HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("/workflow/running-manage");
        Page<ProcessInstance> page = new Page<ProcessInstance>(PageUtil.PAGE_SIZE);
        int[] pageParams = PageUtil.init(page, request);

        ProcessInstanceQuery processInstanceQuery = runtimeService.createProcessInstanceQuery();
        List<ProcessInstance> list = processInstanceQuery.listPage(pageParams[0], pageParams[1]);
        page.setResult(list);
        page.setTotalCount(processInstanceQuery.count());
        mav.addObject("page", page);
        return mav;
    }

    /**
     * 挂起、激活流程实例
     */
/*    @RequestMapping(value = "update/{state}/{processInstanceId}")
    public String updateState(@PathVariable("state") String state, @PathVariable("processInstanceId") String processInstanceId,
                              RedirectAttributes redirectAttributes) {
        if (state.equals("active")) {
            redirectAttributes.addFlashAttribute("message", "已激活ID为[" + processInstanceId + "]的流程实例。");
            runtimeService.activateProcessInstanceById(processInstanceId);
        } else if (state.equals("suspend")) {
            runtimeService.suspendProcessInstanceById(processInstanceId);
            redirectAttributes.addFlashAttribute("message", "已挂起ID为[" + processInstanceId + "]的流程实例。");
        }
        return "redirect:/workflow/processinstance/running";
    }*/
}
