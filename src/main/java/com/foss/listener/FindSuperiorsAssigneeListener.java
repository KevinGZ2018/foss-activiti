package com.foss.listener;

import com.foss.service.mock.MockUserService;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.impl.identity.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author kevin
 * @date 2017/6/14
 */
@Component
public class FindSuperiorsAssigneeListener implements TaskListener {

    @Autowired
    private MockUserService mockUserService;

    @Override
    public void notify(DelegateTask task) {

/*        Page<MockUser> userList = mockUserService.getMockUserPage(1, 20);
        for(MockUser u : userList.getContent()) {
            System.out.println("@@@@@@@@@@@    " + u.toString());
        }*/

        // 通过发起流程identityService.setAuthenticatedUserId()设置
        String applyUser = Authentication.getAuthenticatedUserId();

        // 任务委托人指派
        task.setAssignee(getCurrentAssignee(applyUser));
    }

    private String getCurrentAssignee(String applyUser) {
        String currentAssignee = "u_2_李四";

        System.out.println("=====================");
        System.out.println("流程已经找到发起人【"+applyUser+"】的直属上级领导【" + currentAssignee + "】" );

        return currentAssignee;
    }
}
