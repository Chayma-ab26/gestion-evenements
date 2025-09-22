// event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { AvisService, Avis } from '../../services/avis.service';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderOrgComponent } from '../../organisateur/header-org/header-org.component';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [HeaderOrgComponent, FooterComponent, CommonModule, HttpClientModule]
})
export class EventListComponent implements OnInit {
  listevents: any[] = [];
  filteredEvents: any[] = [];
  categories: any[] = [];
  locals: any[] = [];
  avisList: Avis[] = [];
  isLoading = true;
  selectedRating = 0;
  hoverRating = 0;

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private localService: LocalService,
    private avisService: AvisService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Charger toutes les données en parallèle
    forkJoin({
      categories: this.categoryService.getAll() as Observable<any[]>,
      locals: this.localService.getAll() as Observable<any[]>,
      events: this.eventService.getAll() as Observable<any[]>,
/*       avis: this.avisService.getAllAvis() as Observable<Avis[]>
 */    }).subscribe({
      next: (data) => {
        console.log('=== DONNÉES BRUTES ===');
        console.log('Catégories:', data.categories);
        console.log('Locaux:', data.locals);
        console.log('Événements:', data.events);

        this.categories = data.categories || [];
        this.locals = data.locals || [];
        this.listevents = data.events || [];
/*         this.avisList = data.avis || [];
 */
        // Enrichir les événements avec les détails
        this.enrichEvents();

        // Associer les avis aux événements
        this.associateAvis();

        console.log('=== DONNÉES ENRICHIES ===');
        console.log('Événements enrichis:', this.filteredEvents);

        // Vérifier chaque événement
        this.filteredEvents.forEach((event, index) => {
          console.log(`Événement ${index + 1}:`, {
            id: event.id,
            title: event.title,
            categoryId: event.categoryId,
            localId: event.localId,
            category: event.category,
            local: event.local,
            hasImage: this.hasImage(event),
            imageUrl: this.getImageUrl(event),
            localName: this.getLocalName(event),
            categoryName: this.getCategoryName(event)
          });
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      }
    });
  }

  enrichEvents() {
    if (this.categories.length > 0 && this.locals.length > 0 && this.listevents.length > 0) {
      this.filteredEvents = this.listevents.map(event => {
        // Vérifier la structure des données
        console.log('Structure de l\'événement avant enrichissement:', event);

        // Trouver la catégorie correspondante
        const category = this.categories.find(c => c.id == event.categoryId);

        // Trouver le local correspondant
        const local = this.locals.find(l => l.id == event.localId);

        console.log(`Enrichissement événement ${event.id}:`, {
          categoryId: event.categoryId,
          localId: event.localId,
          category: category,
          local: local,
          categoryFound: !!category,
          localFound: !!local
        });

        return {
          ...event,
          category: category || null,
          local: local || null
        };
      });

      console.log('Événements enrichis:', this.filteredEvents);
    } else {
      console.warn('Données manquantes pour l\'enrichissement:', {
        categories: this.categories.length,
        locals: this.locals.length,
        events: this.listevents.length
      });
      this.filteredEvents = this.listevents;
    }
  }

  associateAvis() {
    this.filteredEvents = this.filteredEvents.map(event => {
      const eventAvis = this.avisList.filter(avis => avis.eventId === event.id);
      return {
        ...event,
        avis: eventAvis,
        averageRating: eventAvis.length > 0 ? eventAvis.reduce((sum, avis) => sum + avis.note, 0) / eventAvis.length : 0,
        totalReviews: eventAvis.length
      };
    });
  }

  participateEvent(eventId: string) {
    console.log('Participer à l\'événement ID:', eventId);

    Swal.fire({
      title: 'Participer à l\'événement',
      text: 'Voulez-vous confirmer votre participation ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, participer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulation de la participation (remplacez par votre vraie logique)
        console.log('Participation confirmée pour l\'événement:', eventId);

        // Afficher un message de succès
        Swal.fire({
          title: 'Participation confirmée !',
          text: 'Vous participez maintenant à cet événement.',
          icon: 'success',
          confirmButtonText: 'Parfait !'
        });

        // Ici vous pouvez ajouter votre logique de participation
        // Par exemple, mettre à jour l'interface, envoyer une requête au serveur, etc.
      }
    });
  }


