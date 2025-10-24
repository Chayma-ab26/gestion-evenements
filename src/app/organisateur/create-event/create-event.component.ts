import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { HeaderOrgComponent } from '../header-org/header-org.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FooterComponent, HeaderOrgComponent, CommonModule, HttpClientModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  listevents: any[] = [];
   filteredEvents: any[] = [];
   selectedStatus: string = 'all';
   statuses: string[] = ['all', 'ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED'];
   categories: any[] = [];
   locals: any[] = [];

   constructor(
     private eventService: EventService,
     private categoryService: CategoryService,
     private localService: LocalService,
     private router: Router
   ) { }

   ngOnInit(): void {
     this.loadCategoriesAndLocals();
     this.allmyeventsfromback()
   }

   loadCategoriesAndLocals() {
     // Charger les catégories
     this.categoryService.getAll().subscribe(
       (categories: any) => {
         this.categories = categories;
         this.enrichEventsIfNeeded();
       },
       (error: any) => console.log("Erreur chargement catégories", error)
     );

     // Charger les locaux
     this.localService.getAll().subscribe(
       (locals: any) => {
         this.locals = locals;
         this.enrichEventsIfNeeded();
       },
       (error: any) => console.log("Erreur chargement locaux", error)
     );
   }

   enrichEventsIfNeeded() {
     // Enrichir les événements seulement si on a les catégories et locaux
     if (this.categories.length > 0 && this.locals.length > 0 && this.listevents.length > 0) {
       this.listevents = this.enrichEventsWithDetails(this.listevents);
       this.filterEvents();
     }
   }

   enrichEventsWithDetails(events: any[]) {
     return events.map(event => {
       const category = this.categories.find(cat => cat.id == event.categoryId);
       const local = this.locals.find(loc => loc.id == event.localId);

       return {
         ...event,
         category: category || null,
         local: local || null
       };
     });
   }

  allmyeventsfromback() {
  this.eventService.getAll().subscribe(
    (res: any) => {
      console.log("Liste des événements récupérée");
      this.listevents = res;
      // Enrichissez les données si nécessaire
      if (this.categories.length > 0 && this.locals.length > 0) {
        this.listevents = this.enrichEventsWithDetails(this.listevents);
      }
      this.filterEvents();
    },
    (error: any) => {
      console.log("Erreur de chargement", error);
      // Gestion d'erreur
    }
  );
}

   filterEvents() {
     if (this.selectedStatus === 'all') {
       this.filteredEvents = this.listevents;
     } else {
       this.filteredEvents = this.listevents.filter(event => event.status === this.selectedStatus);
     }
   }

   onStatusChange() {
     this.filterEvents();
   }

   viewEvent(id: string) {
  Swal.fire({
    title: 'Do you want to view details?',
    text: "This will fetch the details for this event.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085D6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, show me!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.eventService.getEventWithCategoryAndLocal(id).subscribe(
        (res: any) => {
          console.log('Fetched event data:', res);
         const priceDisplay = res.prix > 0 ? 
     `${res.prix} €` : 
      '<span style="color: green; font-weight: bold;">Gratuit</span>';

          Swal.fire({
            title: 'Event Details',
            html: `
              <div style="text-align: left;">
                <strong>ID:</strong> ${res.id}<br>
                <strong>Title:</strong> ${res.title}<br>
                <strong>Description:</strong> ${res.description}<br>
                <strong>Start Date:</strong> ${res.datedebut}<br>
                <strong>End Date:</strong> ${res.datefin}<br>
                <strong>Price:</strong> ${priceDisplay}<br>
                <strong>Status:</strong> <span class="badge badge-${this.getStatusBadgeClass(res.status)}">${res.status}</span><br>
                <strong>Category:</strong> ${res.category?.name || 'N/A'}<br>
                <strong>Local:</strong> ${res.local?.name || 'N/A'}<br>
                <strong>Organizer ID:</strong> ${res.userId || 'N/A'}
              </div>
            `,
            icon: 'info'
          });
        },
        (error: any) => {
          console.error("Error fetching data", error);
          Swal.fire('Error', 'Could not fetch event data.', 'error');
        }
      );
    }
  });
}

     getStatusBadgeClass(status: string): string {
       switch (status) {
         case 'ACTIVE': return 'success';
         case 'INACTIVE': return 'secondary';
         case 'PENDING': return 'warning';
         case 'COMPLETED': return 'info';
         default: return 'secondary';
       }
     }

     getStatusDisplayName(status: string): string {
       switch (status) {
         case 'ACTIVE': return 'Active';
         case 'INACTIVE': return 'Inactive';
         case 'PENDING': return 'Pending';
         case 'COMPLETED': return 'Completed';
         default: return status;
       }
     }

     formatDate(dateString: string): string {
       if (!dateString) return 'N/A';
       const date = new Date(dateString);
       return date.toLocaleDateString('fr-FR', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
       });
     }


