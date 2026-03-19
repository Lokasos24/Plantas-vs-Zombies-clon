export class EconomyManager {
    constructor(initialSuns = 50) {
        this.balance = initialSuns;
        this.costs = {
            'sunflower': 50,
            'peashooter': 100
        };
    }

    canAfford(plantType) {
        return this.balance >= this.costs[plantType];
    }

    spend(plantType) {
        this.balance -= this.costs[plantType];
    }

    addSuns(amount) {
        this.balance += amount;
    }
}