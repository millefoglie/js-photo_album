package com.github.millefoglie.repositories;

import org.springframework.data.repository.CrudRepository;

import com.github.millefoglie.entities.User;

public interface UserRepository extends CrudRepository<User, Long> {

    User findByUsername(String username);
    
}
