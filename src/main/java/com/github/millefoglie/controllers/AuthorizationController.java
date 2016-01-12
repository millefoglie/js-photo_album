package com.github.millefoglie.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.github.millefoglie.entities.Role;
import com.github.millefoglie.entities.User;
import com.github.millefoglie.repositories.RoleRepository;
import com.github.millefoglie.repositories.UserRepository;

@Controller
public class AuthorizationController {
    
    private static final int PASSWORD_MIN_LENGTH = 4;

    @Autowired
    HttpServletRequest req;
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    RoleRepository roleRepo;
    
    @RequestMapping(path = "/signup", method = RequestMethod.POST)
    public String signUp(@RequestParam String username, 
	    @RequestParam String password, 
	    RedirectAttributes redirectAttributes) {
	User user = userRepo.findByUsername(username);

	if (password.length() <= PASSWORD_MIN_LENGTH) {
	    throw new PasswordTooShortException();
	}
	
	if (user != null) {
	    throw new UsernameAlreadyExistsException();
	}
	
	user = new User(username, password);
	Role role = roleRepo.findByName("user");

	user.addRole(role);
	userRepo.save(user);

	redirectAttributes.addFlashAttribute("username", username);
	redirectAttributes.addFlashAttribute("password", password);
	
	return "redirect:/index";
    }
    
    @RequestMapping(path = "/signin", method = RequestMethod.POST)
    public ResponseEntity<?> signIn(@RequestParam String username, 
	    @RequestParam String password) {
	return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @RequestMapping(path = "/signout", method = RequestMethod.GET)
    public ResponseEntity<?> signOut() {
	return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @ResponseStatus(value = HttpStatus.BAD_REQUEST,
	    reason="Such a username already exists.")
    public class UsernameAlreadyExistsException extends RuntimeException {
	private static final long serialVersionUID = -6441970119653722302L;
    }
    
    @ResponseStatus(value = HttpStatus.BAD_REQUEST,
	    reason=("Password should be at least " + PASSWORD_MIN_LENGTH +
		    " characters long."))
    public class PasswordTooShortException extends RuntimeException {
	private static final long serialVersionUID = -3585355546761235695L;
    }
    
}
