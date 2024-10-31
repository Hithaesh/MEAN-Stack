import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy{ //! Gotta add "OnInit" here
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
  private postSub: Subscription;
  //Todo: Getting Posts from the service file to populate in UI
  //* Firstly, we are supposed to inject(dependency Injection) the service file when the component is created, so use constructor and initialize it, import Service file
  //* Adding public, or private to this variable will help us not to create a variable inside the class

  constructor(public postsService: PostsService) {}

  ngOnInit() {//! We can use constructor to call the service,
              //! but its a better practice to use lifecycle Hook angular provides when the component is created, it executes automatically.
              // Recommended to do basic initialization tasks


    this.posts = this.postsService.getPosts();
    // It does not display the data on the UI. Problem here is the posts array is empty in the Service file.
    // We fetch the posts copy of them before editing them.
    //Todo: Solutions:
    //1. We don't need to send a original post, like edit the original array.
    //2. Event driven approach, EventEmitter, but based on @output Decorator, but here we can use package "RXJS"(Observables) it's Subject
    //3. Import subject(EventEmitter with broader usage) from 'rxjs'


    //Todo: Listen to the subject, which is passed as an Observable from the service file
    //* Setting up a listener, subscriber has 3 arguments(next callback, error callback, complete callback)
    // const subscription = myObservable.subscribe(
    //   value => {
    //     console.log('Next value:', value);
    //   },
    //   error => {
    //     console.error('Error occurred:', error);
    //   },
    //   () => {
    //     console.log('Observable completed!');
    //   }
    // );
    //Todo: Subscribing to the subject which is an observable, basically listening to it
    this.postSub = this.postsService.getPostUpdatedListener().subscribe((storedPosts: Post[]) => {
      this.posts = storedPosts; // Update them whenever they receive a new value. To cancel it down, when it is not part of the DOM.
      // We will store the subscription
    })

  } 

  //Todo: UnSubscribing so to avoid memory leaks when the component is destroyed.
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
