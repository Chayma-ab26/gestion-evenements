import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-category',
   standalone: true,
    imports: [FooterComponent,HeaderComponent,CommonModule,HttpClientModule],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent implements OnInit{

  listcategory:any
  constructor(private service:CategoryService, private router:Router){}
ngOnInit(): void {
    this.allmycategoriesfromback()
  }
  allmycategoriesfromback(){
     this.service.getAll().subscribe(
      (res:any) =>{
         console.log("**liste de category**")
         this.listcategory=res;
      },(error:any)=>{console.log("error")}
      )
  }
 viewCategory(id:String){
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
        // Display fetched details in another alert (customize as needed)
        Swal.fire({
          title: 'Details',
          html: `
            <strong>ID:</strong> ${res.id}<br>
            <strong>Name:</strong> ${res.name}<br>
            <strong>Description:</strong> ${res.description}
          `,
          icon: 'info'
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




  createCategory(){
    Swal.fire({
  title: 'Create New Category',
  html:
    `<input id="name" class="swal2-input" placeholder="Name">` +
    `<input id="description" class="swal2-input" placeholder="Description">`,
  showCancelButton: true,
  confirmButtonText: 'Create',
  preConfirm: () => {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    if (!name || !description) {
      Swal.showValidationMessage('Please fill out both fields');
      return;
    }
    return { name, description };
  }
}).then((result) => {
  if (result.isConfirmed && result.value) {
    // const newTache = {
    //   name: result.value.name,
    //   description: result.value.description
    // };
    let newTache= new FormData()
    newTache.append("name",result.value.name)
      newTache.append("description",result.value.description)
    console.log(newTache)
    this.service.create(newTache).subscribe(
      (res: any) => {
        Swal.fire('Success', 'Category created successfully!', 'success');
        this.allmycategoriesfromback(); // Refresh the list
      },
      (error: any) => {
        console.error('Creation error:', error);
        Swal.fire('Error', 'Failed to create categoryche.', 'error');
      }
    );
  }
});
  }

editCategory(id:String){
this.service.getById(id).subscribe(
  (existingCategory: any) => {
    Swal.fire({
      title: 'Edit Category',
      html: `
        <input id="name" class="swal2-input" placeholder="Category Name" value="${existingCategory.name}">
        <input id="description" class="swal2-input" placeholder="Description" value="${existingCategory.description}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLInputElement).value.trim();
        if (!name || !description) {
          Swal.showValidationMessage('Please enter both name and description');
          return;
        }
        return { name, description };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // const updatedCategory = {
        //   name: result.value.name,
        //   description: result.value.description
        // };
        let updatedCategory= new FormData()
    updatedCategory.append("name",result.value.name)
      updatedCategory.append("description",result.value.description)
    console.log(updatedCategory)
        this.service.update(id, updatedCategory).subscribe(
          (res: any) => {
            Swal.fire('Updated!', 'Category has been updated.', 'success');
            this.allmycategoriesfromback(); // refresh list if needed
          },
          (error: any) => {
            console.error('Update error:', error);
            Swal.fire('Error', 'Failed to update category.', 'error');
          }
        );
      }
    });
  },
  (error: any) => {
    console.error('Fetch error:', error);
    Swal.fire('Error', 'Could not load category data.', 'error');
  }
);
  }


  deleteCategory(id:String){
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
            this.allmycategoriesfromback()
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
