import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { SensorsComponent } from './sensors/sensors.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { LoginComponent } from './login/login.component';
import { AddSensorComponent } from './add-sensor/add-sensor.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'sensors', component: SensorsComponent, canActivate: [AuthGuard] },
    { path: 'heatmap', component: HeatmapComponent, canActivate: [AuthGuard] },
    { path: 'addsensor', component: AddSensorComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
