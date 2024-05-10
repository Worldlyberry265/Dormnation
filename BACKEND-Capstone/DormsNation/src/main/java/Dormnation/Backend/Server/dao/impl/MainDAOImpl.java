package Dormnation.Backend.Server.dao.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Map;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import Dormnation.Backend.Server.dao.MainDAO;
import Dormnation.Backend.Server.exceptions.CustomException;
import Dormnation.Backend.Server.model.Dorm;
import Dormnation.Backend.Server.model.Otp;
import Dormnation.Backend.Server.model.Users;
import Dormnation.Backend.Server.security.JwtService;
import Dormnation.Backend.Server.userDetails.UserInfoUserDetailsService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
//import org.springframework.http.ResponseEntity;

@Repository
public class MainDAOImpl implements MainDAO {

	@Autowired
	JdbcTemplate Jtemplate;
	@Autowired
	BCryptPasswordEncoder passwordEncoder;

	@Autowired
	UserInfoUserDetailsService UserService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JavaMailSender javaMailSender;

	// Length of the generated OTP
	private static final int OTP_LENGTH = 6;

	private final List<String> locations = List.of("LAU Beirut", "LAU Byblos", "AUB", "BAU", "RHU", "USJ");

	// Generate a random OTP
	public int generateOTP() {
		// Define characters allowed in the OTP
		String allowedCharacters = "123456789";

		// Create a StringBuilder to store the OTP
		StringBuilder otpBuilder = new StringBuilder(OTP_LENGTH);

		// Use a random number generator to pick characters from the allowed set
		Random random = new Random();
		for (int i = 0; i < OTP_LENGTH; i++) {
			int index = random.nextInt(allowedCharacters.length());
			otpBuilder.append(allowedCharacters.charAt(index));
		}

		// Convert the StringBuilder to int
		int otp = Integer.parseInt(otpBuilder.toString());
		return otp;
	}

	// All the regexes below reduce significantly the percentage of successful sql
	// injections by not allowing semicolons and quotes

	private boolean isUsernametValid(String input) {
		// Perform input validation to disallow special characters
		String regex = "^[A-Za-z ]+$"; // Regular expression that only allows alphabets and spaces
		return input.matches(regex);
	}

	private boolean isGenderValid(String input) {
		// Perform input validation to disallow special characters
		return (input.equals("Male") || input.equals("Female"));
	}

	private boolean isAgeValid(int input) {
		// Perform input validation to disallow special characters
		return (input >= 15 && input <= 59);
	}

	// 6 chars min, small and capital and include number atleast 1, and 1 special
	// min
	private boolean isPassValid(String input) {
		// Perform input validation to disallow special characters
		String regex = "^[A-Za-z0-9!@#$%^&*]+$"; // Regular expression that only allows alphabets, numbers, and
													// special
													// // characters
		return input.matches(regex);
	}

	private boolean isEmailValid(String input) {
		// Perform input validation to disallow special characters
		// new regex ^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$
		String regex = "^[A-Za-z0-9._-]+@[A-Za-z.]+\\.[A-Za-z]{2,}$"; // Regular expression for an email
		return input.matches(regex);
	}

	private boolean isEmailUnique(String email) { // To search if the email is already used
		String sql = "SELECT COUNT(*) FROM users WHERE Email = ? LIMIT 1";
		int count = Jtemplate.queryForObject(sql, Integer.class, email);
		return count == 0; // if not found return true, else if count = 1 return false
	}

