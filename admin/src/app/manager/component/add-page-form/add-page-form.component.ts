import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-page-form',
  templateUrl: './add-page-form.component.html',
  styleUrls: ['./add-page-form.component.css']
})
export class AddPageFormComponent implements OnInit {

  // pageName = new FormControl('');
  // pageNotes = new FormControl('');
  pageForm = new FormGroup({
    title: new FormControl('', Validators.required),
    slug: new FormControl(''),
    icon: new FormControl(''),
    active: new FormControl('true', Validators.required),
  });

  generatedSlug: string = '';

  @Input() showForm: boolean = false;

  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  closeTheForm() {
    this.closeForm.emit({form: "AddPageForm", action: "close", data: this.pageForm.value})
  }

  submitTheForm() {
    // console.log(this.pageForm.value);
    let newPage = this.pageForm.value;
    this.pageForm.patchValue({slug: this.generatedSlug})
    // Send the new page to the page-list
    this.submitForm.emit({form: "AddPageForm", action: "submit", data: this.pageForm.value});
    // Close the form
    this.closeTheForm();
    // Resets the form
    this.pageForm.reset({
      title: '',
      slug: '',
      icon: '',
      active: 'true'
    })
  }

  generateSlug() {
    let title = this.pageForm.value.title;
    if (title) {
      this.generatedSlug = title.replace(/[^a-zA-Z0-9]+/g, '-');
    }
    return '';
  }

}
