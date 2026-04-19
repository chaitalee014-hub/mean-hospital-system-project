import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { Emergency } from './pages/emergency/emergency';
import { Chatbot } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Emergency,Chatbot],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