	@Override
	public ResponseEntity<Object> register(Users user) {
		try {
			// Validate input for special characters
			if (!isUsernametValid(user.getUsername())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Username, Only Letters and spaces are allowed.", "/Register", ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			// Validate input for special characters
			if (!isPassValid(user.getPassword())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Password, Only letters, numbers, and !@#$%^&* are allowed", "/Register",
						ZonedDateTime.now());
				return exception.toResponseEntity();
//				throw new IllegalArgumentException(
//						"INVALID Password! ONLY LETTERS, NUMBERS, AND !@#$%^&* ARE ALLOWED.");
			}

			// Validate input for special characters
			if (!isEmailValid(user.getEmail())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Email, Only letters, numbers, and .-_ are allowed", "/Register", ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			if (!isGenderValid(user.getGender())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Gender, please select either Male or Female", "/Register", ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			if (!isAgeValid(user.getAge())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Age, please select an age between 15 and 59 inclusive ", "/Register",
						ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			boolean isEmailUnique = isEmailUnique(user.getEmail());

			// Check if the email is unique
			if (!isEmailUnique) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Email already exists, You should use a different email.", "/Register", ZonedDateTime.now());
//				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception);
				return exception.toResponseEntity();
			}
			String hashedPassword = passwordEncoder.encode(user.getPassword());

			int result = Jtemplate.update(
					"INSERT INTO users (Username, Password, Email, Gender, Age) VALUES (?, ?, ?, ?, ?)",
					user.getUsername(), hashedPassword, user.getEmail(), user.getGender(), user.getAge());

			if (result > 0) {
				System.out.println(user.getEmail());
				System.out.println(user.getPassword());
				return ResponseEntity.ok("User Saved");
			}
		} catch (DataAccessException e) {
			// Exception occurred while accessing the data
			CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
					"INTERNAL_SERVER_ERROR", "An error occurred while accessing the data", "/Register",
					ZonedDateTime.now());
			return exception.toResponseEntity();

		}
		CustomException exception = new CustomException(HttpStatus.SERVICE_UNAVAILABLE.value(), // Another other
																								// value?
				"SERVICE_UNAVAILABLE", "An error occurred while accessing the data", "/Register", ZonedDateTime.now());
		return exception.toResponseEntity();

	}

	@SuppressWarnings("deprecation")
	@Override
	public ResponseEntity<Object> LoginAndGetToken(@RequestBody Users user) {

		Users Returneduser = null;

		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "/Login", ZonedDateTime.now());

		String sql2 = "SELECT Id, Username , Gender FROM users WHERE Email = ? LIMIT 1"; // just anything

		// Validate input for special characters
		if (!isEmailValid(user.getEmail())) {
			exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
					"Invalid Email, Only letters, numbers, and .-_ are allowed", "/Login", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		// Validate input for special characters
		if (!isPassValid(user.getPassword())) {
			exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
					"Invalid Paasword, Only letters, numbers, and !@#$%^&* are allowed", "/Login", ZonedDateTime.now());
			return exception.toResponseEntity();

		}

