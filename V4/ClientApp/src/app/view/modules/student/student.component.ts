import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Employee} from "../../../entity/employee";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {EmployeeService} from "../../../service/employeeservice";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit{

  columns: string[] = ['number', 'callingname', 'gender', 'designation', 'fullname', 'modi'];
  headers: string[] = ['Number', 'Calling Name', 'Gender', 'Designation', 'Full Name', 'Modification'];
  binders: string[] = ['number', 'callingname', 'gender.name', 'designation.name', 'fullname', 'getModi()'];

  data!: MatTableDataSource<Employee>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  employees: Array<Employee> = [];

  uiassist: UiAssist;
  constructor(
    private es: EmployeeService,


){
    this.uiassist=new UiAssist(this);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();

  }

  createView() {

    this.loadTable("");
  }

  loadTable(query: string) {

    this.es.getAll(query)
      .then((emps: Employee[]) => {
        this.employees = emps;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.employees);
        this.data.paginator = this.paginator;
        console.log(this.data);
      });

  }
}

