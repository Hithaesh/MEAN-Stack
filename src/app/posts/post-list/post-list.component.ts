import { Component, Input} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  // posts = [
  //   {
  //     title: 'First Post',
  //     content: 'This is the first post\'s contents',
  //   },
  //   {
  //     title: 'Second Post',
  //     content: 'This is the second post\'s contents',
  //   },
  //   {
  //     title: 'Third Post',
  //     content: 'This is the third post\'s contents',
  //   }
  // ]

  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  //Todo: Getting Posts from the service file to populate in UI
  //* Firstly, we are supposed to inject(dependency Injection) the service file when the component is created, so use constructor and initialize it, import Service file
  //* Adding public, or private to this variable will help us not to create a variable inside the class

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.posts = this.postsService.getPosts();
  }

}
