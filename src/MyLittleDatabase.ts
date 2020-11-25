export class MyLittleDatabase {
    private static attempts: number = 0;

    public openConnection() : void {
        if (MyLittleDatabase.attempts++ < 1) {
            throw new DatabaseError("Sorry, database is not reachable at the moment.");
        } else {
            console.log("Connection established!");
        }
    }

    public getDataFromYouTube() : string {
        if (MyLittleDatabase.attempts++ > 2) {
            return "YouTube says 'Hello, World!'";
        }        
        throw new Error('An error occurred while while getting data from YouTube.');
    }

    public getDataFromAmazonPrime() : string {
        return "Amazon Prime says 'Hello, World!'";        
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
    }
}