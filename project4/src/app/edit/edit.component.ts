import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public username: string;
  public post: Post;
  
  private copy: Post;
  private form: FormGroup;

  constructor( private blogService: BlogService,
                              private router: Router,
                              private activatedRoute: ActivatedRoute)
                              {this.username = this.parseJWT(document.cookie).usr; }

  ngOnInit(): void {
    let postid = this.activatedRoute.snapshot.paramMap.get('id');
    /*this.post = this.blogService.getCurrentDraft();
    if (this.post && this.post.postid === Number(postid)) {
      //this.copy = new Post(this.post);
    } else {
      console.log(Number(postid), "idid!");
      this.blogService.getPost(this.username, Number(postid)).then(res => this.post = res);
    } */
    this.activatedRoute.params.subscribe(
      params => {
        let postid = this.activatedRoute.snapshot.paramMap.get('id');
        this.post = this.blogService.getCurrentDraft();
        if (this.post && this.post.postid === Number(postid)) {
          console.log("match!");
        }else{
          console.log(Number(postid), "idid!");
         this.blogService.getPost(this.username, Number(postid)).then(res=> this.post = res);
      
        }
    }
    ) 

  }

  getPost(): void{
    this.blogService.getPost(this.username, this.post.postid).then(res => this.post = res);;

  }

  delete(): void{
    console.log("delete", this.username, this.post.postid);
    this.blogService.deletePost(this.username, this.post.postid);
    window.location.reload(true);
    this.router.navigate(['/'])

  }
  save(): void{
    console.log("save", this.username, this.post.postid, this.post.body);
    let curpost: Post[];
    this.blogService.fetchPosts(this.username).then(res => {
      //curpost = res;
      let flag = 0;
      for (let curpo in res) {
        if (Number(res[curpo].postid) === this.post.postid) {
          flag = 1;
        }
      }
      if (flag === 0) {
        this.blogService.newPost(this.username, this.post);

      } else {
        console.log("update post here.");
        this.blogService.updatePost(this.username, this.post);
      }
      console.log("save over here.");
      window.location.reload(true);
    });
    
    
  }

  preview(): void{
    this.blogService.setCurrentDraft(this.post);
    this.router.navigate(['/preview/',this.post.postid]);
}
private parseJWT(token)
  {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
  }
}
