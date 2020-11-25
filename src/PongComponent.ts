export interface IPongComponent {
    pong(): string; // mostly returns "Pong"
}

export class PongFromFastAndCheapCache implements IPongComponent {
    public pong() : string {
        // Generate a number between 1 and 10 which represents the resiliency factor.
        var resiliencyFactor = generateRandomNumber(1, 10);
        if (resiliencyFactor >= 5) { // The higher the number, the more resilient. :)
            // Example: AWS would be a 9. Azure would be a 8. Alibaba would be a 5. MiAmigoCloud would be a 3.
            throw new Error('Whoops! Something bad happened with the cache!');
        }
        return "Pong from our fast and cheap cache. Yay!!!";
    }
}

export class PongFromSlowAndCostlyDatabase implements IPongComponent {
    public pong() : string {
        return "Pong from our slow and costly database. Ouch!"
    }
}

function generateRandomNumber(from: number, to: number): number {
    return Math.floor(Math.random() * 10) + 1;
}