		try {
//			foundUser = Jtemplate.queryForObject(sql2, MiniUser.class, user.getEmail());

			Returneduser = Jtemplate.queryForObject(sql2, new Object[] { user.getEmail() }, (resultSet, rowNum) -> {
				Users User = new Users();
//			return Jtemplate.queryForObject(sql, (resultSet, rowNum) -> {
				User.setID(resultSet.getInt("Id"));
				User.setUsername(resultSet.getString("Username"));
				User.setGender(resultSet.getString("Gender"));
				return User;
			});

			if (Returneduser != null) {

				try {
					// The Login method will fetch the userDetails from the Db and compare it
					// with the authRequest

					Authentication authentication = authenticationManager
							.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

					if (authentication.isAuthenticated()) {
//			return ResponseEntity.ok(jwtService.generateToken(user.getUsername(),user.getRoles()));
						return ResponseEntity.ok(jwtService.generateToken(Returneduser.getUsername(),
								Returneduser.getID(), Returneduser.getGender()));
					}

				} catch (org.springframework.security.core.AuthenticationException ex) {
					exception = new CustomException(HttpStatus.FORBIDDEN.value(), "FORBIDDEN", "Wrong Password",
							"/Login/authenticate", ZonedDateTime.now());
					return exception.toResponseEntity();
				} catch (DataAccessException e) {
					exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
							"An error occurred while accessing the data", "/Login/authenticate", ZonedDateTime.now());
					return exception.toResponseEntity();
				}
			}

		} catch (EmptyResultDataAccessException e) {
			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND",
					"Please check your email and try again", "/Login", ZonedDateTime.now());
			return exception.toResponseEntity();
		} catch (DataAccessException e) {
			e.printStackTrace();
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/Login", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		return exception.toResponseEntity();

	}

	@Override
	public ResponseEntity<Object> requestOTP(Users user) {
		int result = 0;
		int otp = 0;
		if (!isEmailValid(user.getEmail())) {
			CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
					"Invalid Email, Only letters, numbers, and .-_ are allowed", "/requestOTP", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		try {
			boolean isEmailUnique = isEmailUnique(user.getEmail());

			// Check if the email is unique
			if (isEmailUnique) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Email doesn't exist, Please check your email", "/requestOTP", ZonedDateTime.now());
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception);
				return exception.toResponseEntity();
			} else {
				try {
					otp = generateOTP();
					LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
					// Convert expirationTime to a timestamp (assuming Java 8 or later)
					Timestamp expirationTimestamp = Timestamp.valueOf(expirationTime);
					result = Jtemplate.update(
							"INSERT INTO otp (User_Email, OTP_Value, Expiration_Timestamp) VALUES (?, ?, ?)",
							user.getEmail(), otp, expirationTimestamp);

				} catch (DataAccessException e) {
					e.printStackTrace();
					CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
							"INTERNAL_SERVER_ERROR", "An error occurred while accessing the data", "/requestOTP",
							ZonedDateTime.now());
					return exception.toResponseEntity();
				}
				if (result > 0) {

					try {
						MimeMessage mimeMessage = javaMailSender.createMimeMessage();
						MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
						helper.setFrom("baraa.ghalayini20@gmail.com");
						helper.setTo(user.getEmail());
						helper.setSubject("DormsNation account password reset OTP");
						String htmlContent = "The OTP for your password change is: <strong>" + otp
								+ "</strong><br/>It will expire in 5 mins.";
						helper.setText(htmlContent, true);

						javaMailSender.send(mimeMessage);

					} catch (MessagingException m) {
						m.printStackTrace();
						CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
								"INTERNAL_SERVER_ERROR", "An error occurred while sending the mail", "/requestOTP",
								ZonedDateTime.now());
						return exception.toResponseEntity();
					}
				} else {
					CustomException exception = new CustomException(HttpStatus.SERVICE_UNAVAILABLE.value(),
							"SERVICE_UNAVAILABLE", "An error occurred while accessing the data", "/requestOTP",
							ZonedDateTime.now());
					return exception.toResponseEntity();
				}
			}
		} catch (DataAccessException e) {
			CustomException exception = new CustomException(HttpStatus.SERVICE_UNAVAILABLE.value(),
					"SERVICE_UNAVAILABLE", "An error occurred while accessing the data", "/requestOTP",
					ZonedDateTime.now());
			return exception.toResponseEntity();
		}

		return ResponseEntity.ok("We have emailed you a reset OTP, please enter it");
	}

	@SuppressWarnings({ "deprecation", "unused" })
	public ResponseEntity<Object> verifyOTP(Otp otp) {

		CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
				"No OTP was found", "/verifyOTP", ZonedDateTime.now());

		if (!isEmailValid(otp.getUser_Email())) {
			exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
					"Invalid Email, Only letters, numbers, and .-_ are allowed", "/requestOTP", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		String sql = "SELECT * FROM otp WHERE User_Email = ? AND OTP_Value = ? LIMIT 1";
		Otp OtpToken = new Otp();
		try {
			OtpToken = Jtemplate.queryForObject(sql, new Object[] { otp.getUser_Email(), otp.getOTP_Value() },
					(resultSet, rowNum) -> {
						Otp Otptoken = new Otp();
						Otptoken.setOTP_Value(resultSet.getInt("OTP_Value"));
						Otptoken.setExpiration_Timestamp(resultSet.getTimestamp("Expiration_Timestamp"));
						return Otptoken;
					});

		} catch (EmptyResultDataAccessException e) {
			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND", "There was no OTP found",
					"/verifyOTP", ZonedDateTime.now());
			return exception.toResponseEntity();
		} catch (DataAccessException e) {
			// Exception occurred while accessing the data
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/UpdateUser", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
		if (OtpToken.getExpiration_Timestamp().before(currentTimestamp)) {
			exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
					"The OTP has expired, redirecting", "/verifyOTP", ZonedDateTime.now());
			return exception.toResponseEntity();
		}

		try {
			String deleteOtpSql = "DELETE FROM otp WHERE User_Email = ?";
			int deletedRows = Jtemplate.update(deleteOtpSql, otp.getUser_Email());

		} catch (EmptyResultDataAccessException e) {
			exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST", "No OTP was found",
					"/verifyOTP", ZonedDateTime.now());
		} catch (DataAccessException e) {
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/UpdateUser", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		if (OtpToken != null) {
			return ResponseEntity.ok("OTP Verified");
		}

		return exception.toResponseEntity();
	}

	@Override
	public ResponseEntity<Object> changePass(Users user) {
		int result = 0;
		try {
			// Validate input for special characters
			if (!isEmailValid(user.getEmail())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Email, Only letters, numbers, and .-_ are allowed", "/changePass",
						ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			// Validate input for special characters
			if (!isPassValid(user.getPassword())) {
				CustomException exception = new CustomException(HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST",
						"Invalid Password, Only letters, numbers, and !@#$%^&* are allowed", "/changePass",
						ZonedDateTime.now());
				return exception.toResponseEntity();
			}

			String hashedPassword = passwordEncoder.encode(user.getPassword());

			String updateSql = "UPDATE users SET Password = ? WHERE Email = ?";
			result = Jtemplate.update(updateSql, hashedPassword, user.getEmail());

		} catch (EmptyResultDataAccessException e) {
			CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
					"INTERNAL_SERVER_ERROR", "An error occurred while changing the password", "/changePass",
					ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		if (result > 0) {
			return ResponseEntity.ok("User Updated");
		}
		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"INTERNAL_SERVER_ERROR", "An error occurred while accessing the data", "/changePass",
				ZonedDateTime.now());
		return exception.toResponseEntity();
	}

	@SuppressWarnings("deprecation")
	@Override
	public ResponseEntity<Object> getDesiredDorms(String Location, String startDate, String endDate, int NumberOfGuests,
			String PriceDist, int Rating, String Gender, boolean SharedKitchen, boolean Parking, int minPrice,
			int maxPrice) {

		List<Dorm> dorms = new ArrayList<>();

		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "//homepage/getUsers/", ZonedDateTime.now());

		Date StartDate = new Date();
		Date EndDate = new Date();
		SimpleDateFormat inputFormat = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
//		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			StartDate = inputFormat.parse(startDate);
			EndDate = inputFormat.parse(endDate);

			// Set the day to 1st for both start and end dates
			StartDate.setDate(1);
			EndDate.setDate(1);

//			String formattedStartDate = outputFormat.format(StartDate);
//			String formattedEndDate = outputFormat.format(EndDate);

		} catch (ParseException p) {
			p.printStackTrace();
		}

		switch (PriceDist.toLowerCase()) {
		case "priceasc":
			PriceDist = " CheapestPrice ASC";
			break;
		case "pricedesc":
			PriceDist = " CheapestPrice DESC";
			break;
		case "distance":
			PriceDist = " d.distance ASC";
			break;
		default:
			PriceDist = " CheapestPrice";
		}

		String filterbyRating = " ";
		if (Rating > 0) {
			filterbyRating = " AND d.rating >= " + Rating;
		}

		switch (Gender.toLowerCase()) {
		case "male":
			Gender = " AND d.gender = 'male'";
			break;
		case "female":
			Gender = " AND d.gender = 'female'";
			break;
		case "both":
			Gender = " AND d.gender = 'both'";
			break;
		default:
			Gender = " ";
		}

		String filterbySharedKitchen = " ";
		if (SharedKitchen) {
			filterbySharedKitchen = " AND d.SharedKitchen = true";
		}

		String filterbyParking = " ";
		if (Parking) {
			filterbyParking = " AND d.Parking = true";
		}

		Object param[] = new Object[] { Location, NumberOfGuests, StartDate, EndDate };
		String SearchByTitORLoc = " d.Title = ? AND ";
		if (Location.equalsIgnoreCase("any") || Location.equalsIgnoreCase("any university")) {
			SearchByTitORLoc = " ";
			param = new Object[] { NumberOfGuests, StartDate, EndDate };
			System.out.println("Im in");
//			Location = null;
		} else {
			for (int i = 0; i < locations.size(); i++) {
				if (locations.get(i).equalsIgnoreCase(Location)) {
					SearchByTitORLoc = " d.location = ? AND ";
					break;
				}
			}
		}

		System.out.println("location : " + Location);
