package Dormnation.Backend.Server.model;

public class Dorm {

	private int ID;
	private String Title;
	private String Location;
	private float Rating;
	private int Stars;
	private boolean Parking;
	private boolean SharedKitchen;
	private String Gender;
	private int Distance;
	private String MainImagePath;
	private int CheapestPrice;
	private int Capacity;

	private String GoogleMap;

	public Dorm() {

	}

	public Dorm(int iD, String title, String location, int distance, float rating, boolean parking,
			boolean sharedKitchen, String gender, int stars, String googleMap, int Capacity) {
		super();
		ID = iD;
		Title = title;
		Location = location;
		Distance = distance;
		Rating = rating;
		Parking = parking;
		SharedKitchen = sharedKitchen;
		Gender = gender;
		Stars = stars;
		GoogleMap = googleMap;
		this.setCapacity(Capacity);
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getTitle() {
		return Title;
	}

	public void setTitle(String title) {
		Title = title;
	}

	public String getLocation() {
		return Location;
	}

	public void setLocation(String location) {
		Location = location;
	}

	public int getDistance() {
		return Distance;
	}

	public void setDistance(int distance) {
		Distance = distance;
	}

	public float getRating() {
		return Rating;
	}

	public void setRating(float rating) {
		Rating = rating;
	}

	public boolean isParking() {
		return Parking;
	}

	public void setParking(boolean parking) {
		Parking = parking;
	}

	public boolean isSharedKitchen() {
		return SharedKitchen;
	}

	public void setSharedKitchen(boolean sharedKitchen) {
		SharedKitchen = sharedKitchen;
	}

	public String getGender() {
		return Gender;
	}

	public void setGender(String gender) {
		Gender = gender;
	}

	public int getStars() {
		return Stars;
	}

	public void setStars(int stars) {
		Stars = stars;
	}

	public String getGoogleMap() {
		return GoogleMap;
	}

	public void setGoogleMap(String googleMap) {
		GoogleMap = googleMap;
	}

	public String getMainImagePath() {
		return MainImagePath;
	}

	public void setMainImagePath(String mainImagePath) {
		MainImagePath = mainImagePath;
	}

	public int getCheapestPrice() {
		return CheapestPrice;
	}

	public void setCheapestPrice(int cheapestPrice) {
		CheapestPrice = cheapestPrice;
	}

	public int getCapacity() {
		return Capacity;
	}

	public void setCapacity(int capacity) {
		Capacity = capacity;
	}

}
