import { Component, EventEmitter, Output} from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent {
  // Creating a dummy content
  // syntax: no use of var, const, let
  newPost = 'No content'

  //Todo: Another way to set data, two-way binding
  // Add it in app.module.ts file inside the imports as "FormsModule"
  enteredValue = '';

  onAddPost(postInput: HTMLTextAreaElement) { // Naming convention, when dealing with trigger events, start the method or variable name with "on"
    
    //Todo: To overwrite the newPost variable, we use ".this" keyword
    this.newPost = 'The user\'s post';

    // output the postInput (Local reference variable) called as template variable, which is a JAVASCRIPT OBJECT, and its a property, not attribute
    // postInput.value = 'hold the context'
    console.log(postInput);
    console.dir(postInput.value);

    //Todo: Assigning it to this.newPost, when clicking on the button.
    this.newPost = postInput.value;

    //Todo: Another way to set data, two-way binding
    // Combines setting and reading the input
  }

  // onAddingPost() {
  //   this.newPost = this.enteredValue;
  // }

  //Todo: Adding to take input TITLE, CONTENT
  // enteredContent = ''
  // enteredTitle = ''
  // @Output() postCreated = new EventEmitter<Post>();


  // onAddingPost(form: NgForm) {
  //   if(form.invalid) {
  //     return;
  //   }
  //   const post: Post = {
  //     title : form.value.title,
  //     content: form.value.content
  //   };
  //   this.postCreated.emit(post);
  // }


  //Todo: Adding, and passing the values to the Service file
  enteredContent = '';
  enteredTitle = '';

  constructor(public postsService: PostsService) {}

  onAddingPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);

    //Todo: Resetting the form
    form.resetForm();

    //Todo: EDIT, DELETE Button on the expansion panel, in angular material docs there is an Action Bar
  }
}
