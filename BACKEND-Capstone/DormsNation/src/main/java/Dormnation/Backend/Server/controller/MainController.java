package Dormnation.Backend.Server.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Dormnation.Backend.Server.dao.MainDAO;
import Dormnation.Backend.Server.model.Otp;
import Dormnation.Backend.Server.model.Users;

@RestController
public class MainController {

	@Autowired // Instead ProductService service
	private MainDAO eDAO; // Instead ProductService service

	@PostMapping("/Register")
	public ResponseEntity<Object> saveUser(@RequestBody Users user) {
		ResponseEntity<Object> result = eDAO.register(user);
		return result;
	}

	@PostMapping("/Login")
	public ResponseEntity<Object> authenticateAndGetToken(@RequestBody Users user) {
		ResponseEntity<Object> result = eDAO.LoginAndGetToken(user);
		return result;

	}

	@PostMapping("/requestOTP")
	public ResponseEntity<Object> requestOTP(@RequestBody Users user) {
		ResponseEntity<Object> result = eDAO.requestOTP(user);
		return result;
	}

	@PostMapping("/verifyOTP")
	public ResponseEntity<Object> verifyOTP(@RequestBody Otp otp) {
		ResponseEntity<Object> result = eDAO.verifyOTP(otp);
		return result;
	}

	@PostMapping("/changePass")
	public ResponseEntity<Object> verifyOTP(@RequestBody Users user) {
		ResponseEntity<Object> result = eDAO.changePass(user);
		return result;
	}

	@GetMapping("/homepage/MainSearchEngine/{Location}/{startDate}/{endDate}/{NumberOfGuests}/{PriceDist}/{Rating}/{Gender}/{SharedKitchen}/{Parking}/{minPrice}/{maxPrice}")
	public ResponseEntity<Object> getDorms(@PathVariable String Location, @PathVariable String startDate,
			@PathVariable String endDate, @PathVariable int NumberOfGuests, @PathVariable String PriceDist,
			@PathVariable int Rating, @PathVariable String Gender, @PathVariable boolean SharedKitchen,
			@PathVariable boolean Parking, @PathVariable int minPrice, @PathVariable int maxPrice) {

		return eDAO.getDesiredDorms(Location, startDate, endDate, NumberOfGuests, PriceDist, Rating, Gender,
				SharedKitchen, Parking, minPrice, maxPrice);
	}

	@GetMapping("/propertyList/{SearchedTitle}")
	public ResponseEntity<Object> getDormsTitles(@PathVariable String SearchedTitle) {
		return eDAO.getDormsTitles(SearchedTitle);
	}

	@GetMapping("/propertyList/getDorm/{id}/{startDate}/{endDate}/{NumberOfGuests}")
	public ResponseEntity<Object> getDormById(@PathVariable int id, @PathVariable String startDate,
			@PathVariable String endDate, @PathVariable int NumberOfGuests) {
		return eDAO.getDormById(id, startDate, endDate, NumberOfGuests);
	}

	@PostMapping("/payment/addBooking")
	public ResponseEntity<Object> addBooking(@RequestBody Map<String, Object> BookingInfo) {
//		 	System.out.println("dorm_id: " + bookingInfo.get("dorm_id"));
//		    System.out.println("room_id: " + bookingInfo.get("room_id"));
//		    System.out.println("guest_id: " + bookingInfo.get("guest_id"));
//		    System.out.println("checkin: " + bookingInfo.get("checkin"));
//		    System.out.println("checkout: " + bookingInfo.get("checkout"));
//		    System.out.println("shared: " + bookingInfo.get("shared"));
		return eDAO.AddBooking(BookingInfo);

	}

	@GetMapping("/bookings/getBookings/{id}")
	public ResponseEntity<Object> getBookings(@PathVariable int id) {
		return eDAO.getBookings(id);
	}

	@GetMapping("/testDatabaseConnection")
	public List<String> testDatabaseConnection() {
		return eDAO.testDatabaseConnection();
	}
	
	@GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        // Check if your application is healthy here
        // You can perform any necessary checks and return an appropriate response
        
        // For example, if your application is healthy, return 200 OK
        return ResponseEntity.ok("Application is healthy");
        
        // If your application is not healthy, you can return a different HTTP status code
        // return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Application is not healthy");
    }

}
