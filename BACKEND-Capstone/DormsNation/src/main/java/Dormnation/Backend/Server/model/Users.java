package Dormnation.Backend.Server.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import Dormnation.Backend.Server.dao.MainDAO;
import Dormnation.Backend.Server.userDetails.UserInfoUserDetails;

public class Users {

	private int ID;
	private String Username;
	private String Password;
	private String Email;
	private int Age;
	private String Gender;

//	public List<Role> getRoles(UserInfoUserDetails UserDetail) {
//		return (List<Role>) UserDetail.getAuthorities();
//	}

	public int getID() {
		return ID;
	}

	public Users() {

	}

	public Users(String username, String password, String email, String address, int age, String gender) {
		super();
		Username = username;
		Password = password;
		Email = email;
		Age = age;
		Gender = gender;

	}
//	public Users(String username, String email, String address) {
//		super();
//		Username = username;;
//		Email = email;
//		Address = address;
//
//	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getUsername() {
		return Username;
	}

	public void setUsername(String username) {
		Username = username;
	}

	public String getPassword() {
		return Password;
	}

	public void setPassword(String password) {
		Password = password;
	}

	public String getEmail() {
		return Email;
	}

	public void setEmail(String email) {
		Email = email;
	}

	public int getAge() {
		return Age;
	}

	public void setAge(int age) {
		Age = age;
	}

	public String getGender() {
		return Gender;
	}

	public void setGender(String gender) {
		Gender = gender;
	}
}
