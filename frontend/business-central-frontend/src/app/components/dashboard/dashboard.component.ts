import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ModelAsset } from '../../models/model-asset';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title>Business Central Alternative</mat-card-title>
          <mat-card-subtitle>Manage your BPMN workflows, DMN decisions, and DRL rules</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="createNew('BPMN')">
              <mat-icon>account_tree</mat-icon>
              New BPMN Workflow
            </button>
            <button mat-raised-button color="accent" (click)="createNew('DMN')">
              <mat-icon>decision</mat-icon>
              New DMN Decision
            </button>
            <button mat-raised-button color="warn" (click)="createNew('DRL')">
              <mat-icon>rule</mat-icon>
              New DRL Rules
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="assets-card">
        <mat-card-header>
          <mat-card-title>Your Assets</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="All Assets">
              <div class="assets-table">
                <table mat-table [dataSource]="allAssets" class="mat-elevation-z2">
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef>Name</th>
                    <td mat-cell *matCellDef="let asset">{{asset.name}}</td>
                  </ng-container>
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let asset">
                      <span class="asset-type-badge" [ngClass]="'type-' + asset.type.toLowerCase()">
                        {{asset.type}}
                      </span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="updatedAt">
                    <th mat-header-cell *matHeaderCellDef>Last Modified</th>
                    <td mat-cell *matCellDef="let asset">{{asset.updatedAt | date:'short'}}</td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let asset">
                      <button mat-icon-button (click)="editAsset(asset)" matTooltip="Edit">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="executeAsset(asset)" matTooltip="Execute">
                        <mat-icon>play_arrow</mat-icon>
                      </button>
                      <button mat-icon-button (click)="deleteAsset(asset)" matTooltip="Delete">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </div>
            </mat-tab>
            <mat-tab label="BPMN Workflows">
              <div class="assets-grid">
                <mat-card *ngFor="let asset of bpmnAssets" class="asset-card">
                  <mat-card-header>
                    <mat-card-title>{{asset.name}}</mat-card-title>
                    <mat-card-subtitle>{{asset.description}}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-actions>
                    <button mat-button (click)="editAsset(asset)">EDIT</button>
                    <button mat-button (click)="executeAsset(asset)">EXECUTE</button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </mat-tab>
            <mat-tab label="DMN Decisions">
              <div class="assets-grid">
                <mat-card *ngFor="let asset of dmnAssets" class="asset-card">
                  <mat-card-header>
                    <mat-card-title>{{asset.name}}</mat-card-title>
                    <mat-card-subtitle>{{asset.description}}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-actions>
                    <button mat-button (click)="editAsset(asset)">EDIT</button>
                    <button mat-button (click)="executeAsset(asset)">EXECUTE</button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </mat-tab>
            <mat-tab label="DRL Rules">
              <div class="assets-grid">
                <mat-card *ngFor="let asset of drlAssets" class="asset-card">
                  <mat-card-header>
                    <mat-card-title>{{asset.name}}</mat-card-title>
                    <mat-card-subtitle>{{asset.description}}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-actions>
                    <button mat-button (click)="editAsset(asset)">EDIT</button>
                    <button mat-button (click)="executeAsset(asset)">EXECUTE</button>
                  </mat-card-actions>
                </mat-card>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .welcome-card {
      margin-bottom: 20px;
    }
    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .action-buttons button {
      min-width: 200px;
    }
    .assets-card {
      margin-bottom: 20px;
    }
    .assets-table {
      margin-top: 16px;
    }
    .assets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .asset-card {
      min-height: 150px;
    }
    .asset-type-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .type-bpmn {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    .type-dmn {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }
    .type-drl {
      background-color: #ffebee;
      color: #d32f2f;
    }
  `]
})
export class DashboardComponent implements OnInit {
  allAssets: ModelAsset[] = [];
  bpmnAssets: ModelAsset[] = [];
  dmnAssets: ModelAsset[] = [];
  drlAssets: ModelAsset[] = [];
  displayedColumns: string[] = ['name', 'type', 'updatedAt', 'actions'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.apiService.getAllAssets().subscribe({
      next: (assets) => {
        this.allAssets = assets;
        this.bpmnAssets = assets.filter(a => a.type === 'BPMN');
        this.dmnAssets = assets.filter(a => a.type === 'DMN');
        this.drlAssets = assets.filter(a => a.type === 'DRL');
      },
      error: (error) => {
        this.snackBar.open('Failed to load assets', 'Close', { duration: 3000 });
      }
    });
  }

  createNew(type: 'BPMN' | 'DMN' | 'DRL') {
    this.router.navigate(['/editor', type.toLowerCase()]);
  }

  editAsset(asset: ModelAsset) {
    this.router.navigate(['/editor', asset.type.toLowerCase(), asset.id]);
  }

  executeAsset(asset: ModelAsset) {
    this.router.navigate(['/execute', asset.id]);
  }

  deleteAsset(asset: ModelAsset) {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      this.apiService.deleteAsset(asset.id!).subscribe({
        next: () => {
          this.snackBar.open('Asset deleted successfully', 'Close', { duration: 3000 });
          this.loadAssets();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete asset', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
