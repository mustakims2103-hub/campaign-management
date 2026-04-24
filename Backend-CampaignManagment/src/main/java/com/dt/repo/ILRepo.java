package com.dt.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dt.entity.AddCampaignForm;

@Repository
public interface ILRepo extends JpaRepository<AddCampaignForm, Integer>, JpaSpecificationExecutor<AddCampaignForm> {

	
	@Query("SELECT c.status, COUNT(c) FROM AddCampaignForm c GROUP BY c.status")
    List<Object[]> countCampaignsByStatus();
	

}
