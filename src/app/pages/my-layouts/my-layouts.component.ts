// angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// primeng
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
// types
import { CardLayoutModel } from '../../types/card-layout';
// services
import { CardLayoutService } from '../../services/card-layout.service';
import { ToastService } from '../../services/toast.service';
// components
import { PlaceholderGridComponent } from '../../components/placeholder-grid/placeholder-grid.component';
import { ModalCreateCardLayoutComponent } from '../../components/modal-create-card-layout/modal-create-card-layout.component';
import { CardGameLayoutComponent } from '../../components/card-game-layout/card-game-layout.component';
import { Card3dComponent } from "../../components/card-3d/card-3d.component";

@Component({
  selector: 'app-my-layouts',
  imports: [
    CardModule,
    ButtonModule,
    InputIconModule,
    CommonModule,
    PlaceholderGridComponent,
    ModalCreateCardLayoutComponent,
    CardGameLayoutComponent,
    Card3dComponent
],
  templateUrl: './my-layouts.component.html',
  styleUrl: './my-layouts.component.css',
})
export class MyLayoutsComponent implements OnInit {
  showCreateCardLayoutModal = false;
  cardLayouts: CardLayoutModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardLayoutService: CardLayoutService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.loadCardLayouts();
  }

  loadCardLayouts() {
    this.cardLayoutService
      .getCardLayouts()
      .then((cardLayouts) => {
        this.cardLayouts = cardLayouts;
      })
      .catch(() => {
        this.toastService.showErrorToast(
          'Erro ao carregar os jogos',
          'Houve um erro ao carregar os jogos!'
        );
      });
  }

  showModal() {
    this.showCreateCardLayoutModal = true;
  }

  goToCreateLayoutPage(id: string) {
    this.router.navigate(['create-layout', id], {
      relativeTo: this.route,
    });
  }
}
