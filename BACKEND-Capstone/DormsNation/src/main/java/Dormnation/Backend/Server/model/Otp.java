package Dormnation.Backend.Server.model;

import java.sql.Timestamp;

public class Otp {

	private String User_Email;
	private int OTP_Value;
	private Timestamp Expiration_Timestamp;

	public Otp() {

	}

	public Otp(String User_Email, int OTP_Value, Timestamp Expiration_Timestamp) {
		super();
		this.User_Email = User_Email;
		this.OTP_Value = OTP_Value;
		this.Expiration_Timestamp = Expiration_Timestamp;
	}

	public String getUser_Email() {
		return User_Email;
	}

	public void setUser_Email(String User_Email) {
		this.User_Email = User_Email;
	}

	public int getOTP_Value() {
		return OTP_Value;
	}

	public void setOTP_Value(int OTP_Value) {
		this.OTP_Value = OTP_Value;
	}

	public Timestamp getExpiration_Timestamp() {
		return Expiration_Timestamp;
	}

	public void setExpiration_Timestamp(Timestamp Expiration_Timestamp) {
		this.Expiration_Timestamp = Expiration_Timestamp;
	}

}
