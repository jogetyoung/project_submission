package com.example.vttp_project_backend;

import com.example.vttp_project_backend.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VttpProjectBackendApplication implements CommandLineRunner {

	@Autowired
	ApiService apiService;

	public static void main(String[] args) {
		SpringApplication.run(VttpProjectBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		// initially populate mongo
		// commented out so that it does not keep repopulating
		//apiService.readApi();

	}

}
