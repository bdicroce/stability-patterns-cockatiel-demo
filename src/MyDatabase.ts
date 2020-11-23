export class MyDatabase {
    private static attempts: number = 0;
    public async EstablishConnection() : Promise<void> {
        if (MyDatabase.attempts++ == 3) {
            console.log('Successfully established connection to the database.')
        }
        throw new Error('An error occurred while establishing a connection to the database.');
    }
}