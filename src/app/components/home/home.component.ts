import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JournalEntry } from '../../model/journal-entry';
import { IntegrationService } from '../../services/integration.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Import Bootstrap Modal
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  greeting = 'Hello!';
  totalEntries = 0;
  thisMonthEntries = 0;
  lastEntryDate = 'Never';

  
  createForm: FormGroup;
  private createModal: any;

  notification: string | null = null;
  
  journalEntries: JournalEntry[] = [];
  newEntry: JournalEntry = {
    id: 0, title: '', content: '', date: '',
    sentiment: ''
  };

  @ViewChild('journalModal', { static: false }) modalElement!: ElementRef;
  private modalInstance: any;

  constructor(private fb: FormBuilder, private journalService: IntegrationService) {
    this.createForm = this.fb.group({
          title: ['', Validators.required],
          content: ['', Validators.required],
          sentiment: ['', Validators.required]
        });
  }

  ngOnInit(): void {
    this.loadRecentEntries();
    this.loadUserGreeting();
    this.loadStats();

    // Ensure modal exists in the DOM before initializing Bootstrap Modal
    setTimeout(() => {
      if (this.modalElement?.nativeElement) {
        this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
        console.log("Modal initialized successfully!");
      } else {
        console.error("Modal element is not found in the DOM!");
      }
    }, 0); // Delay execution to ensure the template is rendered
  }

  loadUserGreeting(): void {
    this.journalService.getCurrentUserGreeting().subscribe({
      next: (greeting) => {
        this.greeting = greeting;
      },
      error: (error) => {
        console.error('Error loading greeting:', error);
      }
    });
  }

  loadRecentEntries(): void {
    this.journalService.getAllEntries().subscribe({
      next: (entries) => this.journalEntries = entries,
      error: (error) => console.error('Error fetching journal entries:', error)
    });
  }

  getRecentEntries() {
  return this.journalEntries
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // newest first
    .slice(0, 3); // take only 3
}

  loadStats(): void {
    this.journalService.getAllEntries().subscribe({
      next: (entries) => {
        this.totalEntries = entries.length;
        
        // Calculate this month entries
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        this.thisMonthEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date!);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        }).length;
        
        // Get last entry date
        if (entries.length > 0) {
          const sortedEntries = entries.sort((a, b) => 
            new Date(b.date!).getTime() - new Date(a.date!).getTime()
          );
          const lastEntry = sortedEntries[0];
          const lastEntryDate = new Date(lastEntry.date!);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lastEntryDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            this.lastEntryDate = 'Today';
          } else if (diffDays === 1) {
            this.lastEntryDate = 'Yesterday';
          } else {
            this.lastEntryDate = `${diffDays} days ago`;
          }
        } else {
          this.lastEntryDate = 'Never';
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }


  addEntry(): void {
    if (this.newEntry.title && this.newEntry.content) {
      this.newEntry.date = new Date().toISOString().split('T')[0]; // Set current date
      this.journalService.createEntry(this.newEntry).subscribe(entry => {
        console.log(entry);
        this.journalEntries.unshift(entry); // Add new entry to the top
        this.newEntry = { id: 0, title: '', content: '', date: '', sentiment: '' }; // Reset form
      });
    }
  }
  
  openModal(): void {
     const modalElement = document.getElementById('createEntryModal');
        if (modalElement) {
          this.createModal = new bootstrap.Modal(modalElement);
          this.createModal.show();
        }
  }

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid) return;

    this.journalService.createEntry(this.createForm.value).subscribe({
      next: () => {
        this.notification = '✅ Journal entry added successfully!';
        this.createModal.hide();
        this.createForm.reset();
        this.loadRecentEntries();
      },
      error: (err) => console.error('Error creating journal', err)
    });
  }

}
