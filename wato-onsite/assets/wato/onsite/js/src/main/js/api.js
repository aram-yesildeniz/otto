class Api {

    constructor(shoppingProcess) {
        this.shoppingProcess = shoppingProcess;
    }

    // Auslieferung von Werbe-Content unterbinden by FT1
    enterShoppingProcess() {
        this.shoppingProcess.enterShoppingProcess();
    }

    leaveShoppingProcess() {
        this.shoppingProcess.leaveShoppingProcess();
    }

}

export {Api}