import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-dorms',
  templateUrl: './property-dorms.component.html',
  styleUrls: ['./property-dorms.component.css']
})
export class PropertyDormsComponent implements OnInit {

  @ViewChild('googleMapIframe', { static: true }) googleMapIframe: ElementRef | undefined;


  ID : number;
  Title : string;
  // Location : string;
  // Distance : number;
  Rating : number;
  Parking : boolean;
  SharedKitchen : boolean;
  Gender : string;
  Stars : number;
  GoogleMap : string;
  // MainImagePath : string;
  ImagesPaths : string[];
  Visitors : boolean;
  QuiteHours : number;
  Pets : boolean;
  Descriptions : string[];
  DailyHouseKeeping : boolean;
  SmokingArea : boolean;
  Wifi : boolean;
  Breakfast : boolean;
  AirConditioning : boolean;
  UnCutElectricity : boolean;

  Rooms : any[];


  starIndex : number[] = [];
  constructor(private route : ActivatedRoute) {

  }

  ngOnInit() {
    const mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d765.8501828268547!2d35.47790271891758!3d33.89370175117833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f172cafc26df3%3A0xcdbfa96b0dab943a!2sVilla%20Queens!5e0!3m2!1sen!2slb!4v1701208930770!5m2!1sen!2slb';

    // Check if the 'src' attribute contains latitude and longitude parameters
    const latLngMatch = mapSrc.match(/!3d(-?\d+\.\d+)!.*2d(-?\d+\.\d+)/);
    
    if (latLngMatch) {
      const latitude = parseFloat(latLngMatch[1]);
      const longitude = parseFloat(latLngMatch[2]);
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
    } else {
      console.log('Latitude and Longitude not found in the src attribute.');
    }






    
    this.route.data.subscribe(
      (Dorm: Object) => {
        this.ID = Dorm['dorm'].ID;
        this.Title = Dorm['dorm'].Title;
        this.Rating = Dorm['dorm'].Rating;
        this.Parking = Dorm['dorm'].Parking;
        this.SharedKitchen = Dorm['dorm'].SharedKitchen; 
        this.Gender = Dorm['dorm'].Gender; 

        localStorage.setItem("dormGender", this.Gender);

        this.Stars = Dorm['dorm'].Stars; 
       this.GoogleMap = Dorm['dorm'].GoogleMap; 
        // this.MainImagePath = Dorm['dorm'].MainImagePath; 
        this.ImagesPaths = Dorm['dorm'].ImagesPaths; 
        this.Visitors = Dorm['dorm'].Visitors; 
        this.QuiteHours = Dorm['dorm'].QuiteHours; 
        this.Pets = Dorm['dorm'].Pets; 
        this.Descriptions = Dorm['dorm'].Descriptions; 
        this.DailyHouseKeeping = Dorm['dorm'].DailyHouseKeeping; 
        this.SmokingArea = Dorm['dorm'].SmokingArea; 
        this.Wifi = Dorm['dorm'].Wifi; 
        this.Breakfast = Dorm['dorm'].Breakfast; 
        this.AirConditioning = Dorm['dorm'].AirConditioning; 
        this.UnCutElectricity = Dorm['dorm'].UnCutElectricity; 

        // this.Rooms = Dorm['dorm']['room']
        this.Rooms = Dorm['dorm'].Rooms;
      },
      (error) => {
        console.log(error);
      }
    );


    for (let i = 0; i < this.Stars; i++) {
      this.starIndex.push(0);
    }
    
  }







  //dont delete it for the box-shadow of carousel
  darktheme = false;

  

  reviews = [
    {
      revName: 'Baraa Ghalayini',
      revRating: 10,
      revDesc: 'Very nice hotel'
    },
    {
      revName: 'Shadi Ghalayini',
      revRating: 7,
      revDesc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, error. Rem odio ad consectetur deleniti fuga. Corporis eos, vero neque molestias exercitationem deserunt, atque necessitatibus culpa praesentium ad minus. Assumenda?'
    },
    {
      revName: 'Abed Ghalayini',
      revRating: 3,
      revDesc: 'Very nice hotel'
    },
  ]



  // changeTheme() {
  //   this.darktheme = !this.darktheme;
  // }
}
