import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagingService } from '../Services/messaging.service';
import { NotificationforgroundService } from '../Services/notificationforground.service';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FirebaseServiceService } from '../Services/firebase-service.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    message: any;
    Sensors: any

    lat = 51.678418;
    lng = 7.809007;
    FromNumber = '+19283962669'
    body = "ER IS  BRAND !!!"
    Ingelogd: any

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    chartData: ChartConfiguration['data'] = {
        labels: [],
        datasets: [
            { data: [], label: 'Temperature' },
            { data: [], label: 'Humidity' }
        ]
    };

    chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            x: {},
            y: {}
        },
        plugins: {
            legend: { display: true },
            datalabels: {
                anchor: 'end',
                align: 'end'
            }
        }
    };
    chartPlugins = [DataLabelsPlugin];
    chartType: ChartType = 'bar';

    constructor(private messaging: MessagingService,
        private notificationForeground: NotificationforgroundService,
        private firebase: FirebaseServiceService,
        private database: AngularFireDatabase, public router: Router) {
        // this.notify();
    }

    ngOnInit(): void {
        // this.messaging.requestPermission();
        this.Ingelogd = localStorage.getItem("loggedIn")
        if (this.Ingelogd) {
            this.database
                .list('/user/' + localStorage.getItem('Profilename'))
                .valueChanges().subscribe(data => {
                    for (let i = 0; i < data.length; i++) {
                        this.chartData.labels?.push('Sensor ' + (i + 1));
                        this.chartData.datasets[0].data.push((data[i] as any).temp);
                        this.chartData.datasets[1].data.push((data[i] as any).hum);
                    }
                    this.chart?.update();
                    this.Sensors = data
                    localStorage.setItem("NummberOfSensors", JSON.stringify(data.length))
                    console.log(this.Sensors)
                }
                );

        } else {
            this.router.navigate(['/login'])
        }


    }

    // async notify() {
    //     setTimeout(async () => await this.notificationForeground.start(), 1000)
    //     this.notificationForeground.openConfirmNotificationdialog(this.notificationForeground.bericht.notification.title + ', ' + this.notificationForeground.bericht.notification.body).afterClosed();
    // }

    sendSms() {
        // let body = "From=+19283962669&To=+32484855456&Body=this is from angular Nicholas"
        // let body = "From=" + this.FromNumber + "&To=" + this.ToNumber + "&Body=" + this.body
        this.firebase.TelefoonNummer = localStorage.getItem("number")
        let body = "From=" + this.FromNumber + "&To=" + this.firebase.TelefoonNummer + "&Body=" + this.body
        this.messaging.Sms(body).subscribe(s => {
            console.log("sent")
        })
        console.log(this.firebase.TelefoonNummer)
    }
    waarde = 0
    CheckingFire(first: any, sensor: any) {
        // this.tel++
        if (first != this.waarde && first > this.waarde) {
            //alert('hahha')
            console.log('fire !!')
            this.body = "Er is Brand! " + sensor + " temperatuur is nu " + first + " °C Klik hierop om hem te bekijken " + "https://savemyforest.azurewebsites.net/#/sensors"
            this.sendSms()
            this.waarde = first
        }

    }
}
