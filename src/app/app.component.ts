import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from './todo.service';
import { Task } from './Task.component';
import { ToastrService } from 'ngx-toastr';




interface Görevler {
  id: number;
  title: string;
  is_canceled: boolean;
  butonName;
  buttonColor;
  isComplete: boolean;
  selected: boolean;
  isEditable: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoService]
})
export class AppComponent implements OnInit {
  taskList: Task[];
  görev: Task;

  constructor(private todoService: TodoService,
              private toastr: ToastrService) {

  }


  form = new FormGroup({
    firstTask: new FormControl('', Validators.required)
  });
  
  editField: string;
  selectedTasks: Array<number> = [];
  selectedAll: any;
  buttonColor: string;
  addTaskValue: string;
  idTask;
  tasks: Array<Görevler> = [
    
    {
      id: 1,
      title: 'Çiçekleri sula',
      isComplete: false,
      is_canceled: false,
      butonName: 'Tamamlanmadı',
      buttonColor: '#343a40',
      selected: false,
      isEditable: false
    },
    {
      id: 2,
      title: 'Angular çalış',
      is_canceled: false,
      isComplete: false,
      butonName: 'Tamamlanmadı',
      buttonColor: '#343a40',
      selected: false,
      isEditable: false
    }
  ];

  checkTask(e, idTask) {
    if (e.target.checked) {
      this.selectedTasks.push(idTask);
    } else {
      const index = this.selectedTasks.findIndex(x => x === idTask);
      this.selectedTasks.splice(index, 1);
    }

    console.log(this.selectedTasks);
  }

  cancelTask(idTask: number) {
    if (confirm('Silmek istediğinize emin misiniz?')) {
      this.tasks.splice(idTask, 1);
      this.toastr.warning('Görev silindi', 'İşlem başarılı');
    }
  }

  addToDo(value: string) {
    console.log(this.idTask);

    if (this.idTask != null && this.idTask !== undefined) {
      const editField = this.addTaskValue;
      this.tasks[this.idTask].title = editField;
      this.idTask = null;

    } else {
      this.tasks.push({
        title: value,
        is_canceled: false,
        butonName: '',
        buttonColor: '',
        isComplete: false,
        selected: false,
        isEditable: false,
        id: this.tasks.length + 1
      });
    }
    this.toastr.success('', 'İşlem başarılı');
    this.addTaskValue = '';

    this.form.reset();
  }

  completeTask(task) {
    task.isComplete = true;
    task.butonName = 'Görev tamamlandı';
    task.buttonColor = '#228B22';

    this.toastr.info('Görev tamamlandı', 'İşlem başarılı');
  }
  clearAll() {
      this.tasks.splice(0);
  }

  allTaskComplete() {
    this.selectedTasks.forEach((e: number) => {
      this.tasks[e].isComplete = true;
      this.tasks[e].butonName = 'Görev tamamlandı';
      this.tasks[e].buttonColor = '#228B22';
      this.toastr.info('Görev tamamlandı', 'İşlem başarılı');
    });
  }

  backComplete(task) {
    task.isComplete = false;
    task.butonName = 'Görev tamamlanmadı';
    task.buttonColor = '#343a40';
  }

  selectAll(idTask) {
    this.selectedTasks.forEach((e: number) => {
      this.tasks[e].selected = this.selectedAll;
      this.selectedTasks.push(idTask);
    });
  }

  checkIfAllSelected() {
    this.selectedAll = this.tasks.every((item: any) => {
      return item.selected === true;
    });
  }

  editTask(idTask: number) {
    this.idTask = idTask;
    this.addTaskValue = this.tasks[idTask].title;
    this.tasks[idTask].isEditable = true;
  }

  tableUp(idTask: number) {
    if (this.tasks[idTask].id > 0) {
      const temp = this.tasks[idTask];
      this.tasks[idTask] = this.tasks[idTask - 1];
      this.tasks[idTask - 1] = temp;
    }
  }

  tableDown(idTask: number) {
    if (this.tasks[idTask].id <= this.tasks.length - 1) {
      const down = this.tasks[idTask];
      this.tasks[idTask] = this.tasks[idTask + 1];
      this.tasks[idTask + 1] = down;
    }
  }
  ngOnInit() {}
  
  add(id: HTMLInputElement, name: HTMLInputElement, iscomplete: HTMLInputElement) {
    alert(id.value + ' ' + name.value + ' ' + iscomplete.value);

    const postTask: Task = {
      Id: Number(id.value),
      Name: name.value,
      IsComplete: iscomplete.value === 'on'
    };

    this.todoService.add(postTask).subscribe((response: Task) => {
     if (response) {
      this.taskList.unshift(response);
      this.görev = response;
     }
    });
  }

  delete(id: number) {
    this.todoService.delete(id).subscribe(response => {
      alert(response);
      this.getAll();
    });
  }

  getAll() {
    this.todoService.getAll().subscribe((response: Task[]) => this.taskList = response);
  }

  getSingle(id: number) {
    this.todoService.getSingle(id).subscribe((response: Task) => this.görev = response);
  }

  update(id: HTMLInputElement, name: HTMLInputElement, iscomplete: HTMLInputElement) {
    const updateTask: Task = {
      Id: Number(id.value),
      Name: name.value,
      IsComplete: iscomplete.value === 'on'
    };
    this.todoService.update(updateTask).subscribe((response: Task) => {
    if (response) {
      this.getAll();
      this.görev = response;
     }
    });
  }
}
