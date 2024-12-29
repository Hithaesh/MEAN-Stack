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
  imagePreview: string;
  isLoading: boolean = false;

  form: FormGroup; 

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      'content' : new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {validators: Validators.required})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
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

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); 
    this.form.get('image').updateValueAndValidity();
    //Todo: Converting image to DataUrl to display it on the UI
    const reader = new FileReader();
    reader.onload = () => { //! Done loading on that file (onload). onload takes a function (async)
    //Type 'string | ArrayBuffer' is not assignable to type 'string'.
    //Type 'ArrayBuffer' is not assignable to type 'string'
    //* Solution: add it as string, async operation
      this.imagePreview = reader.result as string; 
    }
    reader.readAsDataURL(file); //* This methods converts the file into data URL. For Image, it can be used as src of <img> tag
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
