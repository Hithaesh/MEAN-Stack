import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
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

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        //Todo: We added it here because we are FETCHING DATA FROM THE SERVER
        //* Here we are adding the loading spinner so we can see when we are FETCHING THE POST. 
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
        //* Hide it when we got the RESULT.
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
        })
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    //? Reason why we will not update the isLoading = false ?
    //* Because we will be navigating to the other page. When the component is loaded, isLoading is set to false.
    if(this.mode === 'create'){
      this.postsService.addPost(form.value.title, form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    //Todo: Resetting the form
    form.resetForm();
  }
}