  // Méthode utilitaire pour obtenir le local à partir de son id
  getLocalById(localId: number): any {
    return this.locals.find(l => l.id === localId);
  }

  // Méthode utilitaire pour vérifier si une image existe
  hasImage(event: any): boolean {
    const local = event.local || this.getLocalById(event.localId);
    if (!event || !local) {
      return false;
    }
    return local.images && Array.isArray(local.images) && local.images.length > 0;
  }

  // Méthode utilitaire pour obtenir l'URL de la première image
  getImageUrl(event: any): string {
    const local = event.local || this.getLocalById(event.localId);
    if (this.hasImage(event)) {
      return `api/locals/files/${local.images[0]}`;
    }
    return '';
  }

  // Méthode utilitaire pour obtenir le nom du lieu
  getLocalName(event: any): string {
    const local = event.local || this.getLocalById(event.localId);
    if (!event || !local) {
      return 'Lieu non défini';
    }
    return local.name || 'Nom du lieu manquant';
  }

  // Méthode utilitaire pour obtenir toutes les images du local
  getLocalImages(event: any): string[] {
    const local = event.local || this.getLocalById(event.localId);
    if (local && local.images && Array.isArray(local.images)) {
      return local.images;
    }
    return [];
  }

  // Méthode utilitaire pour obtenir le nom de la catégorie
  getCategoryName(event: any): string {
    if (!event || !event.category) {
      console.log('Pas de catégorie pour l\'événement:', event);
      return 'Catégorie non définie';
    }

    const categoryName = event.category.name || 'Nom de catégorie manquant';
    console.log('Nom de catégorie pour événement:', {
      eventId: event.id,
      categoryName: categoryName,
      category: event.category
    });

    return categoryName;
  }

