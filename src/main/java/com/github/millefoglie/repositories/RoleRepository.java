package com.github.millefoglie.repositories;

import org.springframework.data.repository.CrudRepository;

import com.github.millefoglie.entities.Role;

public interface RoleRepository extends CrudRepository<Role, Long> {

    Role findByName(String name);
}