createEvent() {
  Swal.fire({
    title: 'Créer un événement',
    html: `
      <input id="title" class="swal2-input" placeholder="Titre" required>
      <textarea id="description" class="swal2-textarea" placeholder="Description" required></textarea>
      <input id="datedebut" type="datetime-local" class="swal2-input" required>
      <input id="datefin" type="datetime-local" class="swal2-input" required>
      
      <!-- CORRECTION : Checkbox NON coché par défaut -->
      <div class="price-container" style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
        <input id="price" type="number" class="swal2-input" placeholder="Prix (€)" min="0" step="0.01" style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 5px;">
          <input id="isFree" type="checkbox" style="margin: 0;"> <!-- Pas de 'checked' -->
          <label for="isFree" style="font-size: 14px; color: #666;">Gratuit</label>
        </div>
      </div>
      
      <select id="status" class="swal2-input" required>
        <option value="">-- Statut --</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <select id="categoryId" class="swal2-input" required>
        <option value="">-- Catégorie --</option>
        ${this.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
      </select>
      <select id="localId" class="swal2-input" required>
        <option value="">-- Local --</option>
        ${this.locals.map(loc => `<option value="${loc.id}">${loc.name}</option>`).join('')}
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Créer',
    didOpen: () => {
      // CORRECTION : Le checkbox n'est PAS coché par défaut
      const priceInput = document.getElementById('price') as HTMLInputElement;
      const freeCheckbox = document.getElementById('isFree') as HTMLInputElement;
      
      // Par défaut, le prix n'est pas désactivé
      priceInput.disabled = false;
      freeCheckbox.checked = false; // S'assurer qu'il n'est pas coché
      
      freeCheckbox.addEventListener('change', () => {
        if (freeCheckbox.checked) {
          priceInput.value = '0';
          priceInput.disabled = true;
          priceInput.placeholder = 'Gratuit';
        } else {
          priceInput.disabled = false;
          priceInput.placeholder = 'Prix (€)';
          priceInput.value = ''; // Réinitialiser
        }
      });
    },
    preConfirm: () => {
      const getValue = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        return el?.value?.trim();
      };

      const getNumberValue = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement;
        return el?.value ? parseFloat(el.value) : null;
      };

      const freeCheckbox = document.getElementById('isFree') as HTMLInputElement;
      const isFree = freeCheckbox?.checked;

      // CORRECTION : Toujours récupérer la valeur du champ prix
      const priceValue = getNumberValue('price');
      
      console.log('Checkbox gratuit:', isFree);
      console.log('Valeur prix:', priceValue);

      const values = {
        title: getValue('title'),
        description: getValue('description'),
        datedebut: getValue('datedebut'),
        datefin: getValue('datefin'),
        prix: isFree ? 0 : (priceValue !== null && priceValue !== undefined ? priceValue : 0),
        status: getValue('status'),
        categoryId: getValue('categoryId'),
        localId: getValue('localId'),
        userId: "1"
      };

      console.log('Données finales:', values);

      // Validation des champs requis
      const requiredFields = ['title', 'description', 'datedebut', 'datefin', 'status', 'categoryId', 'localId'];
      for (const field of requiredFields) {
        if (!values[field as keyof typeof values]) {
          Swal.showValidationMessage(`Le champ ${field} est requis`);
          return false;
        }
      }

      // CORRECTION : Validation du prix seulement si NON gratuit
      if (!isFree) {
        if (priceValue === null || priceValue === undefined || priceValue === 0) {
          Swal.showValidationMessage('Veuillez saisir un prix supérieur à 0 ou cocher "Gratuit"');
          return false;
        }
        if (priceValue < 0) {
          Swal.showValidationMessage('Le prix doit être un nombre positif');
          return false;
        }
      }

      // Conversion et validation des dates
      try {
        const formatForBackend = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          const pad = (num: number) => num.toString().padStart(2, '0');

          return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
        };

        const startDate = formatForBackend(values.datedebut);
        const endDate = formatForBackend(values.datefin);

        if (!startDate || !endDate) {
          Swal.showValidationMessage('Format de date invalide');
          return false;
        }

        if (new Date(values.datedebut) >= new Date(values.datefin)) {
          Swal.showValidationMessage('La date de fin doit être postérieure à la date de début');
          return false;
        }

        return {
          ...values,
          datedebut: startDate,
          datefin: endDate
        };
      } catch (e) {
        Swal.showValidationMessage('Format de date invalide');
        return false;
      }
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const eventData = result.value;
      console.log('Données FINALES à envoyer:', eventData);

      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      this.eventService.create(formData).subscribe({
        next: (res:any) => {
          Swal.fire('Succès!', 'Événement créé avec succès', 'success');
          this.allmyeventsfromback();
        },
        error: (err:any) => {
          console.error('Erreur création:', err);
          Swal.fire('Erreur', err.error?.message || 'Échec de la création', 'error');
        }
      });
    }
  });
}

editEvent(id: string) {
  this.eventService.getEventWithCategoryAndLocal(id).subscribe({
    next: (event: any) => {
      if (!this.categories.length || !this.locals.length || !this.statuses.length) {
        Swal.fire('Erreur', 'Les données nécessaires ne sont pas encore chargées', 'error');
        return;
      }

      const formatForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      // CORRECTION : Déterminer si c'est gratuit
      const isFree = event.price === 0 || event.price === null || event.price === undefined;
      const priceValue = isFree ? '' : event.price;

      Swal.fire({
        title: 'Modifier événement',
        html: `
          <input id="title" class="swal2-input" value="${this.escapeHtml(event.title) || ''}" placeholder="Titre" required>
          <textarea id="description" class="swal2-textarea" placeholder="Description" required>${this.escapeHtml(event.description) || ''}</textarea>
          <input id="datedebut" type="datetime-local" class="swal2-input" value="${event.datedebut ? formatForInput(event.datedebut) : ''}" required>
          <input id="datefin" type="datetime-local" class="swal2-input" value="${event.datefin ? formatForInput(event.datefin) : ''}" required>
          
          <!-- Champ Prix corrigé -->
          <div class="price-container" style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
            <input id="price" type="number" class="swal2-input" 
                   value="${priceValue}" 
                   placeholder="Prix (€)" min="0" step="0.01" style="flex: 1;"
                   ${isFree ? 'disabled' : ''}>
            <div style="display: flex; align-items: center; gap: 5px;">
              <input id="isFree" type="checkbox" ${isFree ? 'checked' : ''} style="margin: 0;">
              <label for="isFree" style="font-size: 14px; color: #666;">Gratuit</label>
            </div>
          </div>
          
          <select id="status" class="swal2-input" required>
            <option value="">-- Statut --</option>
            ${this.statuses
              .filter(s => s !== 'all')
              .map(s => `<option value="${s}" ${event.status === s ? 'selected' : ''}>${this.getStatusDisplayName(s)}</option>`).join('')}
          </select>
          <select id="categoryId" class="swal2-input" required>
            <option value="">-- Catégorie --</option>
            ${this.categories.map(cat => `<option value="${cat.id}" ${event.categoryId == cat.id ? 'selected' : ''}>${this.escapeHtml(cat.name)}</option>`).join('')}
          </select>
          <select id="localId" class="swal2-input" required>
            <option value="">-- Local --</option>
            ${this.locals.map(loc => `<option value="${loc.id}" ${event.localId == loc.id ? 'selected' : ''}>${this.escapeHtml(loc.name)}</option>`).join('')}
          </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Modifier',
        didOpen: () => {
          // Gérer la logique du checkbox "Gratuit" - CORRIGÉ
          const priceInput = document.getElementById('price') as HTMLInputElement;
          const freeCheckbox = document.getElementById('isFree') as HTMLInputElement;
          
          freeCheckbox.addEventListener('change', () => {
            if (freeCheckbox.checked) {
              priceInput.value = '0';
              priceInput.disabled = true;
              priceInput.placeholder = 'Gratuit';
            } else {
              priceInput.disabled = false;
              priceInput.placeholder = 'Prix (€)';
              // Ne pas réinitialiser si l'utilisateur avait déjà saisi un prix
              if (priceInput.value === '0') {
                priceInput.value = '';
              }
            }
          });
        },
        preConfirm: () => {
          const getValue = (id: string) => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            return el?.value?.trim();
          };

          const getNumberValue = (id: string) => {
            const el = document.getElementById(id) as HTMLInputElement;
            return el?.value ? parseFloat(el.value) : null;
          };

          const freeCheckbox = document.getElementById('isFree') as HTMLInputElement;
          const isFree = freeCheckbox?.checked;

          // CORRECTION : Récupérer la valeur AVANT de décider
          const priceValue = getNumberValue('price');

          const rawValues = {
            title: getValue('title'),
            description: getValue('description'),
            datedebut: getValue('datedebut'),
            datefin: getValue('datefin'),
            prix: isFree ? 0 : (priceValue !== null ? priceValue : 0), 
            status: getValue('status'),
            categoryId: getValue('categoryId'),
            localId: getValue('localId'),
            userId: event.userId
          };

          for (const [key, value] of Object.entries(rawValues)) {
            if (!value && key !== 'userId' && key !== 'price') {
              Swal.showValidationMessage(`Le champ ${key} est requis`);
              return false;
            }
          }

          // Validation du prix - CORRIGÉ
          if (!isFree) {
            if (priceValue === null || priceValue === undefined) {
              Swal.showValidationMessage('Veuillez saisir un prix ou cocher "Gratuit"');
              return false;
            }
            if (priceValue < 0) {
              Swal.showValidationMessage('Le prix doit être un nombre positif');
              return false;
            }
          }

          const startDate = new Date(rawValues.datedebut);
          const endDate = new Date(rawValues.datefin);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            Swal.showValidationMessage('Les dates sont invalides');
            return false;
          }

          if (startDate >= endDate) {
            Swal.showValidationMessage('La date de fin doit être postérieure à la date de début');
            return false;
          }

          const formatForBackend = (date: Date) => {
            const pad = (num: number) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
          };

          return {
            ...rawValues,
            datedebut: formatForBackend(startDate),
            datefin: formatForBackend(endDate)
          };
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const formData = new FormData();
          Object.entries(result.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value.toString());
            }
          });

          this.eventService.update(id, formData).subscribe({
            next: () => {
              Swal.fire('Succès!', 'Événement modifié avec succès', 'success');
              this.allmyeventsfromback();
            },
            error: (err: any) => {
              console.error('Erreur modification:', err);
              const errorMsg = err.error?.message || err.message || 'Échec de la modification';
              Swal.fire('Erreur', errorMsg, 'error');
            }
          });
        }
      });
    },
    error: (err) => {
      Swal.fire('Erreur', 'Impossible de charger les détails de l\'événement', 'error');
    }
  });
}
// Méthode utilitaire pour échapper le HTML
private escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

  deleteEvent(id: string) {
    Swal.fire({
      title: 'Supprimer ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !'
    }).then(result => {
      if (result.isConfirmed) {
        this.eventService.delete(id).subscribe(
          () => {
            Swal.fire('Supprimé', 'Événement supprimé', 'success');
            this.allmyeventsfromback();
          },
          error => {
            Swal.fire('Erreur', 'Échec de la suppression', 'error');
          }
        );
      }
    });
  }

  changeEventStatus(event: any) {
    Swal.fire({
      title: 'Changer le statut',
      html: `
        <select id="newStatus" class="swal2-input">
          <option value="">-- Choisir un statut --</option>
          <option value="ACTIVE" ${event.status === 'ACTIVE' ? 'selected' : ''}>Actif</option>
          <option value="INACTIVE" ${event.status === 'INACTIVE' ? 'selected' : ''}>Inactif</option>
          <option value="PENDING" ${event.status === 'PENDING' ? 'selected' : ''}>En attente</option>
          <option value="COMPLETED" ${event.status === 'COMPLETED' ? 'selected' : ''}>Terminé</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Changer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const newStatus = (document.getElementById('newStatus') as HTMLSelectElement)?.value;
        if (!newStatus) {
          Swal.showValidationMessage('Veuillez sélectionner un statut');
          return false;
        }
        return newStatus;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newStatus = result.value;

       /*  this.eventService.updateStatus(event.id + '', newStatus).subscribe({
          next: () => {
            Swal.fire('Succès!', `Statut changé vers ${newStatus}`, 'success');
            this.allmyeventsfromback(); // Recharger la liste
          },
          error: (err) => {
            console.error('Erreur changement statut:', err);
            Swal.fire('Erreur', err.error?.message || 'Échec du changement de statut', 'error');
          }
        }); */
      }
    });
  }
}
