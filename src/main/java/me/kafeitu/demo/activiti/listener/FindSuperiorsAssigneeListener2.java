package me.kafeitu.demo.activiti.listener;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.impl.identity.Authentication;
import org.springframework.stereotype.Component;

/**
 * @author kevin
 * @date 2017/6/14
 */
@Component
public class FindSuperiorsAssigneeListener2 implements TaskListener {

    @Override
    public void notify(DelegateTask task) {

        String applyUser = Authentication.getAuthenticatedUserId();

        System.out.println("=====================");
        System.out.println("流程已经找到发起人【"+applyUser+"】的间接领导");
    }
}
