import { Injectable } from '@angular/core';
import { Player } from '../models/player';

export interface ExpectedSalary{
  min: number;
  max: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalaryScaleService {
  constructor() {}

  getPlayerExpectedSalary(player: Player): ExpectedSalary {
    let ret: ExpectedSalary = { min: 0, max: 8000000 };

    switch (player.position) {
      case 'Attaquant':
      case 'Défenseur':
        ret = this.getForwardExpectedSalary(player);
        break;
      case 'Gardien':
        ret = this.getGoalieExpectedSalary(player);
        break;
    }

    if (player.status === '35+') {
      return { min: ret.min, max: 10000000 };
    }
    return ret;
  }
  private getGoalieExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case ovk > 83:
        return { min: 6500000, max: 8000000 };
      case ovk >= 81 && ovk <= 83:
        return { min: 5000000, max: 6500000 };
      case ovk >= 77 && ovk <= 80:
        return { min: 3000000, max: 5000000 };
      case ovk >= 75 && ovk <= 76:
        return { min: 2000000, max: 3000000 };
      case ovk >= 73 && ovk <= 74:
        return { min: 1000000, max: 2000000 };
      case ovk >= 65 && ovk <= 72:
        return { min: 500000, max: 1000000 };
      case ovk < 65:
        return { min: 300000, max: 500000 };

      default:
        return { min: 0, max: 0 };
    }
  }
  private getForwardExpectedSalary(player: Player): ExpectedSalary {
    var ovk = player.OVK;
    switch (true) {
      case ovk > 83:
        return { min: 6500000, max: 8000000 };

      case ovk >= 81 && ovk <= 83:
        return { min: 5000000, max: 6500000 };

      case ovk >= 77 && ovk <= 80:
        return { min: 3500000, max: 5000000 };

      case ovk >= 74 && ovk <= 76:
        return { min: 2500000, max: 3500000 };

      case ovk >= 69 && ovk <= 73:
        return { min: 1000000, max: 2500000 };

      case ovk >= 65 && ovk <= 68:
        return { min: 500000, max: 1000000 };

      case ovk < 65:
        return { min: 300000, max: 500000 };

      default:
        return { min: 0, max: 0 };
    }
  }
  /*
    Compensation pour obtenir un RFA
    7,000,000$ à 8,000,000$ / 3 choix de 1e ronde + 2 choix de 2e ronde
    6,000,000$ à 6,999,999$ / 2 choix de 1e ronde + 2 choix de 2e ronde
    5,000,000$ à 5,999,999$ / 2 choix de 1e ronde + 1 choix de 2e ronde
    4,200,000$ à 4,999,999$ / 2 choix de 1e ronde
    3,500,000$ à 4,199,999$ / 1 choix de 1e ronde + 1 choix de 2e ronde
    2,700,000$ à 3,499,999$ / 1 choix de 1e ronde
    2,000,000$ à 2,699,999$ / 2 choix de 2e ronde
    1,000,000$ à 1,999,999$ / 1 choix de 2e ronde + 1 choix de 3e ronde
    999,999$ et moins / 1 choix de 2e ronde
  */
  getCompensationForSalary(salary: number): string {
    if (!salary) {
      return '';
    }
    if (salary >= 7000000) {
      return '3x 1st round + 2x 2nd round';
    } else if (salary >= 6000000) {
      return '2x 1st round + 2x 2nd round';
    } else if (salary >= 5000000) {
      return '2x 1st round + 1x 2nd round';
    } else if (salary >= 4200000) {
      return '2x 1st round';
    } else if (salary >= 3500000) {
      return '1x 1st round + 1x 2nd round';
    } else if (salary >= 2700000) {
      return '1x 1st round';
    } else if (salary >= 2000000) {
      return '2x 2nd round';
    } else if (salary >= 1000000) {
      return '1x 2nd round + 1x 3rd round';
    }
    return '1x 2nd round';
  }
}
