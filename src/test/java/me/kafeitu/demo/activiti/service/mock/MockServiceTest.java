package me.kafeitu.demo.activiti.service.mock;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.Expressions;
import me.kafeitu.demo.activiti.entity.mock.MockRole;
import me.kafeitu.demo.activiti.entity.mock.MockUser;
import me.kafeitu.demo.activiti.entity.mock.QMockUser;
import me.kafeitu.modules.test.spring.SpringTransactionalTestCase;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ContextConfiguration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

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

}
