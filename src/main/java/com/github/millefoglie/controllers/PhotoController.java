package com.github.millefoglie.controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.ServletContext;

import org.im4java.core.ConvertCmd;
import org.im4java.core.IM4JavaException;
import org.im4java.core.IMOperation;
import org.im4java.process.Pipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import com.github.millefoglie.entities.Photo;
import com.github.millefoglie.entities.User;
import com.github.millefoglie.repositories.PhotoRepository;
import com.github.millefoglie.repositories.UserRepository;

@Controller
public class PhotoController {
    
    @Autowired
    ServletContext servletContext;
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    PhotoRepository photoRepo;
    
    @Transactional
    @RequestMapping(path = "/upload", method=RequestMethod.POST)
    public ResponseEntity<String> uploadPhoto(
	    @RequestParam("title") String title,
	    @RequestParam("description") String description,
	    @RequestParam("file") MultipartFile file) {
	if (file.isEmpty()) {
	    throw new FileIsEmptyException();
	}
	
	if (!file.getContentType().startsWith("image/")) {
	    throw new FileIsNotImageException();
	}
	
	Authentication auth =
		SecurityContextHolder.getContext().getAuthentication();
	
	String username = auth.getName();
	String filename = file.getOriginalFilename();
	
	Photo firstPhoto = photoRepo.findFirstByOrderByIdDesc();
	long photoIdx = firstPhoto == null ? 1 : firstPhoto.getId() + 1;
	String extension = filename.substring(filename.lastIndexOf('.'));
	
	String filepathRel = "photos/" + username + "/" + photoIdx + extension;
	String filepathAbs = servletContext.getRealPath("") + "/" + filepathRel;
	
	if (title.length() == 0) {
	    title = "Untitled";
	}
	
	User user = userRepo.findByUsername(username);
	Photo photo = new Photo(user, title, description);
	
	photo.setFilepath(filepathRel);
	
	try {
	    File output = new File(filepathAbs);
	  
	    output.getParentFile().mkdirs();
	    output.createNewFile();

	    IMOperation op = new IMOperation();
	    
	    op.addImage("-");
	    op.compress("JPEG");
	    op.quality(75.0);
	    op.resize(1024, 1024);
	    op.addImage("-");
	    
	    InputStream fis = file.getInputStream();
	    OutputStream fos = new FileOutputStream(output);
	    Pipe pipe  = new Pipe(fis, fos);

	    ConvertCmd convert = new ConvertCmd();
	    
	    convert.setInputProvider(pipe);
	    convert.setOutputConsumer(pipe);
	    convert.run(op);
	    
	    fis.close();
	    fos.close();
	    
	    photoRepo.save(photo);
		
	    return new ResponseEntity<String>("File uploaded.", HttpStatus.OK);
	} catch (IOException | InterruptedException | IM4JavaException ex) {
	    ex.printStackTrace();
	}

	return new ResponseEntity<String>(
		"Could not upload file.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @Transactional
    @RequestMapping(value="/like")
    public ResponseEntity<?> like(
	    @RequestParam("photoId") long photoId) {
	Authentication auth =
		SecurityContextHolder.getContext().getAuthentication();
	
	String username = auth.getName();

	User user = userRepo.findByUsername(username);
	Photo photo = photoRepo.findOne(photoId);
	
	List<User> likes = photo.getLikes();
	
	if (likes.contains(user)) {
	    likes.remove(user);
	} else {
	    likes.add(user);
	}
	
	photo.countLikes();
	photoRepo.save(photo);
	
	return new ResponseEntity<String>(
		"{\"likesCount\":" + photo.getLikesCount() + "}", 
		HttpStatus.OK);
    }
    
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "File is empty")
    public static class FileIsEmptyException extends RuntimeException {
	private static final long serialVersionUID = -6375202796831619936L;
    }
	
    @ResponseStatus(value = HttpStatus.BAD_REQUEST, 
	    reason = "File is not an image")
    public static class FileIsNotImageException extends RuntimeException {
	private static final long serialVersionUID = 8717993613877127175L;
    }
}
