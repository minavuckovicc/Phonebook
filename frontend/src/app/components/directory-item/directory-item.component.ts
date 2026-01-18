import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss']
})
export class DirectoryItemComponent implements OnInit {

  @Input() user: User | null = null;
  @Output() onClick: EventEmitter<User> = new EventEmitter<User>();

  constructor() {}

  ngOnInit(): void {
    
  }

  clicked() {
    if(this.user){
      this.onClick.emit(this.user);
    }
  }

}
