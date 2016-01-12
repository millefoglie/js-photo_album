package com.github.millefoglie.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue
    private long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User author;
    
    private String title;
    
    @NotNull
    private String filepath;
    
    private String description;
    
    // is updated by db triggers
    @Column(name = "likes_count", updatable = false)
    private int likesCount;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Past
    @Column(name = "added_on")
    private java.util.Calendar addedOn;
    
    @ManyToMany
    @JoinTable(
        name="likes",
        joinColumns={@JoinColumn(name="photo_id", referencedColumnName="id")},
        inverseJoinColumns={@JoinColumn(name="user_id", referencedColumnName="id")})
    private List<User> likes = new ArrayList<>();

    public Photo() {}
    
    public Photo(User author, String title, String description) {
	super();
	this.author = author;
	this.title = title;
	this.description = description;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public java.util.Calendar getAddedOn() {
        return addedOn;
    }

    public void setAddedOn(java.util.Calendar addedOn) {
        this.addedOn = addedOn;
    }

    public List<User> getLikes() {
        return likes;
    }

    public void setLikes(List<User> likes) {
        this.likes = likes;
    }
    
    @PrePersist
    @PreUpdate
    public void countLikes() {
	this.likesCount = likes.size(); 
    }
    
}
