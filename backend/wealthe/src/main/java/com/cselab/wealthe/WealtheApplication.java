package com.cselab.wealthe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class WealtheApplication {

	public static void main(String[] args) {
		SpringApplication.run(WealtheApplication.class, args);
	}

}



