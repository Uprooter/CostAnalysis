package de.mischa.repository;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;
import java.time.LocalDate;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@DataJpaTest
public class CostItemRepositoryTests
{

   @Autowired
   private TestEntityManager entityManager;

   @Autowired
   private CostItemRepository repository;

   @Test
   public void testExample()
   {
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 9, 1), -120.0, CostOwner.GESA, CostType.FLEXIBEL));
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 10, 1), -120.0, CostOwner.GESA, CostType.FLEXIBEL));
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 10, 2), -120.0, CostOwner.GESA, CostType.FLEXIBEL));
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 10, 3), -120.0, CostOwner.GESA, CostType.FLEXIBEL));
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 11, 1), -120.0, CostOwner.GESA, CostType.FLEXIBEL));
      this.entityManager
            .persist(this.createCostItem(LocalDate.of(2018, 12, 1), -120.0, CostOwner.GESA, CostType.FLEXIBEL));

      List<CostItem> items = this.repository.findRelevant(LocalDate.of(2018, 10, 1),
            LocalDate.of(2018, 11, 1));
      assertThat(items.size()).isEqualTo(4);
   }

   private CostItem createCostItem(LocalDate localDate, double amount, CostOwner owner, CostType type)
   {
      CostItem item = new CostItem();
      item.setCreationDate(localDate);
      item.setAmount(amount);
      item.setOwner(owner);
      item.setType(type);
      return item;
   }

}
