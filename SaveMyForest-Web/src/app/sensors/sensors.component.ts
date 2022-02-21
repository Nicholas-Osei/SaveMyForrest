import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteSensorComponent } from '../delete-sensor/delete-sensor.component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FirebaseServiceService } from '../Services/firebase-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  Temperature: number;
  SensorId: number;
  Humidity: number;
  Action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

];

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})


export class SensorsComponent implements OnInit {

  displayedColumns: string[] = ['SensorId', 'Temperature', 'Humidity', 'Action'];

  Sensors: any = [];
  Ingelogd: any

  number = 0
  @ViewChild(MatTable)
  table!: MatTable<PeriodicElement>;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource!: MatTableDataSource<PeriodicElement>;
  @ViewChild('paginator')
  paginator!: MatPaginator;

  ngAfterViewInit() {

  }
  constructor(private router: Router, private dialog: MatDialog, public dbService: FirebaseServiceService, public db: AngularFireDatabase, public fireAuth: AngularFireAuth, public _http: HttpClient) {
    // const itemsRef: AngularFireList<any> = db.list('user');
    // this.db.getData().subscribe(x => { this.items = x; console.log(x) })


    // this.db.getData()
    // itemsRef.valueChanges().subscribe(x => { console.log(x); this.items = x })
    // console.log(this.db.tutorialsRef?.valueChanges().subscribe(x => this.lol = x))


    // console.log(this.db.database.ref('/user/' + this.Username + '/').push().key)

    //   ref.once("value")
    // .then(function(snapshot) {
    //    var key = snapshot.key; // "childName";

    console.log(dbService.isLoggedIn)


  }

  ngOnInit(): void {

    this.Ingelogd = localStorage.getItem("loggedIn")
    if (this.Ingelogd) {
      this.dbService.Username = localStorage.getItem('UName')
      console.log(this.dbService.Username)
      const ref = this.db.list('/user/' + this.dbService.Username)
      ref.valueChanges().subscribe((data) => {
        this.Sensors = data;
        this.dbService.Sensors = data;
        console.log('from service', this.dbService.Sensors)
        console.log(this.db.list.length)
        localStorage.setItem("NummberOfSensors", JSON.stringify(data.length))

        //this.dbService.Sensors = data

        console.log(this.Sensors)
        this.dataSource = new MatTableDataSource(this.Sensors);
        this.dataSource.paginator = this.paginator;

        // if (element.email === 'nico') {
        //   this.Sensors = data;
        //   console.log(element.email)
        // } else {
        //   console.log(element.email + 'andres')
        // }

        console.log(this.db.database.ref('/user/try'))
      })
      console.log(this.dbService.Sensors)

    } else {
      this.router.navigate(['/login'])
    }

  }


  GotoAddsensorPage() {
    this.router.navigate(['/addsensor'])

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  DeleteSensor(id: number) {

    console.log(id)


    // console.log(('https://save-my-forest-default-rtdb.europe-west1.firebasedatabase.app/user/' + this.dbService.Username + '/Sensor' + id + '/.json'))


    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true
    // dialogConfig.autoFocus = true
    // dialogConfig.width = "30%"

    console.log()
    this.dialog.open(DeleteSensorComponent, {
      width: "35%",
      panelClass: 'confirm-dialog-container',
      disableClose: true
    }).afterClosed().subscribe(res => {
      console.log(res)
      if (res) {

        //Delete sensor
        this._http.delete('https://save-my-forest-default-rtdb.europe-west1.firebasedatabase.app/user/' + this.dbService.Username + '/Sensor' + id + '/.json')
          .subscribe(() => console.log('deleted'))
      }

    });

  }
  trackByMethod(index: number, el: any): number {
    // console.log(index)
    return el.id;
  }

  // waarde = 0
  // CheckingFire(first: any) {
  //   // this.tel++
  //   if (first != this.waarde && first > this.waarde) {
  //     //alert('hahha')
  //     console.log('fire !!')
  //     this.waarde = first
  //   }

  // }

}
