package me.kafeitu.demo.activiti.dao;

import me.kafeitu.demo.activiti.entity.mock.MockRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author kevin
 * @date 2017/6/9
 */
@Repository
public interface MockRoleDao extends JpaRepository<MockRole, String> {

/*    @PersistenceContext
    private EntityManager entityManager;

    public List<MockRole> getMockRoleList() {
        Query query = entityManager.createQuery("from MockRole");
        List<MockRole>  result = query.getResultList();
        return result;
    }*/
}
