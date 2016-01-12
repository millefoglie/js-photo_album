package com.github.millefoglie.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.millefoglie.entities.Photo;
import com.github.millefoglie.repositories.PhotoRepository;
import com.github.millefoglie.repositories.UserRepository;
import com.github.millefoglie.visitors.PhotoUrlParserVisitor;
import com.mysema.query.types.expr.BooleanExpression;
import com.mysema.query.types.path.PathBuilder;

import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.ast.Node;
import cz.jirutka.rsql.parser.ast.RSQLVisitor;

@RestController
public class PhotoRestController {

    @Autowired
    UserRepository userRepo;
    
    @Autowired
    PhotoRepository photoRepo;

    @RequestMapping("/photos")
    public Page<Photo> getPhotos(
	    @RequestParam(name = "q", required = false) String queryStr,
	    Pageable pageable) {
	if (queryStr == null) {
	    return photoRepo.findAll(pageable);
	}
	
	Node rootNode = new RSQLParser().parse(queryStr);
	RSQLVisitor<BooleanExpression, PathBuilder<Photo>> visitor =
		new PhotoUrlParserVisitor();
	PathBuilder<Photo> pb = new PathBuilder<>(Photo.class, "photo");
	BooleanExpression filter = (BooleanExpression) rootNode.accept(visitor, pb);
	
	return photoRepo.findAll(filter, pageable);
    }
    
    @RequestMapping("/photos/{photoId}")
    public Photo getPhoto(
	    @PathVariable("photoId") long photoId) {
	Photo photo = photoRepo.findOne(photoId);

	return photo;
    }

    @RequestMapping("/{username}/photos")
    public Page<Photo> getUserPhotos(@PathVariable("username") String username,
	    Pageable pageable) {
	Page<Photo> photos = photoRepo.findAllByAuthorName(username, pageable);

	return photos;
    }
}