//		System.out.println("SearchByTitORLoc : " + SearchByTitORLoc);

		String SearchByminPrice = " AND dr.price >= " + minPrice;
		if (minPrice == 0) {
			SearchByminPrice = " ";
		}
		String SearchBymaxPrice = " AND dr.price <= " + maxPrice;
		if (maxPrice == 0) {
			SearchBymaxPrice = " ";
		}

		String sql = "SELECT \r\n" + "    d.ID AS DormID,\r\n" + "    d.title AS DormTitle,\r\n" + "    d.location,\r\n"
				+ "    d.rating,\r\n" + "    d.parking,\r\n" + "    d.SharedKitchen,\r\n" + "    d.gender,\r\n"
				+ "    d.distance,\r\n" + "    d.stars,\r\n" + "    d.MainImagePath,\r\n"
				+ "    MIN(dr.Capacity) AS RoomCapacity,\r\n" + "    MIN(dr.price) AS CheapestPrice\r\n" + "FROM\r\n"
				+ "    dorms d\r\n" + "        JOIN\r\n" + "    dormrooms dr ON d.ID = dr.Dorm_ID\r\n"
				+ "        LEFT JOIN\r\n" + "    bookings b ON dr.Dorm_ID = b.Dorm_ID\r\n"
				+ "        AND dr.ID = b.Room_ID\r\n" + "WHERE\r\n" + SearchByTitORLoc + " \r\n"
				+ "         dr.Capacity >= ?\r\n" + filterbyRating + Gender + filterbySharedKitchen + filterbyParking
				+ SearchByminPrice + SearchBymaxPrice + "        AND (NOT EXISTS( SELECT \r\n" + "            1\r\n"
				+ "        FROM\r\n" + "            bookings b\r\n" + "        WHERE\r\n"
				+ "            b.Dorm_ID = dr.Dorm_ID\r\n" + "                AND b.Room_ID = dr.ID\r\n"
				+ "                AND (b.Checkout >= ?\r\n"
				+ "                AND b.Checkin <= ?))                \r\n" + "        OR (SELECT \r\n"
				+ "            COUNT(b2.ID)\r\n" + "        FROM\r\n" + "            bookings b2\r\n"
				+ "        WHERE\r\n" + "            b2.Dorm_ID = dr.Dorm_ID\r\n"
				+ "                AND b2.Room_ID = dr.ID) < dr.roomcount)\r\n"
				+ "GROUP BY d.ID , d.title , d.location , d.rating , d.parking , d.SharedKitchen , d.gender , d.distance\r\n"
				+ "HAVING CheapestPrice IS NOT NULL\r\n" + "ORDER BY " + PriceDist + " \r\n" + "";
