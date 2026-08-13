import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Offer } from 'src/app/models/offer';
import { Player } from 'src/app/models/player';
import { OffersService } from 'src/app/services/offers.service';
import { PlayerMapperService } from 'src/app/services/player-mapper.service';
import { SalaryScaleService } from 'src/app/services/salary-scale.service';

@Component({
  selector: 'app-player-result',
  templateUrl: './player-result.component.html',
  styleUrls: ['./player-result.component.css']
})
export class PlayerResultComponent implements OnInit {
  @Input() player: Player;
  offers: Offer[] = [];
  winners: number[] = [];
  average: number = 0;
  bestOffer: number = 0;
  ownerOffer: number = 0;
  displayLoading: boolean = false;
  ownerWins: boolean = true;

  constructor(private offerService: OffersService, private playerMapperService: PlayerMapperService,
              private salaryScaleService: SalaryScaleService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
     this.getOffers();
  }

  getOffers() {
        this.displayLoading = true;
        this.offerService.getOffersForPlayer(this.player.uniqueID).subscribe(
        (offers) => {
          this.offers = offers;
          this.calculate();
          this.displayLoading = false;
          this.cd.markForCheck();
        },
        (error) => {
          console.error(error);
          this.displayLoading = false;
        }
      );
  }
  calculate() {
    let amounts: number[] = [];
    for (let index = 0; index < this.offers.length; index++) {
      const offer = this.offers[index];

      if(offer.isOwner){
        this.ownerOffer = offer.amount;
      }else{
        amounts.push(offer.amount);
      }
    }
    this.average = 0;
    this.bestOffer = 0;
    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

    if (amounts.length > 0) {
      const result = average(amounts);
      this.average = result;
      this.bestOffer = Math.max(...amounts);
    }

    // Un RFA se garde en égalant la meilleure offre reçue; un UFA, en égalant la moyenne.
    const amountToBeat = this.isRFA() ? this.bestOffer : this.average;

    if (this.ownerOffer >= amountToBeat) {
      this.winners.push(this.player.team.teamID);
      this.ownerWins = true;
    } else {
      this.ownerWins = false;

      if (this.player.status === 'UFA') {
        this.findWinners();
      } else if (this.player.status === 'RFA') {
        this.findRFAWinners();
      }
    }
  }

  findWinners() {
    var smallestDiff = 10000000;

    for (let index = 0; index < this.offers.length; index++) {
      const offer = this.offers[index];
      if(!offer.isOwner){
        var newDifference = Math.abs(this.average - offer.amount);
        if (newDifference < smallestDiff) {
          smallestDiff = newDifference;
        }
      }
    }
    console.log("SmallestDiff= " + smallestDiff);

    for (let index = 0; index < this.offers.length; index++) {
      const offer = this.offers[index];
      if(!offer.isOwner){
        var newDifference = Math.abs(this.average - offer.amount);
        console.log(offer.playerName+ " New Diff= " + newDifference);
        if (newDifference === smallestDiff) {
          this.winners.push(offer.teamId);
        }
      }
    }
  }

  findRFAWinners() {
    console.log("highestOffer= " + this.bestOffer);

    for (let index = 0; index < this.offers.length; index++) {
      const offer = this.offers[index];
      if(!offer.isOwner){
        if (offer.amount === this.bestOffer) {
          this.winners.push(offer.teamId);
        }
      }
    }
  }

  isRFA(): boolean {
    return this.player != null && this.player.status === 'RFA';
  }

  // La compensation n'est due que si un RFA est arraché à son équipe d'origine.
  showCompensation(): boolean {
    return this.isRFA() && !this.ownerWins && this.bestOffer > 0;
  }

  getCompensation(): string {
    return this.salaryScaleService.getCompensationForSalary(this.bestOffer);
  }

  getWinners(){
    let winnersText: string = "";
    for (let index = 0; index < this.winners.length; index++) {
      const element =  this.winners[index];
      const winnerTeam = this.playerMapperService.mapTeam(element);
      winnersText += winnerTeam.teamCity + " ";
    }

    return winnersText;
  }

  getOfferedBy(offer: Offer){
    const offeredByTeam = this.playerMapperService.mapTeam(offer.teamId);
    return offeredByTeam.teamCity
  }

  getChipColor() {
    if (this.player != null) {
      if (this.player.status === 'UFA') {
        return 'primary';
      }
      if (this.player.status === 'RFA') {
        return 'accent';
      }
      if (this.player.status === '35+') {
        return 'warn';
      }
    }
  }

  getPlayerFaceImage() {
    const nhlAvatarsURL =
      'https://assets.nhle.com/mugs/nhl/latest/';
    var playerID = this.player.URLLink.substring(
      this.player.URLLink.lastIndexOf('/') + 1
    );
    const playerAvatarURL = nhlAvatarsURL + playerID + '.png';

    return playerAvatarURL;
  }

  getHeaderBackgroundImageUrl() {
    const teamLogoURL = 'https://assets.nhle.com/logos/nhl/svg/' + this.player.team.logoId + '_dark.svg';
    return teamLogoURL;
  }
}
