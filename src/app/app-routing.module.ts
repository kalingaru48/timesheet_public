import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TimesheetComponent } from './components//home/new_items/timesheet/timesheet.component';
import { ClientComponent } from './components//home/new_items/client/client.component';
import { LawyerComponent } from './components//home/new_items/lawyer/lawyer.component';
import { MatterComponent } from './components//home/new_items/matter/matter.component';

import { Edit_TimesheetComponent } from './components/home/edit_items/timesheet/edit_timesheet.component';
import { Edit_ClientComponent } from './components/home/edit_items/client/edit_client.component';
import { Edit_LawyerComponent } from './components/home/edit_items/lawyer/edit_lawyer.component';
import { Edit_MatterComponent } from './components/home/edit_items/matter/edit_matter.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'timesheet', component: TimesheetComponent },
    { path: 'client', component: ClientComponent },
    { path: 'lawyer', component: LawyerComponent },
    { path: 'matter', component: MatterComponent },
    { path: 'edit_timesheet', component: Edit_TimesheetComponent },
    { path: 'edit_client', component: Edit_ClientComponent },
    { path: 'edit_lawyer', component: Edit_LawyerComponent },
    { path: 'edit_matter', component: Edit_MatterComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
