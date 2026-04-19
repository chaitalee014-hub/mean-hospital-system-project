import { Component, ChangeDetectorRef, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements OnInit, OnDestroy {

  messages: any[] = [];
  userInput: string = '';
  isOpen = false;
  isLoading = false;

  @ViewChild('chatBody') chatBody!: ElementRef;

  private unloadHandler = () => {
    this.messages = [];
  };

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  // ✅ Proper lifecycle hook
  ngOnInit() {
    this.messages = [];
    window.addEventListener('beforeunload', this.unloadHandler);
  }

  // ✅ Clean up (VERY IMPORTANT)
  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.unloadHandler);
  }

  trackByFn(index: number) {
    return index;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'bot',
        text: '👋 Hello! I am your hospital assistant. How can I help you today?'
      });
    }

    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput;
    this.isLoading = true;

    // user message
    this.messages.push({ sender: 'user', text: message });
    this.userInput = '';

    // typing indicator
    const loadingMsg = { sender: 'bot', text: '⏳ Typing...' };
    this.messages.push(loadingMsg);

    this.scrollToBottom();

    this.http.post<any>(`${environment.apiUrl}/chatbot`, {
      message: message
    }).subscribe({
      next: (res) => {

        const index = this.messages.indexOf(loadingMsg);
        if (index > -1) this.messages.splice(index, 1);

        this.messages.push({
          sender: 'bot',
          text: res?.reply || '⚠️ No response'
        });

        this.isLoading = false;

        this.cd.detectChanges();
        this.scrollToBottom();
      },

      error: () => {
        const index = this.messages.indexOf(loadingMsg);
        if (index > -1) this.messages.splice(index, 1);

        this.messages.push({
          sender: 'bot',
          text: "⚠️ Server error"
        });

        this.isLoading = false;

        this.cd.detectChanges();
        this.scrollToBottom();
      }
    });
  }
}