//		System.out.println(sql);
		try {
			System.out.println("filterByPrice Distance: " + PriceDist);
			dorms = Jtemplate.query(sql, param, (resultSet, rowNum) -> {
				Dorm dorm = new Dorm();

				dorm.setID(resultSet.getInt("DormID"));
				dorm.setTitle(resultSet.getString("DormTitle"));
				dorm.setLocation(resultSet.getString("location"));
				dorm.setRating(resultSet.getFloat("rating"));
				dorm.setParking(resultSet.getBoolean("parking"));
				dorm.setSharedKitchen(resultSet.getBoolean("SharedKitchen"));
				dorm.setGender(resultSet.getString("gender"));
				dorm.setCapacity(resultSet.getInt("RoomCapacity"));
				dorm.setDistance(resultSet.getInt("distance"));
				dorm.setStars(resultSet.getInt("stars"));
				dorm.setMainImagePath(resultSet.getString("MainImagePath"));
				dorm.setCheapestPrice(resultSet.getInt("CheapestPrice"));
				return dorm;
			});

			if (dorms.isEmpty()) {
				exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND",
						"No Dorms were available for your desired dates", "MainSearchEngine/", ZonedDateTime.now());
				return exception.toResponseEntity();
			}

		} catch (DataAccessException e) {
			System.out.println("size: " + dorms.size());
			e.printStackTrace();
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "MainSearchEngine/", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
		return ResponseEntity.ok(dorms);
	}

	@SuppressWarnings("deprecation")
	@Override
	public ResponseEntity<Object> getDormsTitles(String SearchedTitle) {

//		System.out.println(SearchedTitle);

		List<String> hits = new ArrayList<>();

		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "/propertyList/{SearchedTitle}", ZonedDateTime.now());

		String sql = "SELECT \r\n" + "    Title\r\n" + "FROM\r\n" + "    dorms\r\n" + "WHERE\r\n" + "    Title LIKE '%"
				+ SearchedTitle + "%' LIMIT 5";

		try {
			hits = Jtemplate.query(sql, (resultSet, rowNum) -> {
				return resultSet.getString("Title");
			});

		} catch (EmptyResultDataAccessException e) {
			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND",
					"No Dorms were available for your desired dates", "/propertyList/{SearchedTitle}",
					ZonedDateTime.now());
			return exception.toResponseEntity();

		} catch (DataAccessException e) {
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/propertyList/{SearchedTitle}", ZonedDateTime.now());
			return exception.toResponseEntity();
		}

		for (String location : locations) {
			if (location.toLowerCase().contains(SearchedTitle.toLowerCase())) {
				hits.add(location);
			}
		}
		if ("Any University".toLowerCase().contains(SearchedTitle.toLowerCase())) {
			hits.add("Any University");
		}
		return ResponseEntity.ok(hits);
	}

	@SuppressWarnings("deprecation")
	@Override
	public ResponseEntity<Object> getDormById(int id, String startDate, String endDate, int NumberOfGuests) {
		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "/propertyList/getDorm/:id", ZonedDateTime.now());

		Date StartDate = new Date();
		Date EndDate = new Date();
		SimpleDateFormat inputFormat = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
