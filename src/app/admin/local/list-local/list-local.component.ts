import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { LocalService } from '../../../services/local.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AdminHeaderComponent } from '../../admin-header/admin-header.component';

@Component({
  selector: 'app-list-local',
  standalone: true,
  imports: [FooterComponent, AdminHeaderComponent, CommonModule, HttpClientModule],
  templateUrl: './list-local.component.html',
  styleUrl: './list-local.component.css'
})
export class ListLocalComponent implements OnInit {

  listlocal: any
  constructor(private service: LocalService, private router: Router) { }

  ngOnInit(): void {
    this.allmylocalsfromback()
  }

  allmylocalsfromback() {
    this.service.getAll().subscribe(
      (res: any) => {
        console.log("**liste de local**")
        this.listlocal = res;
      }, (error: any) => { console.log("error") }
    )
  }
 parseImages(imagesJson: string): string[] {
    try {
      return JSON.parse(imagesJson);
    } catch (e) {
      return [];
    }
  }
  viewLocal(id: string) {
  Swal.fire({
    title: 'Do you want to view details?',
    text: "This will fetch the details for this item.",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085D6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, show me!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.getById(id).subscribe(
        (res: any) => {
          console.log('Fetched data:', res);

          // ✅ Générer le HTML des images
          let imageHtml = '';
          try {
          const imageList: string[] = JSON.parse(res.image);
imageHtml = imageList.map(img => `
  <img src="http://localhost:8766/locals/files/${img}"
       style="width:80px; height:80px; margin:5px; cursor:pointer; border-radius:5px;"
       class="clickable-image"
       data-src="http://localhost:8766/locals/files/${img}">
`).join('');

          } catch (e) {
            console.warn('No images or invalid format');
          }

          // ✅ Afficher les détails avec les images
          Swal.fire({
            title: 'Details',
            html: `
              <strong>ID:</strong> ${res.id}<br>
              <strong>Name:</strong> ${res.name}<br>
              <strong>Address:</strong> ${res.adress}<br>
              <strong>Type:</strong> ${res.type}<br>
              <strong>Capacity:</strong> ${res.capacite}<br><br>
              <strong>Images:</strong><br>
              ${imageHtml}
            `,
            icon: 'info',
            didOpen: () => {
              const images = document.querySelectorAll('.clickable-image');
              images.forEach(img => {
                img.addEventListener('click', () => {
                  const src = img.getAttribute('data-src');
                  if (src) this.showFullImage(src);
                });
              });
            }
          });
        },
        (error: any) => {
          console.error("Error fetching data", error);
          Swal.fire('Error', 'Could not fetch data.', 'error');
        }
      );
    }
  });
}

showFullImage(src: string) {
  Swal.fire({
    title: 'Image',
    html: `<img src="${src}" style="width:100%; max-width:600px; border-radius:10px;">`,
    showCloseButton: true,
    showConfirmButton: false
  });
}

createLocal() {
  Swal.fire({
    title: 'Create New Local',
    html:
      `<input id="name" class="swal2-input" placeholder="Name">` +
      `<input id="adress" class="swal2-input" placeholder="Address">` +
      `<input id="type" class="swal2-input" placeholder="Type">` +
      `<input id="capacite" class="swal2-input" placeholder="Capacity" type="number">` +
      `<input id="images" type="file" class="swal2-file" multiple>`,
    showCancelButton: true,
    confirmButtonText: 'Create',
    preConfirm: () => {
      const name = (document.getElementById('name') as HTMLInputElement).value.trim();
      const adress = (document.getElementById('adress') as HTMLInputElement).value.trim();
      const type = (document.getElementById('type') as HTMLInputElement).value.trim();
      const capacite = (document.getElementById('capacite') as HTMLInputElement).value.trim();
      const imagesInput = document.getElementById('images') as HTMLInputElement;

      if (!name || !adress || !type || !capacite || !imagesInput.files?.length) {
        Swal.showValidationMessage('All fields including images are required');
        return;
      }

      return {
        name, adress, type, capacite, images: Array.from(imagesInput.files)
      };
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const formData = new FormData();
      formData.append("name", result.value.name);
      formData.append("adress", result.value.adress);
      formData.append("type", result.value.type);
      formData.append("capacite", result.value.capacite);

      // ✅ Ajouter plusieurs images avec la même clé "image"
      for (const file of result.value.images) {
        formData.append("image", file); // Le backend regroupe automatiquement
      }

      // ✅ NE PAS définir le Content-Type manuellement
      this.service.create(formData).subscribe(
        () => {
          Swal.fire('Success', 'Local created successfully!', 'success');
          this.allmylocalsfromback();
        },
        (error:any) => {
          console.error('Creation error:', error);
          Swal.fire('Error', 'Failed to create local.', 'error');
        }
      );
    }
  });
}



  editLocal(id: string) {
  this.service.getById(id).subscribe(
    (existingLocal: any) => {
      Swal.fire({
        title: 'Edit Local',
        html: `
          <input id="name" class="swal2-input" placeholder="Local Name" value="${existingLocal.name}">
          <input id="adress" class="swal2-input" placeholder="Address" value="${existingLocal.adress}">
          <input id="type" class="swal2-input" placeholder="Type" value="${existingLocal.type}">
          <input id="capacite" class="swal2-input" placeholder="Capacity" type="number" value="${existingLocal.capacite}">
          <label style="margin-top:10px;">Replace Images:</label>
          <input id="images" type="file" class="swal2-file" multiple>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        preConfirm: () => {
          const name = (document.getElementById('name') as HTMLInputElement).value.trim();
          const adress = (document.getElementById('adress') as HTMLInputElement).value.trim();
          const type = (document.getElementById('type') as HTMLInputElement).value.trim();
          const capacite = (document.getElementById('capacite') as HTMLInputElement).value.trim();
          const imagesInput = document.getElementById('images') as HTMLInputElement;

          if (!name || !adress || !type || !capacite) {
            Swal.showValidationMessage('Please fill in all fields');
            return;
          }

          return {
            name,
            adress,
            type,
            capacite,
            images: imagesInput.files ? Array.from(imagesInput.files) : []
          };
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const updatedLocal = new FormData();
          updatedLocal.append("name", result.value.name);
          updatedLocal.append("adress", result.value.adress);
          updatedLocal.append("type", result.value.type);
          updatedLocal.append("capacite", result.value.capacite);

          // ✅ Ajouter les nouvelles images si sélectionnées
          if (result.value.images.length > 0) {
            for (const file of result.value.images) {
              updatedLocal.append("image", file); // même clé que pour la création
            }
          }

          this.service.update(id, updatedLocal).subscribe(
            () => {
              Swal.fire('Updated!', 'Local has been updated.', 'success');
              this.allmylocalsfromback();
            },
            (error: any) => {
              console.error('Update error:', error);
              Swal.fire('Error', 'Failed to update local.', 'error');
            }
          );
        }
      });
    },
    (error: any) => {
      console.error('Fetch error:', error);
      Swal.fire('Error', 'Could not load local data.', 'error');
    }
  );
}

  deleteLocal(id: String) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(
          (res: any) => {
            console.log("ok");
            this.allmylocalsfromback()
          },
          (error: any) => { console.log("error is", error) }
        )
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
}
