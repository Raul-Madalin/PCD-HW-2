import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, retry, takeUntil, tap, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
    private websocketSubject=webSocket('ws://vertical-mapper-418320.oa.r.appspot.com/ws');
    private socket$ = this.websocketSubject.asObservable();

    private messageListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    public messageList$: Observable<any[]> = this.messageListSubject.asObservable();
  
    
    subscribe() {
      // this.socket$.subscribe({
      //   next: msg => {console.log('Received message CTOR: ', msg);
      //   const currentList = this.messageListSubject.getValue();
      //   this.messageListSubject.next([...currentList, msg]);}, // Called whenever there is a message from the server.
      //   error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      //   complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
      //  });

      this.socket$.pipe(
          catchError((error) => {console.log("error"); return throwError(() => new Error(error));}),
          retry({delay: 5_000}),
        )
        .subscribe(
          (msg: any) => {console.log('Received message CTOR: ', msg);
          // const currentList = this.messageListSubject.getValue();
          this.messageListSubject.next(msg);
        }, // Called whenever there is a message from the server.
          );
      // this.socket$.subscribe(
      //   (data) => {
      //     console.log('Received data:', data);
      //     // Process the received data here
      //   },
      //   (error) => {
      //     console.error('WebSocket error:', error);
      //   }
      // );
    }
  
    public sendMessage(message: any, id: any): void {
      this.websocketSubject.next(message);
      var currentList = this.messageListSubject.getValue();
      const indexToRemove = currentList.findIndex(item => item["id"] === id); // Find the index of the item to remove
      if (indexToRemove !== -1) { // Check if the item exists in the list
        currentList.splice(indexToRemove, 1); // Remove the item from the list
        this.messageListSubject.next(currentList);
      }
  }

  clear(): void {
    var currentList = this.messageListSubject.getValue();
    for (var index =0 ; index < currentList.length; index++) {
      currentList.pop();
    }
    this.messageListSubject.next(currentList);
  }
}
