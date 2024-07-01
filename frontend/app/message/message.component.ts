// message.component.ts

import {Component, OnInit} from '@angular/core';
import {MessageService} from '../message.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  userId: any = localStorage.getItem('user_id'); // Replace with the current user's ID
  selectedUserId: number; // User ID of the currently selected chat partner
  inbox: any[] = [];
  chatHistory: any[] = [];
  newMessageContent: string = '';
  uniqueUserIds: { senderId: number; productId: number }[] = [];
  private productId: number;

  constructor(private messageService: MessageService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Load initial inbox
    this.messageService.getInbox(this.userId).subscribe(
      (inbox: any[]) => {
        this.inbox = inbox;
        this.extractUniqueUserIds();
      },
      error => {
        console.error('Error fetching inbox:', error);
      }
    );
    this.loadInbox();
    setTimeout(() => {
      this.route.queryParamMap.subscribe(params => {
        // Access individual query parameters
        const productId = +params.get('productId');
        const sellerId = +params.get('sellerId');

        // Now you can use these values in your component logic
        const result = this.inbox.find(entry => {
          console.log(entry.product.id, productId);
          console.log(entry.sender.id, sellerId);
          return (
            (entry.product && entry.product.id == productId) &&
            ((entry.sender && entry.sender.id == sellerId) || (entry.receiver && entry.receiver.id == sellerId))
          );
        });

        if (result) {
          console.log('Found:', result);
          this.selectUser(sellerId, productId);
          // Do something with the result
        } else {
          console.log('Not found');
          this.selectedUserId = sellerId;
          this.productId = productId;

        }
      });
    }, 500);
  }

  extractUniqueUserIds(): void {
    // Extract unique user IDs and product IDs from inbox messages
    const uniqueEntries = Array.from(new Set(this.inbox.map(message => `${message.sender.id}_${message.product.id}`)));

    // Split the unique entries to get sender IDs and product IDs separately
    this.uniqueUserIds = uniqueEntries.map(entry => {
      const [senderId, productId] = entry.split('_');
      return {senderId: +senderId, productId: +productId};
    });
  }

  isUsernameBlurCondition(entry: any): boolean {
    // Check the conditions related to product bids and bidder's status
    const product = this.getProductByUserIdAndProductId(entry.senderId, entry.productId);
    if (product && product.bids && product.bids.bidStatus == 'CLOSED') {
      // Check if the bidder's ID or the seller's ID matches the logged-in user ID this.selectedUserId
      const isBidder = product.bids.bidders.find(b => b.bidder.id == this.userId && b.status == true);
      const isSeller = product.bids.seller.id == this.userId && product.bids.bidders.find(b => b.bidder.id == entry.senderId && b.status == true);

      return isBidder !== undefined || isSeller;
    }
    return false;
  }

  isUsernameBlurConditionHistory(entry: any): boolean {
    // Check the conditions related to product bids and bidder's status
    const product = entry.product;
    console.log(product);
    if (product && product.bids && product.bids.bidStatus == 'CLOSED') {
      // Check if the bidder's ID or the seller's ID matches the logged-in user ID
      const isBidder = product.bids.bidders.find(b => b.bidder.id == this.userId && b.status == true);
      const isSeller = product.bids.seller.id == this.userId && product.bids.bidders.find(b => b.bidder.id == this.selectedUserId && b.status == true);
      return isBidder !== undefined || isSeller;
    }
    return false;
  }

  getProductByUserIdAndProductId(userId: number, productId: number): any | undefined {
    // Find the inbox entry for the given user ID and product ID
    const userInboxEntry = this.inbox.find(entry => entry.sender.id === userId && entry.product.id === productId);
    // Return the associated product details if found
    return userInboxEntry?.product;
  }

  loadInbox() {
    this.messageService.getInbox(this.userId).subscribe(
      (data) => {
        this.inbox = data;
        // Select the first user in the inbox (if available)
        // if (this.inbox.length > 0) {
        //   this.selectUser(this.inbox[0].sender.id);
        // }
      },
      (error) => {
        console.error('Error fetching inbox:', error);
      }
    );
  }

  selectUser(userId: number, productId: number) {
    this.selectedUserId = userId;
    this.productId = productId;
    const entry = {senderId: +userId, productId: +productId};
    this.isUsernameBlurCondition(entry);
    // Load chat history with the selected user
    this.loadChatHistory();
  }

  loadChatHistory() {
    if (this.selectedUserId) {
      this.messageService.getChatHistory(this.userId, this.selectedUserId, this.productId).subscribe(
        (data) => {
          this.chatHistory = data;
        },
        (error) => {
          console.error('Error fetching chat history:', error);
        }
      );
    }
  }

  getUserById(senderId: number): any {

    return this.inbox.find(message =>
      message.sender.id === senderId)?.sender;
  }

  sendMessage() {
    if (!this.selectedUserId) {
      console.error('No user selected for sending messages.');
      return;
    }

    const messageRequest = {
      senderId: this.userId,
      receiverId: this.selectedUserId,
      content: this.newMessageContent,
      productId: this.productId
    };

    this.messageService.sendMessage(messageRequest).subscribe(
      (data) => {
        console.log('Message sent successfully:', data);
        // Refresh the inbox and chat history after sending a new message
        this.loadInbox();
        this.loadChatHistory();
        setTimeout(() => {
          this.extractUniqueUserIds();
        }, 500);
        // Clear the message input
        this.newMessageContent = '';
      },
      (error) => {
        console.error('Error sending message:', error);
      }
    );
  }
}
