package com.example.vttp_project_backend.exceptions;

public class UserNotFoundException extends Exception {

    public UserNotFoundException(){
        super();
    }

    public UserNotFoundException(String msg){
        super(msg);
    }
    
}
