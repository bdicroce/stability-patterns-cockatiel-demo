import { BrokenCircuitError, CircuitBreakerPolicy, ConsecutiveBreaker, IPolicy, Policy } from "cockatiel";
import {IPongComponent, PongFromFastAndCheapCache, PongFromSlowAndCostlyDatabase} from './PongComponent';
/*
 * The BasicPingComponent uses a lone circuit breaker without any other policy.
 */
export class BasicPingComponent {
    private circuitBreakerPolicy : CircuitBreakerPolicy;
    private pongServer : IPongComponent;
    constructor() {
        // Configuring the circuit breaker.
        const timeBetweenRetries = 50; // Time in milliseconds.
        const maxRetries = 3; // After exceeding max retries, the circuit breaker will open.
        this.circuitBreakerPolicy = Policy.handleAll().circuitBreaker(timeBetweenRetries, new ConsecutiveBreaker(maxRetries));
        this.circuitBreakerPolicy.onBreak(() => console.log('::circuit is open'));
        this.circuitBreakerPolicy.onReset(() => console.log('::circuit is closed'));
        this.circuitBreakerPolicy.onHalfOpen(() => console.log('::giving it one more chance...'));
        // This is a remote object (database, distributed cache, queue, web service, etc.)
        this.pongServer = new PongFromFastAndCheapCache();
    }
    public async ping() {        
        try{             
          // Execute the business logic using the policy
          return await this.circuitBreakerPolicy.execute(() => this.pongServer.pong());
        } catch (e) {
            if (e instanceof BrokenCircuitError) {
                console.log("Pong server is not available, please try again later...");
            } else {
                throw e;
            }
        }
    }   
}

/*
 * The ProfessionalPingPongComponent uses a circuit breaker with a fallback policy for resiliency.
 */
export class ProfessionalPingComponent {
    private circuitBreakerWithFallbackPolicy : IPolicy;
    private pongServer : IPongComponent;
    constructor() {
        // Configuring the circuit breaker.
        const timeBetweenRetries = 50; // Time in milliseconds.
        const maxRetries = 3; // After exceeding max retries, the circuit breaker will open.
        const circuitBreakerPolicy = Policy.handleAll().circuitBreaker(timeBetweenRetries, new ConsecutiveBreaker(maxRetries));
        circuitBreakerPolicy.onBreak(() => console.log('::circuit is open'));
        circuitBreakerPolicy.onReset(() => console.log('::circuit is closed'));
        circuitBreakerPolicy.onHalfOpen(() => console.log('::giving it one more chance...'));

        const fallbackPolicy = Policy.handleAll().fallback(() => new PongFromSlowAndCostlyDatabase().pong());
        this.circuitBreakerWithFallbackPolicy = Policy.wrap(fallbackPolicy, circuitBreakerPolicy);
        // This is a remote object (database, queue, web service, etc.)
        this.pongServer = new PongFromFastAndCheapCache();
    }
    public async ping() {        
        try{             
          // Execute the business logic using the policy
          return await this.circuitBreakerWithFallbackPolicy.execute(() => this.pongServer.pong());
        } catch (e) {
            if (e instanceof BrokenCircuitError) {
                console.log("Pong server is not available, please try again later...");
            } else {
                throw e;
            }
        }
    }   
}

