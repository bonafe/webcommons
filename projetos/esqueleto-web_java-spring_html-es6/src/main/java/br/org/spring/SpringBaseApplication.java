package br.org.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 
 * Main da aplicação Spring. Sobe o servidor Tomcat e a aplicação em conjunto.
 * 
 *
 */
@SpringBootApplication
public class SpringBaseApplication
	extends SpringBootServletInitializer
	implements CommandLineRunner, WebMvcConfigurer{
	
	@Autowired
	Environment env;
	
	@Override
    public void run(String... args) throws Exception {
  
	}
	
	
	
	/*
     * CORS (Cross-Origin Resource Sharing)
     *
     * For security reasons, browsers prohibit AJAX calls to resources outside the
     * current origin. For example, you could have your bank account in one tab
     * and evil.com in another. Scripts from evil.com should not be able to make
     * AJAX requests to your bank API with your credentials — for example withdrawing
     * money from your account!
    */
    @Override
    //Habilita o CORS apenas quando roda com o profile devlocal
    //Dessa forma podemos rodar o bac-kend no eclipse e o front-end em outra IDE
    //Isso poderia gerar risco de segurança se colocado em produção ATENÇÃO
    @Profile("devlocal")
    public void addCorsMappings(CorsRegistry registry) {

    	String[] activeProfiles = env.getActiveProfiles();
    	
    	System.out.println(activeProfiles);
    	
        registry.addMapping("/**")
        	.allowedOrigins("http://localhost")
        	.allowedMethods("POST","GET","PUT", "DELETE","ORIGINS");
    }
	
	
	
	public static void main(String[] args) {
		SpringApplication.run(SpringBaseApplication.class, args);
	}		
}

