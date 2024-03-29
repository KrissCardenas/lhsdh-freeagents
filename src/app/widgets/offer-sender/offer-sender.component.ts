import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/models/player';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-offer-sender',
  templateUrl: './offer-sender.component.html',
  styleUrls: ['./offer-sender.component.css'],
})
export class OfferSenderComponent implements OnInit {
  @Input() player: Player;

  sliderMax: number = 100;
  sliderMin: number = 0;
  sliderStep: number = 10000;
  offerValue: number = 0;

  offerTextBox = new UntypedFormControl(this.offerValue);

  constructor() {}

  ngOnInit(): void {
    if (this.player != null) {
      this.sliderMax = this.player.expectedSalary.max;
      this.sliderMin = this.player.expectedSalary.min;

      var diff =
        (this.player.expectedSalary.max - this.player.expectedSalary.min) / 2;
      this.offerValue = this.player.expectedSalary.min + diff;
    }

    //[Validators.required, Validators.max(this.sliderMax), Validators.min(this.sliderMin)]
    this.offerTextBox.setValidators([
      Validators.required,
      Validators.max(this.sliderMax),
      Validators.min(this.sliderMin),
    ]);
  }

  getErrorMessage() {
    return "Veuillez entrer une offre valide respectant l'intervalle.";
  }

  formatLabel(value: number) {
    if (value >= 1000000) {
      return value / 1000000 + 'M$';
    }
    return value;
  }

  getOfferTextBox() : UntypedFormControl{
    return this.offerTextBox;
  }

  getSliderColor(){
    if(this.player != null){
      if(this.player.status === 'UFA')
      {
        return 'primary';
      }
      if(this.player.status === 'RFA')
      {
        return 'accent';
      }
      if(this.player.status === '35+')
      {
        return 'warn';
      }
    }
  }
}
