import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import {  OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationComponent } from '../material-component/dialog/confirmation/confirmation.component';
import { StageService } from '../services/stage.service';
import { StageComponent } from '../material-component/dialog/stage/stage.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	displayedColumns:string[] = ['name','categoryName','description'];
	dataSource:any;
	responseMessage:any;
	data:any;
	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private dialog:MatDialog,
		private router:Router,
		private stageService:StageService,
		private snackbarService:SnackbarService) 
		{ this.ngxService.start(); 
			this.dashboardData();
			this.tableData();
		}


	dashboardData(){
		this.dashboardService.getDetails().subscribe((response:any) => {
            this.ngxService.stop();
			this.data = response;
		},(error:any) =>{
			this.ngxService.stop();
            console.log(error);
			if(error.error?.message){
                   this.responseMessage = error.error?.message;
			}
			else{
                this.responseMessage = GlobalConstants.genericError;
            }
			this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
		});
	}

	tableData(){
		this.stageService.getStages().subscribe((response:any)=>{
		  this.ngxService.stop();
		  this.dataSource = new MatTableDataSource(response);
	}, (error:any)=>{
	  this.ngxService.stop();
	  console.log(error);
	  if(error.error?.message){
		this.responseMessage = error.error?.message;
	  }
	  else{
		this.responseMessage = GlobalConstants.genericError;
	  }
	  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
	}
	)
	  }
	  applyFilter(event:Event){
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	  }
}

