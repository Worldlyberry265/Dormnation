package Dormnation.Backend.Server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
//@EntityScan("model")
//@EnableJpaRepositories(basePackages = ("Sword.Group.FirstTask.repository"))
public class Server {

	public static void main(String[] args) {
		SpringApplication.run(Server.class, args);
	}

}
