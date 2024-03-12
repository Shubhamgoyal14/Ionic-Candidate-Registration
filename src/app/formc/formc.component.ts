import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './formc.component.html',
  styleUrls: ['./formc.component.scss'],
})
export class FormcComponent {


  // Suggetion Dropdown
  suggestedSkills: string[] = ['LangChain', 'Django','Ionic', 'HTML', 'CSS', 'Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'SQL', 'Ruby', 'Swift', 'Kotlin', 'C++', 'TypeScript', 'Laravel', 'SQL', 'MySQl', 'DBMS', 'Wordpress', 'ExpresionEngine'];
  filteredSkills: string[] = [];
  selectedSkills: string[] = [];

  name: string = '';
  email: string = '';
  contactNumber: string = '';
  caddress: string = '';
  paddress: string = '';
  qualification: string = '';
  skills: string = '';
  hasExperience: string = '';
  experience: string = '';
  id : string = crypto.randomUUID();
  companyName: string = '';
  profile: string = '';
  graduationYear: string = '';
  college: string = '';
  gap: string = '';
  gapDetails: string = '';
  comment: string = '';
  date: string='';
  datePipe: any;

  constructor(private firestore: AngularFirestore, private router: Router) { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      // Iterate through form controls and mark them as touched
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      // Show a message to fill all the fields
      return; // Prevent form submission
    }


    if (form.valid) {
      const formData = {
        name: this.name,
        email: this.email,
        contactNumber: this.contactNumber,
        caddress: this.caddress,
        paddress: this.paddress,
        qualification: this.qualification,
        skills: this.skills,
        hasExperience: this.hasExperience,
        experience: this.experience,
        companyName: this.companyName,
        profile: this.profile,
        graduationYear: this.graduationYear,
        college: this.college,
        gap: this.gap,
        gapDetails: this.gapDetails,
        id: this.id,
        comment: this.comment,
        date: formatDate(new Date(), 'yyyy/MM/dd', 'en'),
      };
      this.firestore.collection('users').add(formData)
        .then(() => {
          console.log('User data added successfully!');
          form.resetForm();
          this.router.navigate(['/success']);
        })
        .catch(error => {
          console.error('Error adding user data: ', error);
        });
    }
  }

  toggleExperienceFields() {
    // Reset fields when toggling between experience and education
    this.experience = '';
    this.companyName = '';
    this.profile = '';
    this.graduationYear = '';
    this.college = '';
  }
  filterSkills(event: any) {
    const input: string = event.target.value.toLowerCase();

    // Check if input contains a comma
    if (input.includes(',')) {
      const parts: string[] = input.split(',').map((part: string) => part.trim());

      // Check each part separately for suggestions
      const uniqueSkills: string[] = [];
      parts.forEach(part => {
        if (part.length >= 2) {
          uniqueSkills.push(part);
        }
      });

      this.filteredSkills = this.suggestedSkills.filter((skill: string) =>
        uniqueSkills.some((inputSkill: string) => skill.toLowerCase().includes(inputSkill))
      );
    } else {
      // Check if input length is greater than or equal to two
      if (input.length >= 2) {
        const inputSkills: string[] = input.split(',').map((skill: string) => skill.trim());
        const filteredSelectedSkills: string[] = this.selectedSkills.filter((skill: string) =>
          !inputSkills.includes(skill.toLowerCase())
        );
        const uniqueSkills: string[] = [...new Set([...filteredSelectedSkills, ...inputSkills])];
        this.filteredSkills = this.suggestedSkills.filter((skill: string) =>
          uniqueSkills.some((inputSkill: string) => skill.toLowerCase().includes(inputSkill))
        );
      } else {
        // If input length is less than two, clear filteredSkills
        this.filteredSkills = [];
      }
    }
  }





  selectSkill(skill: string) {
    const words = this.skills.split(',').map(word => word.trim());

    if (words.length > 0) {
      const lastWord = words[words.length - 1].toLowerCase();
      const lowercaseSkill = skill.toLowerCase();
      if (lastWord && lowercaseSkill.startsWith(lastWord)) {
        // Replace the last word with the selected skill
        words[words.length - 1] = skill;
        this.skills = words.join(', ');

        // Remove selected skill from suggestedSkills
        this.suggestedSkills = this.suggestedSkills.filter(s => s !== skill);
        return;
      }
    }

    // If no partial match, append the selected skill
    this.skills = (this.skills ? this.skills + ', ' : '') + skill;

    // Remove selected skill from suggestedSkills
    this.suggestedSkills = this.suggestedSkills.filter(s => s !== skill);
  }





}