//		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
			StartDate = inputFormat.parse(startDate);
			EndDate = inputFormat.parse(endDate);

			// Set the day to 1st for both start and end dates
			StartDate.setDate(1);
			EndDate.setDate(1);

//			String formattedStartDate = outputFormat.format(StartDate);
//			String formattedEndDate = outputFormat.format(EndDate);

		} catch (ParseException p) {
			p.printStackTrace();
		}

		String sql1 = "SELECT * FROM dorms WHERE ID = ?";
		String sql2 = "SELECT ImagePath FROM dormimages WHERE Dorm_ID = ?";
		String sql3 = "SELECT\r\n" + "    dr.ID AS RoomID,\r\n" + "    dr.Title AS RoomTitle,\r\n"
				+ "    dr.Capacity,\r\n" + "    dr.Beds,\r\n" + "    dr.Area,\r\n" + "    dr.Price,\r\n"
				+ "    dr.Tv,\r\n" + "    dr.Wind,\r\n" + "    dr.Balcony,\r\n" + "    dr.ClothesIron,\r\n"
				+ "     (dr.roomcount - \r\n" + "        COALESCE((\r\n" + "            SELECT COUNT(b2.ID)\r\n"
				+ "            FROM bookings b2\r\n" + "            WHERE\r\n"
				+ "                b2.Dorm_ID = dr.Dorm_ID\r\n" + "                AND b2.Room_ID = dr.ID\r\n"
				+ "                AND (\r\n" + "                    b2.Checkout > ?   \r\n"
				+ "                    AND b2.Checkin < ?   -- Check-in before user's check-out\r\n"
				+ "                )\r\n" + "        ), 0)\r\n" + "    ) AS RemainingRooms,\r\n"
				+ "    dr.MainImagePath\r\n" + "FROM\r\n" + "    dormrooms dr\r\n" + "WHERE\r\n"
				+ "    dr.Dorm_ID = ?             \r\n" + "    AND dr.Capacity >= ?  \r\n" + "\r\n" + "    \r\n"
				+ "    AND (\r\n" + "       \r\n" + "        NOT EXISTS (\r\n" + "            SELECT 1\r\n"
				+ "            FROM bookings b\r\n" + "            WHERE\r\n"
				+ "                b.Dorm_ID = dr.Dorm_ID\r\n" + "                AND b.Room_ID = dr.ID\r\n"
				+ "                AND (\r\n" + "                    b.Checkout > ? \r\n"
				+ "                    AND b.Checkin < ?  \r\n" + "                )\r\n" + "        )\r\n"
				+ "        OR (\r\n" + "\r\n" + "            COALESCE(( SELECT COUNT(b2.ID)\r\n"
				+ "            FROM bookings b2\r\n" + "            WHERE\r\n"
				+ "                b2.Dorm_ID = dr.Dorm_ID\r\n" + "                AND b2.Room_ID = dr.ID\r\n"
				+ "                AND (\r\n" + "                    b2.Checkout > ?  \r\n"
				+ "                    AND b2.Checkin < ?  \r\n" + "                )\r\n"
				+ "        ),0) < dr.roomcount\r\n" + "    )\r\n" + "    )\r\n" + "ORDER BY\r\n"
				+ "    dr.Capacity ASC;  \r\n" + "\r\n" + "";

		String sql4 = "SELECT ImagePath FROM roomimages WHERE Room_ID = ?";
		try {
			Map<String, Object> Dorm = Jtemplate.queryForObject(sql1, new Object[] { id }, (resultSet, rowNum) -> {
				Map<String, Object> dormMap = new HashMap<>();

				dormMap.put("ID", id);
				dormMap.put("Title", resultSet.getObject("Title"));
				dormMap.put("Location", resultSet.getObject("Location"));
				dormMap.put("Distance", resultSet.getObject("Distance"));
				dormMap.put("Rating", resultSet.getObject("Rating"));
				dormMap.put("Parking", resultSet.getObject("Parking"));
				dormMap.put("SharedKitchen", resultSet.getObject("SharedKitchen"));
				dormMap.put("Gender", resultSet.getObject("Gender"));
				dormMap.put("Stars", resultSet.getObject("Stars"));
				dormMap.put("GoogleMap", resultSet.getObject("GoogleMap"));
				dormMap.put("MainImagePath", resultSet.getObject("MainImagePath"));
				dormMap.put("Visitors", resultSet.getObject("Visitors"));
				dormMap.put("QuiteHours", resultSet.getObject("QuiteHours"));
				dormMap.put("Pets", resultSet.getObject("Pets"));
				String ReturnedDescriptions = resultSet.getString("Description");
				String[] Descriptions = ReturnedDescriptions.split("###");
				dormMap.put("Descriptions", Descriptions);
				dormMap.put("DailyHouseKeeping", resultSet.getObject("DailyHouseKeeping"));
				dormMap.put("SmokingArea", resultSet.getObject("SmokingArea"));
				dormMap.put("Wifi", resultSet.getObject("Wifi"));
				dormMap.put("Breakfast", resultSet.getObject("Breakfast"));
				dormMap.put("AirConditioning", resultSet.getObject("AirConditioning"));
				dormMap.put("UnCutElectricity", resultSet.getObject("UnCutElectricity"));
				return dormMap;
			});

			List<String> imagePaths = Jtemplate.queryForList(sql2, new Object[] { id }, String.class);
			Dorm.put("ImagesPaths", imagePaths);
//	        Map<String, Object> DormRooms = Jtemplate.query(sql3, new Object[] {  StartDate, EndDate, id, NumberOfGuests, StartDate, EndDate, StartDate, EndDate, }, (resultSet, rowNum) -> {
			List<Map<String, Object>> DormRooms = Jtemplate.query(sql3,
					new Object[] { StartDate, EndDate, id, NumberOfGuests, StartDate, EndDate, StartDate, EndDate, },
					(resultSet, rowNum) -> {

						Map<String, Object> Room = new HashMap<>();

						Room.put("ID", resultSet.getObject("RoomID"));
						Room.put("Title", resultSet.getObject("RoomTitle"));
						Room.put("Capacity", resultSet.getObject("Capacity"));
						Room.put("Beds", resultSet.getObject("Beds"));
						Room.put("Area", resultSet.getObject("Area"));
						Room.put("Price", resultSet.getObject("Price"));
						Room.put("Tv", resultSet.getObject("Tv"));
						Room.put("Wind", resultSet.getObject("Wind"));
						Room.put("Balcony", resultSet.getObject("Balcony"));
						Room.put("ClothesIron", resultSet.getObject("ClothesIron"));
						Room.put("RemainingRooms", resultSet.getObject("RemainingRooms"));
						Room.put("MainImagePath", resultSet.getObject("MainImagePath"));

						List<String> Images = Jtemplate.queryForList(sql4, String.class, resultSet.getObject("RoomID"));
						Room.put("ImagesPaths", Images);
						return Room;
					});

			Dorm.put("Rooms", DormRooms);

			return ResponseEntity.ok(Dorm);

		} catch (EmptyResultDataAccessException e) {

			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND", "No Dorm was found",
					"/propertyList/getDorm/:id", ZonedDateTime.now());
			return exception.toResponseEntity();

		} catch (DataAccessException e) {
			e.printStackTrace();
			// e.printStackTrace();
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/propertyList/getDorm/:id", ZonedDateTime.now());
			return exception.toResponseEntity();
		}
	}

	@Override
	public ResponseEntity<Object> AddBooking(Map<String, Object> bookingInfo) {

		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "/propertyList/getDorm/:id", ZonedDateTime.now());

		String sql = " INSERT INTO bookings (Dorm_ID, Room_ID, Guests_IDs, Checkin, Checkout, Shared, Price) VALUES ( ?, ?, ?, ? , ?, ?, ?); ";
