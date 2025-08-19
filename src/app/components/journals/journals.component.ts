import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { JournalEntry } from '../../model/journal-entry';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.css'
})
export class JournalsComponent {

  journals: JournalEntry[] = [];
  editForm!: FormGroup;
  selectedEntry!: JournalEntry | null;
  deleteId: number | null = null;
  notification: string | null = null;
  createForm: FormGroup;
  private createModal: any;

  //pagination
  currentPage = 1;
  pageSize = 5;  // show 5 per page
  totalPages = 0;
  paginatedJournals: JournalEntry[] = [];

  constructor(private fb: FormBuilder, private journalService: IntegrationService) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      sentiment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadJournals();
    this.editForm = this.fb.group({
      title: [''],
      content: [''],
      sentiment: ['']
    });
  }

  loadJournals() {
    this.journalService.getAllEntries().subscribe((data) => {
      this.journals = data;
      this.totalPages = Math.ceil(this.journals.length / this.pageSize);
      this.updatePaginatedJournals();
    });
  }

  updatePaginatedJournals(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedJournals = this.journals.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedJournals();
  }

  openEdit(entry: JournalEntry) {
    this.selectedEntry = entry;
    this.editForm.patchValue(entry);
    const modal = document.getElementById('editModal');
    if (modal) new (window as any).bootstrap.Modal(modal).show();
  }

  updateEntry() {
    if (this.selectedEntry) {
      const updated = { ...this.selectedEntry, ...this.editForm.value };
      this.journalService.updateEntry(updated).subscribe(() => {
        this.loadJournals();
        alert('✅ Journal updated successfully!');
        this.closeModal('editModal');
      });
    }
  }

  confirmDelete(id: number) {
    if (confirm('⚠️ Are you sure you want to delete this entry?')) {
      this.journalService.deleteEntry(id).subscribe(() => {
        this.loadJournals();
        alert('🗑️ Journal deleted successfully!');
      });
    }
  }

  closeModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

    openCreateModal(): void {
    const modalElement = document.getElementById('createEntryModal');
    if (modalElement) {
      this.createModal = new bootstrap.Modal(modalElement);
      this.createModal.show();
    }
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid) return;

    this.journalService.createEntry(this.createForm.value).subscribe({
      next: () => {
        this.notification = '✅ Journal entry added successfully!';
        this.createModal.hide();
        this.createForm.reset();
        this.loadJournals();
      },
      error: (err) => console.error('Error creating journal', err)
    });
  }

  //======

  //  journals: JournalEntry[] = [];
  // selectedJournal: JournalEntry | null = null; // Journal being edited

  // constructor(private journalService: IntegrationService) { }

  // ngOnInit(): void {
  //   this.loadJournals();
  // }

  // // Load all journals from backend
  // loadJournals(): void {
  //   this.journalService.getAllEntries().subscribe({
  //     next: (data) => {
  //       this.journals = data;
  //     },
  //     error: (err) => console.error('Error fetching journals:', err)
  //   });
  // }

  // Open update form with existing journal
  // editJournal(journal: JournalEntry): void {
  //   this.selectedJournal = { ...journal }; // clone to avoid auto changes
  // }

  
  // Cancel editing
  // cancelEdit(): void {
  //   this.selectedJournal = null;
  // }

  // Update journal in backend
  // updateJournal(): void {
  //   if (!this.selectedJournal) return;

  //   this.journalService.updateEntry(this.selectedJournal).subscribe({
  //     next: (updated) => {
  //       // Replace updated journal in the list without reloading everything
  //       const index = this.journals.findIndex(j => j.id === updated.id);
  //       if (index !== -1) {
  //         this.journals[index] = updated;
  //       }
  //       this.selectedJournal = null; // close edit form
  //     },
  //     error: (err) => console.error('Error updating journal:', err)
  //   });
  // }

  // editJournal(journal: JournalEntry) {
  //   this.selectedJournal = { ...journal };
  // }

  // cancelEdit() {
  //   this.selectedJournal = null;
  // }

  // updateJournal() {
  //   if (this.selectedJournal) {
  //     this.journalService.updateEntry(this.selectedJournal).subscribe(() => {
  //       this.loadJournals();
  //       this.selectedJournal = null;
  //     });
  //   }
  // }

  // Delete a journal
  // deleteJournal(id: number): void {
  //   if (confirm('Are you sure you want to delete this journal?')) {
  //     this.journalService.deleteEntry(id).subscribe({
  //       next: () => {
  //         this.journals = this.journals.filter(j => j.id !== id);
  //       },
  //       error: (err) => console.error('Error deleting journal:', err)
  //     });
  //   }
  // }

  //=======


  // journals: JournalEntry[] = [];

  // newJournal: JournalEntry = {id: 0, title: '', content: '', date: '', sentiment: '' };
  // editMode = false;
  // editId?: number;
  
  // constructor(private journalService: IntegrationService) {}
  
  // ngOnInit(): void {
  //   this.loadJournals();
  // }

  // // Fetch journals from the backend
  // loadJournals(): void {
  //   this.journalService.getAllEntries().subscribe({
  //     next: (data) => {
  //       console.log('Journals Data from API:', data); // Debugging
  //       this.journals = data;
  //     },
  //     error: (err) => console.error('Failed to load journals:', err),
  //   });
  // }

  // // Delete a journal (optional)
  // deleteJournal(id: number): void {
  //   if (confirm('Are you sure you want to delete this journal?')) {
  //     this.journalService.deleteEntry(id).subscribe(() => this.loadJournals());
  //   }
  // }

  // editJournal(journal: JournalEntry): void {
  //   this.newJournal = { ...journal };
  //   this.editId = journal.id;
  //   this.editMode = true;
  // }

}
