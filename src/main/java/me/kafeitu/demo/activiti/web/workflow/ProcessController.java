package me.kafeitu.demo.activiti.web.workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import me.kafeitu.demo.activiti.util.Page;
import me.kafeitu.demo.activiti.util.PageUtil;
import me.kafeitu.demo.activiti.util.UserUtil;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.FormService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.identity.User;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * @author kevin
 * @date 2017/6/22
 */
@RestController
@RequestMapping(value = "/workflow/process")
public class ProcessController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    RepositoryService repositoryService;

    @Autowired
    IdentityService identityService;

    @Autowired
    FormService formService;

    @RequestMapping(value = "/list/{currentPage}/{pageSize}")
    public Object processList(@PathVariable Integer currentPage, @PathVariable Integer pageSize) {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = null;

        ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery().orderByDeploymentId().desc();
        List<ProcessDefinition> processDefinitionList = processDefinitionQuery.listPage(PageUtil.getFirstResult(currentPage, pageSize), pageSize);
        for (ProcessDefinition processDefinition : processDefinitionList) {
            map = new HashMap<>();
            map.put("id", processDefinition.getId());
            map.put("deploymentId", processDefinition.getDeploymentId());
            map.put("name", processDefinition.getName());
            map.put("key", processDefinition.getKey());
            map.put("version", processDefinition.getVersion());
            map.put("resourceName", processDefinition.getResourceName());
            map.put("diagramResourceName", processDefinition.getDiagramResourceName());
            map.put("suspended", processDefinition.isSuspended());

            String deploymentId = processDefinition.getDeploymentId();
            Deployment deployment = repositoryService.createDeploymentQuery().deploymentId(deploymentId).singleResult();
            map.put("deploymentTime", deployment.getDeploymentTime());
            result.add(map);
        }

        Page<Map<String, Object>> page = new Page<>();
        page.setTotalCount(processDefinitionQuery.count());
        page.setResult(result);
        return page;
    }

    /**
     * 删除部署的流程，级联删除流程实例
     *
     * @param deploymentId 流程部署ID
     */
    @RequestMapping(value = "/remove")
    public Object remove(@RequestParam("deploymentId") String deploymentId) {
        try {
            repositoryService.deleteDeployment(deploymentId, true);
            return "success";
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return "error";
        }
    }

    /**
     * 挂起、激活流程
     */
    @RequestMapping(value = "/update/{state}/{processDefinitionId}")
    public String updateState(@PathVariable("state") String state, @PathVariable("processDefinitionId") String processDefinitionId) {
        if (state.equals("active")) {
            repositoryService.activateProcessDefinitionById(processDefinitionId, true, null);
            return  "已激活ID为[" + processDefinitionId + "]的流程定义。";
        } else if (state.equals("suspend")) {
            repositoryService.suspendProcessDefinitionById(processDefinitionId, true, null);
            return  "已挂起ID为[" + processDefinitionId + "]的流程定义。";
        }
        return "";
    }

    /**
     * 将流程转换成模型
     */
    @RequestMapping(value = "/convert-to-model/{processDefinitionId}")
    public Object convertToModel(@PathVariable("processDefinitionId") String processDefinitionId)
            throws UnsupportedEncodingException, XMLStreamException {

        try {
            ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                    .processDefinitionId(processDefinitionId).singleResult();
            InputStream bpmnStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(),
                    processDefinition.getResourceName());
            XMLInputFactory xif = XMLInputFactory.newInstance();
            InputStreamReader in = new InputStreamReader(bpmnStream, "UTF-8");
            XMLStreamReader xtr = xif.createXMLStreamReader(in);
            BpmnModel bpmnModel = new BpmnXMLConverter().convertToBpmnModel(xtr);

            BpmnJsonConverter converter = new BpmnJsonConverter();
            com.fasterxml.jackson.databind.node.ObjectNode modelNode = converter.convertToJson(bpmnModel);
            Model modelData = repositoryService.newModel();
            modelData.setKey(processDefinition.getKey());
            modelData.setName(processDefinition.getResourceName());
            modelData.setCategory(processDefinition.getDeploymentId());

            ObjectNode modelObjectNode = new ObjectMapper().createObjectNode();
            modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, processDefinition.getName());
            modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
            modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, processDefinition.getDescription());
            modelData.setMetaInfo(modelObjectNode.toString());

            repositoryService.saveModel(modelData);

            repositoryService.addModelEditorSource(modelData.getId(), modelNode.toString().getBytes("utf-8"));

            return "success";
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return "error";
        }
    }

    /**
     * 读取资源，通过部署ID
     *
     * @param processDefinitionId 流程定义
     * @param resourceType        资源类型(xml|image)
     * @throws Exception
     */
    @RequestMapping(value = "/resource/read")
    public void getProcessResource(@RequestParam("processDefinitionId") String processDefinitionId, @RequestParam("resourceType") String resourceType,
                                 HttpServletResponse response) throws Exception {
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionId(processDefinitionId).singleResult();
        String resourceName = "";
        if (resourceType.equals("image")) {
            resourceName = processDefinition.getDiagramResourceName();
        } else if (resourceType.equals("xml")) {
            resourceName = processDefinition.getResourceName();
        }
        InputStream resourceAsStream = repositoryService.getResourceAsStream(processDefinition.getDeploymentId(), resourceName);
        byte[] b = new byte[1024];
        int len = -1;
        while ((len = resourceAsStream.read(b, 0, 1024)) != -1) {
            response.getOutputStream().write(b, 0, len);
        }
    }

    /**
     * 初始化启动流程，读取启动流程的表单内容来渲染start form
     */
    @RequestMapping(value = "/get-form/start/{processDefinitionId}")
    @ResponseBody
    public Object findStartForm(@PathVariable("processDefinitionId") String processDefinitionId) throws Exception {

        // 根据流程定义ID读取外置表单
        Object startForm = formService.getRenderedStartForm(processDefinitionId);

        return startForm;
    }

    /**
     * 读取启动流程的表单字段
     */
    @RequestMapping(value = "/start-process/{processDefinitionId}")
    public Object submitStartFormAndStartProcessInstance(
            @PathVariable("processDefinitionId") String processDefinitionId, HttpServletRequest request) {

        Map<String, String> result = new HashMap<>();

        Map<String, String> formProperties = new HashMap<String, String>();

        // 从request中读取参数然后转换
        Map<String, String[]> parameterMap = request.getParameterMap();
        Set<Map.Entry<String, String[]>> entrySet = parameterMap.entrySet();
        for (Map.Entry<String, String[]> entry : entrySet) {

            System.out.println("########  key: " + entry.getKey());
            System.out.println("########  value:  " + entry.getValue()[0]);

            formProperties.put(entry.getKey(), entry.getValue()[0]);
        }

        logger.debug("start form parameters: {}", formProperties);

        // User user = UserUtil.getUserFromSession(request.getSession());
        String currentUser = "u_0_张三";
        try {
            identityService.setAuthenticatedUserId(currentUser);

            ProcessInstance processInstance = formService.submitStartFormData(processDefinitionId, formProperties);
            logger.debug("start a processinstance: {}", processInstance);

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
}
