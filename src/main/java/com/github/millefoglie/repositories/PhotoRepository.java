package com.github.millefoglie.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.github.millefoglie.entities.Photo;
import com.mysema.query.types.Predicate;

public interface PhotoRepository 
extends PagingAndSortingRepository<Photo, Long>,
QueryDslPredicateExecutor<Photo> {

    @Query("select p "
    	+ "from Photo p "
    	+ "where p.author.username = :authorName")
    Page<Photo> findAllByAuthorName(
	    @Param("authorName") String authorName, Pageable pageable);

    Page<Photo> findByTitle(String title, Pageable pageable);

    Photo findFirstByOrderByIdDesc();

    Page<Photo> findAll(Predicate predicate, Pageable pageable);
}
