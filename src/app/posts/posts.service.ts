import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private Posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

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

  addPost(title: string, content: string) {
    const post = {
      id: null,
      title: title,
      content: content,
    };
    this.httpClient
      .post<{ message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        post.id = response.postId; //* Here we are not changing the data of "const" datatype, we are assigning it.
        this.Posts.push(post);
        this.postsUpdated.next([...this.Posts]);
      });
  }

  deletePost(postId: string) {
    this.httpClient.delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.Posts.filter((post) => post.id !== postId);
      this.Posts = updatedPosts;
      this.postsUpdated.next([...this.Posts]);
    })
  }

  //Todo: We can see in the network tab that we are passing id: null
  //* Condition-1: When creating for the first time, id:null. When we reload, but we are mapping the _id = id so it is not throwing Error.
  //* Condition-2: When we try to delete it, it is throwing Error as:
  //! Cast to ObjectId failed for value "null" (type string) at path "_id" for model "Post"
  //* To resolve: 
  //* Solution-1: We can call the getPosts() method, once adding the post, but redudant task of updating all the posts when adding 1 post.
  //* Solution-2: When addding it in DB, let's return the _id alone so we can map it when subscribing to the POST(addPosts method)
}
