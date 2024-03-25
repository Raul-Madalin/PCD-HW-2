import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketNewService {
  private socket: WebSocket;
  public messageReceived: Subject<any[]> = new Subject<any[]>();

  constructor() { 
    this.socket = new WebSocket('https://vertical-mapper-418320.oa.r.appspot.com/');

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      this.messageReceived.next(message);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any): void {
    this.socket.send(message);
  }



  closeConnection(): void {
    this.socket.close();
  }
}
