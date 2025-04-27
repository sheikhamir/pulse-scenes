import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostListener('document:dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drag over detected');
  }

  @HostListener('document:dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drag leave detected');
  }

  @HostListener('document:drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drop detected');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      console.log('Files dropped:', files);
      this.fileDropped.emit(files);
    }
  }
}