//		result1 = Jtemplate.update(sql, id, 3);

		int DormID = (int) bookingInfo.get("dorm_id");
		int RoomID = (int) bookingInfo.get("room_id");
		int GuestID = (int) bookingInfo.get("guest_id"); // I'm Storing it as a string in the db so i can put ID###ID
		int Price = (int) bookingInfo.get("price");
		boolean Shared = (boolean) bookingInfo.get("shared");
		String startDate = (String) bookingInfo.get("checkin");
		String endDate = (String) bookingInfo.get("checkout");
//		System.out.println("StartDate: " + startDate);
//		System.out.println("EndDate: " + endDate);

		Date StartDate = new Date();
		Date EndDate = new Date();
		SimpleDateFormat inputFormat = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);

		try {

			StartDate = inputFormat.parse(startDate);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(StartDate);
			calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
			EndDate = calendar.getTime();

		} catch (ParseException e) {

			e.printStackTrace();
		}
//		System.out.println("StartDate: " + StartDate);
//		System.out.println("EndDate: " + EndDate);
		try {
			int result = Jtemplate.update(sql, DormID, RoomID, GuestID, StartDate, EndDate, Shared, Price);

			if (result > 0) {
				return ResponseEntity.ok("Booking Saved");
			}
		} catch (EmptyResultDataAccessException e) {

			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND", "No Dorm was found",
					"/propertyList/getDorm/:id", ZonedDateTime.now());
			return exception.toResponseEntity();

		} catch (DataAccessException e) {
			e.printStackTrace();
			// e.printStackTrace();
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/propertyList/getDorm/:id", ZonedDateTime.now());
			return exception.toResponseEntity();
		}

		return exception.toResponseEntity();
	}

	@SuppressWarnings("deprecation")
	@Override
	public ResponseEntity<Object> getBookings(int id) {

		CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error", "Server Out Of Service", "/propertyList/getDorm/:id", ZonedDateTime.now());

		String sql = "SELECT\r\n" + "	d.MainImagePath, b.Shared,\r\n" + "    b.Checkin,\r\n" + "	b.Price,\r\n"
				+ "    b.Checkout,  \r\n" + "    d.Title AS DormTitle\r\n" + "FROM\r\n" + "    bookings b\r\n"
				+ "JOIN\r\n" + "    users u ON u.ID = ?\r\n" // HERE
				+ "JOIN\r\n" + "    dormrooms dr ON b.Room_ID = dr.ID\r\n" + "JOIN\r\n"
				+ "    dorms d ON b.Dorm_ID = d.ID\r\n" + "WHERE\r\n" + "    b.Guests_IDs LIKE ?  ORDER BY \r\n"
				+ " b.checkin\r\n"; // HERE
		try {

			List<Map<String, Object>> Bookings = Jtemplate.query(sql, new Object[] { id, "%" + id + "%" },
					(resultSet, rowNum) -> {
						Map<String, Object> booking = new HashMap<>();

						booking.put("ImagePath", resultSet.getObject("MainImagePath"));
						booking.put("DormTitle", resultSet.getObject("DormTitle"));
						booking.put("Price", resultSet.getObject("Price"));
						booking.put("Shared", resultSet.getObject("Shared"));
						booking.put("Checkin", resultSet.getObject("Checkin"));
						booking.put("Checkout", resultSet.getObject("Checkout"));

						return booking;
					});
			System.out.println("IM IN");
			return ResponseEntity.ok(Bookings);

		} catch (EmptyResultDataAccessException e) {

			exception = new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND", "No Dorm was found",
					"/propertyList/getDorm/:id", ZonedDateTime.now());
			System.out.println("IM IN1");
			return exception.toResponseEntity();

		} catch (DataAccessException e) {
			e.printStackTrace();
			exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR",
					"An error occurred while accessing the data", "/propertyList/getDorm/:id", ZonedDateTime.now());
			System.out.println("IM IN2");
			return exception.toResponseEntity();
		}

	}

	@Override
	public List<String> testDatabaseConnection() {
		System.out.println("Dassssssssssssssssssssssssssssssdadadadadadasssssssssssssssssssssssssssssssssssssssssss");
		try {
			// Use the query to retrieve the table names
			List<String> tables = Jtemplate.queryForList("SHOW TABLES", String.class);

			return tables;
		} catch (Exception e) {
			throw new RuntimeException("Error listing tables: " + e.getMessage(), e);
		}
	}

}
