package me.kafeitu.demo.activiti.listener;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;

import java.util.Date;

/**
 * @author kevin
 * @date 2017/6/14
 */
public class ServiceTask implements JavaDelegate {

    //流程变量
    private Expression text1;

    @Override
    public void execute(DelegateExecution execution) throws Exception {

        System.out.println("serviceTask已经执行已经执行！");

        String value1 = (String) text1.getValue(execution);

        System.out.println(value1);

        execution.setVariable("result", "最终审批结果：" + new StringBuffer(value1) +  "，时间：" + new Date());
    }
}