  // Gérer les erreurs de chargement d'images
  onImageError(event: any) {
    console.warn('Erreur de chargement d\'image pour l\'événement:', event);
    // Optionnel : masquer l'image ou afficher une image par défaut
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = 'none';
      // Afficher le placeholder à la place
      const placeholder = imgElement.parentElement?.querySelector('.no-image-placeholder');
      if (placeholder) {
        (placeholder as HTMLElement).style.display = 'block';
      }
    }
  }

  // Gérer le chargement réussi des images
  onImageLoad(event: any) {
    console.log('Image chargée avec succès pour l\'événement:', event);
  }

  // Méthode pour déboguer la structure des données
  debugEventData(event: any) {
    console.log('=== DÉBOGAGE ÉVÉNEMENT ===');
    console.log('Événement complet:', event);
    console.log('Local:', event.local);
    console.log('Catégorie:', event.category);
    console.log('Images:', event.local?.images);
    console.log('hasImage:', this.hasImage(event));
    console.log('imageUrl:', this.getImageUrl(event));
    console.log('localName:', this.getLocalName(event));
    console.log('categoryName:', this.getCategoryName(event));
  }

  // Méthode pour le tracking des événements (optimisation des performances)
  trackByEventId(index: number, event: any): any {
    return event ? event.id : undefined;
  }

  // Méthode pour le paiement en ligne
  payOnline(event: any) {
    Swal.fire({
      title: 'Paiement en ligne',
      html: `
        <div class="payment-form">
          <div class="event-summary">
            <h4>${event.title}</h4>
            <p><strong>Prix:</strong> 25.00 €</p>
            <p><strong>Date:</strong> ${new Date(event.datedebut).toLocaleDateString('fr-FR')}</p>
          </div>

          <div class="payment-details">
            <h5>Informations de paiement</h5>

            <div class="form-group">
              <label>Numéro de carte</label>
              <input id="cardNumber" class="swal2-input" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date d'expiration</label>
                <input id="expiryDate" class="swal2-input" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input id="cvv" class="swal2-input" placeholder="123" maxlength="3">
              </div>
            </div>

            <div class="form-group">
              <label>Nom du titulaire</label>
              <input id="cardholderName" class="swal2-input" placeholder="Jean Dupont">
            </div>

            <div class="form-group">
              <label>Email</label>
              <input id="email" class="swal2-input" type="email" placeholder="jean.dupont@email.com">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Payer 25.00 €',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      width: '600px',
      preConfirm: () => {
        // Validation des champs
        const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement)?.value?.replace(/\s/g, '');
        const expiryDate = (document.getElementById('expiryDate') as HTMLInputElement)?.value;
        const cvv = (document.getElementById('cvv') as HTMLInputElement)?.value;
        const cardholderName = (document.getElementById('cardholderName') as HTMLInputElement)?.value;
        const email = (document.getElementById('email') as HTMLInputElement)?.value;

        if (!cardNumber || cardNumber.length < 16) {
          Swal.showValidationMessage('Numéro de carte invalide');
          return false;
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
          Swal.showValidationMessage('Date d\'expiration invalide (format MM/YY)');
          return false;
        }

        if (!cvv || cvv.length < 3) {
          Swal.showValidationMessage('CVV invalide');
          return false;
        }

        if (!cardholderName || cardholderName.length < 2) {
          Swal.showValidationMessage('Nom du titulaire invalide');
          return false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Swal.showValidationMessage('Email invalide');
          return false;
        }

        return {
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
          email,
          eventId: event.id,
          amount: 25.00
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Simulation du processus de paiement
        this.processPayment(result.value, event);
      }
    });
  }

  // Traitement du paiement
  private processPayment(paymentData: any, event: any) {
    // Afficher un indicateur de chargement
    Swal.fire({
      title: 'Traitement du paiement...',
      text: 'Veuillez patienter pendant que nous traitons votre paiement.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simulation d'un délai de traitement
    setTimeout(() => {
      // Ici vous appelleriez votre service de paiement
      console.log('Données de paiement:', paymentData);

      // Simulation d'un succès de paiement
      Swal.fire({
        title: 'Paiement réussi !',
        html: `
          <div class="success-payment">
            <i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem;"></i>
            <h4>Paiement confirmé</h4>
            <p><strong>Montant:</strong> ${paymentData.amount} €</p>
            <p><strong>Événement:</strong> ${event.title}</p>
            <p><strong>Référence:</strong> ${this.generateReference()}</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Parfait !',
        confirmButtonColor: '#28a745'
      }).then(() => {
        // Optionnel : rediriger ou mettre à jour l'interface
        console.log('Paiement terminé avec succès');
      });
    }, 2000);
  }

  // Génération d'une référence de paiement
  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PAY-${timestamp}-${random}`;
  }

  // Méthode pour envoyer un avis
  /* sendReview(event: any, reviewText: string, rating: number) {
    if (!reviewText.trim()) {
      Swal.fire('Erreur', 'Veuillez saisir un avis', 'error');
      return;
    }

    if (rating < 1 || rating > 5) {
      Swal.fire('Erreur', 'Veuillez sélectionner une note valide', 'error');
      return;
    }
 */
    // Récupérer l'ID de l'utilisateur actuel (vous devrez l'adapter selon votre système d'authentification)
   /* const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      Swal.fire('Erreur', 'Utilisateur non connecté', 'error');
      return;
    }

    // Envoyer l'avis au backend
    this.avisService.createAvis(currentUserId, event.id, rating, reviewText).subscribe({
      next: (response) => {
        console.log('Avis créé avec succès:', response);
        Swal.fire({
          title: 'Avis envoyé !',
          text: 'Merci pour votre avis. Il a été enregistré avec succès.',
          icon: 'success',
          confirmButtonText: 'Parfait !'
        }).then(() => {
          // Recharger les données pour afficher le nouvel avis
          this.loadData();
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'avis:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur s\'est produite lors de l\'envoi de votre avis.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
 */
  // Méthode pour obtenir l'ID de l'utilisateur actuel
  private getCurrentUserId(): number | null {
    // Cette méthode doit être adaptée selon votre système d'authentification
    // Pour l'instant, on retourne un ID fictif
    // TODO: Intégrer avec Keycloak ou votre système d'authentification
    return 1; // ID fictif pour les tests
  }
}
