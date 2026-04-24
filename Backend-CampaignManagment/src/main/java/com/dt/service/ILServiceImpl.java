package com.dt.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dt.entity.AddCampaignForm;
import com.dt.entity.Assignee;
import com.dt.entity.CampaignFilterRequest;
import com.dt.entity.StatusCountDTO;
import com.dt.entity.Users;
import com.dt.payloads.AddCampaignDTO;
import com.dt.payloads.AssigneeDTO;
import com.dt.payloads.UsersDTO;
import com.dt.repo.AssigneeRepo;
import com.dt.repo.ILRepo;
import com.dt.repo.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ILServiceImpl implements ILService {

	 
	@Autowired
	private ILRepo repo;
	
	@Autowired
	private AssigneeRepo assRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ModelMapper mapper;
	
	
//	@Autowired
//    private BCryptPasswordEncoder passwordEncoder;
	
	private final PasswordEncoder passwordEncoder;

	public ILServiceImpl(PasswordEncoder passwordEncoder) {
	    this.passwordEncoder = passwordEncoder;
	}
    
	
	public List<StatusCountDTO> getStatusCounts() {
        List<Object[]> results = repo.countCampaignsByStatus();

        return results.stream()
            .map(obj -> new StatusCountDTO((String) obj[0], (Long) obj[1]))
            .collect(Collectors.toList());
    }
  
	public List<String>  getAllTypes(){
		return repo.findAll().stream()
                .map(AddCampaignForm::getType)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
	}
		
	
	
	public List<String>  getAllStatuses(){
		return repo.findAll().stream()
                .map(AddCampaignForm::getStatus)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
	}
	
	
	
	public Page<AddCampaignForm> filterCampaigns(CampaignFilterRequest request) {
	    Specification<AddCampaignForm> spec = Specification.where(null);

	    if (request.getSearchText() != null && !request.getSearchText().isEmpty()) {
	        spec = spec.and((root, query, cb) -> cb.or(
	            cb.like(cb.lower(root.get("campaignName")), "%" + request.getSearchText().toLowerCase() + "%"),
	            cb.like(cb.lower(root.get("client")), "%" + request.getSearchText().toLowerCase() + "%")
	        ));
	    }

	    if (request.getClient() != null && !request.getClient().isEmpty()) {
	        spec = spec.and((root, query, cb) -> cb.equal(root.get("client"), request.getClient()));
	    }

	    // Add more conditions similarly...

	    Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
	    return repo.findAll(spec, pageable);
	
	}
	
	@Override
	@Transactional
	public AddCampaignDTO AddNewCampaign(AddCampaignDTO campaign) {
	    
		Set<Assignee> attachedAssignees = new HashSet<>();
	    
	    
	    AddCampaignForm campobj = this.mapper.map(campaign, AddCampaignForm.class);
	    
	    
	    for (Assignee selectedAssignee : campobj.getAssignees()) {
	        if (selectedAssignee.getId() != null) {
	            Assignee existingAssignee = assRepo.findById(selectedAssignee.getId())
	                .orElseThrow(() -> new RuntimeException("Assignee not found with id " + selectedAssignee.getId()));

	            // Add this campaign to the assignee's list of campaigns
	            existingAssignee.getCampaigns().add(campobj);

	            attachedAssignees.add(existingAssignee);
	        } else {
	            throw new RuntimeException("Invalid Assignee provided");
	        }
	    }

	    // Set the attached assignees to the campaign
	    campobj.setAssignees(attachedAssignees);
	    
	    campobj.setCreatedAt(LocalDateTime.now());

	    // Save the campaign
	   	    repo.save(campobj);
	   AddCampaignDTO dto=  this.mapper.map(campobj, AddCampaignDTO.class);
	    		 
	   return dto;
	}
	
	
//	@Override
//	@Transactional
//	public AddCampaignForm AddNewCampaign(AddCampaignForm campaign) {
//	    Set<Assignee> attachedAssignees = new HashSet<>();
//
//	    for (Assignee selectedAssignee : campaign.getAssignees()) {
//	        if (selectedAssignee.getId() != null) {
//	            Assignee existingAssignee = assRepo.findById(selectedAssignee.getId())
//	                .orElseThrow(() -> new RuntimeException("Assignee not found with id " + selectedAssignee.getId()));
//
//	            // Add this campaign to the assignee's list of campaigns
//	            existingAssignee.getCampaigns().add(campaign);
//
//	            attachedAssignees.add(existingAssignee);
//	        } else {
//	            throw new RuntimeException("Invalid Assignee provided");
//	        }
//	    }
//
//	    // Set the attached assignees to the campaign
//	    campaign.setAssignees(attachedAssignees);
//	    
//	    campaign.setCreatedAt(LocalDateTime.now());
//
//	    // Save the campaign
//	    return repo.save(campaign);
//	}
	

//	@Override
//	public List<AddCampaignForm> getAllCampaigns() {
//	    List<AddCampaignForm> campaigns = repo.findAll();
//	    for (AddCampaignForm campaign : campaigns) {
//	        campaign.getAssignees().size(); // Force loading of assignees
//	    }
//	    return campaigns;
//	}
	
//	@Override
//	public Page<AddCampaignDTO> getAllCampaigns(Pageable pageable) {
//		
//		
//		
//	    Page<AddCampaignForm> campaignsPage = repo.findAll(pageable);
//	    
//	    
//	    
//	    campaignsPage.getContent().forEach(campaign -> campaign.getAssignees().size());
//	    return campaignsPage;
//	}
	
	@Override
	public Page<AddCampaignDTO> getAllCampaigns(Pageable pageable) {
	    // Fetch page of entities
	    Page<AddCampaignForm> campaignsPage = repo.findAll(pageable);

	    // Convert each entity to DTO using ModelMapper
	    Page<AddCampaignDTO> dtoPage = campaignsPage.map(campaign -> {
	        AddCampaignDTO dto = mapper.map(campaign, AddCampaignDTO.class);
	        // Force initialization of lazy collections if needed
	        dto.getAssignees().size();  
	        return dto;
	    });

	    return dtoPage;
	}
	
	
	
	
	@Override
	public AddCampaignForm getCampaign(Integer id) {
		    
		return repo.findById(id).get();
	}



	@Override
	public AssigneeDTO addNewAssignee(AssigneeDTO dto) {
			
		Assignee map = this.mapper.map(dto, Assignee.class);
		
		Assignee savedAssignee = assRepo.save(map);
		
		AssigneeDTO map2 = this.mapper.map(savedAssignee, AssigneeDTO.class);
		
		return map2;
		
	    // Convert DTO to Entity
//	    Assignee assignee = new Assignee();
//	    assignee.setAssigneeName(dto.getAssigneeName());
//	    assignee.setAssigneeEmail(dto.getAssigneeEmail());
//	    assignee.setCampaigns(new HashSet<>()); // Ensure no campaigns are set initially
//
//	    // Save the entity
//		Assignee savedAssignee = assRepo.save(assignee);
//
//
//	    // Convert Entity back to DTO
//	    AssigneeDTO savedDto = new AssigneeDTO();
//	    savedDto.setId(savedAssignee.getId());
//	    savedDto.setAssigneeName(savedAssignee.getAssigneeName());
//	    savedDto.setAssigneeEmail(savedAssignee.getAssigneeEmail());
//
//	    return savedDto;
	}


	
	@Override
	public List<AssigneeDTO> getAllAss() {
	    List<Assignee> allAsss = assRepo.findAll();

	    List<AssigneeDTO> assDTO = allAsss.stream()
	        .map(assignee -> mapper.map(assignee, AssigneeDTO.class))
	        .collect(Collectors.toList());

	    return assDTO;
	}
	
	
	@Override
	public boolean updateStatus(Integer id, String status) {
       
		AddCampaignForm campaign= repo.findById(id).orElse(null);
		
		if(campaign != null) {
			campaign.setStatus(status);
			repo.save(campaign);			
			return true;
		}
		

		return false;
	}

	
	

	@Override
	public String addNewUser(UsersDTO user) {
	  
		  Users usermain = this.mapper.map(user, Users.class);
		    
		     userRepo.save(usermain);
				
		return "User saved...!";
	}




	@Override
	public String updateCampaign(Integer id, AddCampaignForm form) {
		   AddCampaignForm camp = repo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Campaign not found with id: " + id));
		    
		   camp.setCampaignName(form.getCampaignName());
		   camp.setCampaignSeries(form.getCampaignSeries());
		   camp.setType(form.getType());
		   camp.setStatus(form.getStatus());
		   camp.setStartDate(form.getStartDate());
		   
		   camp.setDueDate(form.getDueDate());
		   camp.setLeads(form.getLeads());
		   camp.setNotes(form.getNotes());
		   camp.setAssets(form.getAssets());
		   camp.setIndustry(form.getIndustry());
		   
		   // Re-attach existing Assignees from DB
		    Set<Assignee> attachedAssignees = new HashSet<>();
		    for (Assignee selectedAssignee : form.getAssignees()) {
		        if (selectedAssignee.getId() != null) {
		            Assignee existingAssignee = assRepo.findById(selectedAssignee.getId())
		                    .orElseThrow(() -> new RuntimeException("Assignee not found with id " + selectedAssignee.getId()));

		            // Add this campaign to the assignee’s campaigns
		            existingAssignee.getCampaigns().add(camp);
		            attachedAssignees.add(existingAssignee);
		        } else {
		            throw new RuntimeException("Invalid Assignee provided");
		        }
		    }

		    camp.setAssignees(attachedAssignees);

		    // Save updated campaign
		    repo.save(camp);

		   
		return "Updated successfully...";
	}
	
	
	 public String deleteCampaign(Integer Id){
		  
             	AddCampaignForm camp = repo.findById(Id).orElseThrow(() ->new RuntimeException("Campaign not found with id: " + Id));
		 
                   	repo.delete(camp);
                   	
		 return "campaign delete success fully.";
	 }
	
	

}
