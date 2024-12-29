import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading: boolean = false;
  //* Here we define everything, such as controls and we map that to the HTML
  //! Add ReactiveFormsModule in App.Module.ts, and remove ngModel and NgForm, and FormsModule, and template references, and validators
  form: FormGroup; //* Creating a Form with the [type:FormGroup]. Default it is undefined.

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(){
    //Initialising the Form
    this.form = new FormGroup({
      //* Takes a JS object to configure the forms, key-value pairs
      //* Good practice to add ''
      //* FormControl is another constructor
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      //* All inputs are FormControls(initialValue, {})
      'content' : new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        //Todo: How to pre-populate, initial value when editing the form
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
          //* Setting up the values when updating for new posts
          this.form.setValue({
            'title' : this.post.title,
            'content' : this.post.content
          })
        })
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }
}
//? How it is working was angular will detect the form, and register controls using ngModel (Template Driven Forms)
//Todo: Switching to Reactive Forms like own Validators
