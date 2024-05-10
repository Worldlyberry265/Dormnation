//BUSINESS LOGIC, FOR VALIDATION PURPOSES
package Dormnation.Backend.Server.userDetails;

import Dormnation.Backend.Server.exceptions.CustomException;
import Dormnation.Backend.Server.model.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Primary
public class UserInfoUserDetailsService implements UserDetailsService {

	@Autowired
	JdbcTemplate Jtemplate;

	// ASK IF I SHOULD CHANGE IT TO DAOIMPLEMENTATION

	// For JWT Filter
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		try {
			String sql = "SELECT Username, Password FROM users WHERE email= ? LIMIT 1";
			Optional<Users> user = Jtemplate.query(sql, new BeanPropertyRowMapper<>(Users.class), email).stream()
					.findFirst();
//		return user.map(UserInfoUserDetails::new).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(),
//				"NOT_FOUND", "Username Not Found", "/authenticate", ZonedDateTime.now()));
			return user.map(u -> new UserInfoUserDetails(u, this))
					.orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "NOT_FOUND",
							"Username Not Found", "/Login/loadUserbyUsername", ZonedDateTime.now()));

		} catch (DataAccessException e) {
			CustomException exception = new CustomException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
					"INTERNAL_SERVER_ERROR", "An error occurred while accessing the data", "/Login/loadUserbyUsername",
					ZonedDateTime.now());
			throw exception;
		}

	}

}
