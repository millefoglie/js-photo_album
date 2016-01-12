package com.github.millefoglie.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    DataSource dataSource;
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth)
	    throws Exception {
	auth
	.jdbcAuthentication()
	.dataSource(dataSource)
	.usersByUsernameQuery(
		"select username, password, enabled "
		+ "from users where username = ?")
	.authoritiesByUsernameQuery(
		"select username, roles.name "
		+ "from users "
		+ "join roles_users on users.id = roles_users.user_id "
		+ "join roles on roles_users.role_id = roles.id "
		+ "where username = ?");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
	http
	.csrf().disable()
	.authorizeRequests()
	.antMatchers("/upload").authenticated()
	.antMatchers("/like").authenticated()
	.anyRequest().permitAll()
	.and()
	.formLogin().loginPage("/signin").defaultSuccessUrl("/index")
	.usernameParameter("username").passwordParameter("password")
	.and()
	.logout().logoutUrl("/signout").deleteCookies("JSESSIONID")
	.logoutSuccessUrl("/index")
	.clearAuthentication(true)
	.invalidateHttpSession(true)
//	.and()
//	.httpBasic()
	;
    }

}
