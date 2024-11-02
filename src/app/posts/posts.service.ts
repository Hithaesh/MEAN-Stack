import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
}) // Alternative way is add it in, app.module.ts file in providers
// service will be created as a singleton and injected into the root module of our application
// * Restricts the instantiation of a class to a single instance and provides a global point of access to that instance.

export class PostsService {
  private Posts : Post[] = []; // Either we have to edit the original array to overcome the problem mentioned in post-list or
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}


  getPosts() {
    //return [...this.Posts]; 
    // Here we are using spread operator, but here we are not passing the Posts array because in JS, arrays use reference.
    // So, we create a copy of this array and pass it on, so it won't modify the original array.

    //Todo: Reachout to my Backend, fetch the post and store them in above Posts private array, and fire my updateListener
    // Send a HTTP Request, angular has httpClient. Import it in module.ts where httpClientModule
    // Inject Angular HttpService, inside the constructor, uses observable. So need to listen to it so subscribe. Unsubscription will be handled 
    this.httpClient.get<{message: String, posts: Post[]}>('http://localhost:3000/api/posts').
    subscribe((postData) => {
      this.Posts = postData.posts; // No need of duplicating, because it is coming from the server as a HTTP response
      this.postsUpdated.next([...this.Posts]);
    })
  }

  addPost(title: string, content: string) {
    const post = {
      id: null,
      title: title,
      content: content,
    };
    this.Posts.push(post);
    this.postsUpdated.next([...this.Posts]); //observer
    // console.log(this.postsUpdated);
    // * The functionality is asynchronous and sends the posts array reactively, meaning it operates independently of lifecycle hooks like ngOnInit.
    // next() method emits the updated data to subscribers. A Subject is a type of observable that can be listened to by specific components that need to react to data changes.
  }

  // Todo: Needs to listen to this subject, but it is private so we will create a method
  getPostUpdatedListener() {
    return this.postsUpdated.asObservable() // Passing it as an observable
  }

    //Todo: Solutions:
    //1. We don't need to send a original post, like edit the original array.
    //2. Event driven approach, EventEmitter, but based on @output Decorator, but here we can use package "RXJS"(Observables) it's Subject
    //3. Import subject(EventEmitter with broader usage) from 'rxjs'

}