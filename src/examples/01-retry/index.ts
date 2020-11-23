import { Policy } from 'cockatiel';
import { MyDatabase } from '../../MyDatabase';

const myDatabase = new MyDatabase();

// We first define our policy. This is the stability pattern strategy we wish to implement.
const retryPolicy = Policy.handleAll().retry().attempts(3);
await retryPolicy.execute(() => myDatabase.EstablishConnection);
