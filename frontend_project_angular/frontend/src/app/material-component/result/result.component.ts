import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormService } from 'src/app/services/form.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'enseignant','niveauE', 'view'];
  dataSource: any;
  responseMessage:any;
  forms: any = [];

  constructor(private formService:FormService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    }
    tableData(){
      this.formService.getStagesByPermission().subscribe((response:any)=>{
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error
        );
      })
    }
    getStagesByPermission() {
      this.formService.getStagesByPermission().subscribe(
        (response: any) => {
          this.forms = response;
        },
        (error: any) => {
          this.ngxService.stop();
          console.log(error);
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(
            this.responseMessage,
            GlobalConstants.error
          );
        }
      );
    }

      applyFilter(event:Event){
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }



    handleViewAction(value:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data ={
        data:value
      };
      dialogConfig.width = "100%";
      const dialogRef = this.dialog.open(ResultComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      });
    }

    downloadReportAction(values:any) {
      this.ngxService.start();
      var data ={
        name:values.name,
        email:values.email,
        uuid:values.uuid,
        enseignant:values.enseignant,
        niveauE:values.niveauE
      }
      this.formService.getPDF(data).subscribe((response) => {
        saveAs(response,values.uuid+'.pdf');
        this.ngxService.stop();
      })
    }

}
