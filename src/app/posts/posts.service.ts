import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private Posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    this.httpClient
      .get<{ message: String; Posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.Posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        });
      }))
      .subscribe((transformedPosts) => {
        this.Posts = transformedPosts;
        this.postsUpdated.next([...this.Posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.httpClient
      .post<{ message: string, post: Post}>('http://localhost:3000/api/posts', postData) 
      .subscribe((response) => {
        const post: Post = {
          id: response.post.id, 
          title: title,  
          content: content, 
          imagePath: response.post.imagePath
        };
        this.Posts.push(post);

        this.postsUpdated.next([...this.Posts]); 

        this.router.navigate(["/"]); 
      });
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
    //Todo: Here we have 2 conditions because we might ADD a new image or we don't:
    //* 1. If we get "STRING IMAGE", then we can send it as a JSON object
    //* 2. If we get a "FILE", then we have to create a new Form Data

    let postData : Post | FormData;
    if(typeof(image) === 'object') {
      //*Note: It's a file, we cannot check ==='File', it returns an object.
      // Create a new FormData()
      postData = new FormData();
      postData.append("id", id);
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe( (response) => {
      const updatedPosts = [...this.Posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      //Creating a updated post
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      }
      updatedPosts[oldPostIndex] = post;
      this.Posts = updatedPosts;
      this.postsUpdated.next([...this.Posts]);
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string) {
    this.httpClient.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.Posts.filter((post) => post.id !== postId);
      this.Posts = updatedPosts;
      this.postsUpdated.next([...this.Posts]);
    })
  }
}
