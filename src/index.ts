import { BrokenCircuitError, CircuitBreakerPolicy, CircuitState, ConsecutiveBreaker, IPolicy, Policy } from 'cockatiel';
import { DatabaseError, MyLittleDatabase } from './MyLittleDatabase';
import { BasicPingComponent, ProfessionalPingComponent } from './PingComponent';


(async function () {
    // How it works: Uncomment the method you'd like to run.

    // await retry_handle_all_error_types_with_attempts_and_no_fallback_example();
    // await retry_handle_specific_error_type_and_no_fallback_example();
    // await retry_handle_all_error_types_with_fallback_example();
    // await circuit_breaker_without_fallback_example();
     await circuit_breaker_with_fallback_example();

    async function retry_handle_all_error_types_with_attempts_and_no_fallback_example() {
        /* This example shows how to use a retry policy with recurrent attempts.
         */

         // This is a remote object (database, queue, web service, etc.)
        const myDatabase = new MyLittleDatabase();

        // Declare a retry policy
        const retryPolicy = Policy.handleAll().retry().attempts(1); // Start with 1 attempt, then increase until you see something different... ;)
        var data = await retryPolicy.execute(() => myDatabase.getDataFromYouTube());
        console.log("Returned data: " + data);

        // Reference: https://www.npmjs.com/package/cockatiel#policyhandleall
    }

    async function retry_handle_specific_error_type_and_no_fallback_example() {
        /* This example shows how to use a retry policy without attempts.
         * We're mostly interested in handling the DatabaseError type.
         */
        
         // This is a remote object (database, queue, web service, etc.)
        const myDatabase = new MyLittleDatabase();

        // Declare a retry policy (by default, it'll retry once)
        const retryPolicy = Policy.handleType(DatabaseError).retry(); // For this example, modify the error type in the business method.
                
        // Execute the business logic using the policy
        await retryPolicy.execute(() => myDatabase.openConnection());

        // Reference: https://www.npmjs.com/package/cockatiel#policyhandletypector-filter
    }

    async function retry_handle_all_error_types_with_fallback_example() {
        /* This example shows how to use a retry policy with attempts and a fallback.
         */
        
         // This is a remote object (database, queue, web service, etc.)
        const myDatabase = new MyLittleDatabase();

        // Declare a retry policy (by default, it'll retry once)
        const retryPolicy = Policy.handleAll().retry().attempts(2); // For this one, increase the attempts to 3.
        const fallbackPolicy = Policy.handleAll().fallback(() => myDatabase.getDataFromAmazonPrime());
        const retryWithFallbackPolicy = Policy.wrap(fallbackPolicy, retryPolicy);
                
        // Execute the business logic using the policy
        console.log(await retryWithFallbackPolicy.execute(() => myDatabase.getDataFromYouTube()));
    }

    async function circuit_breaker_without_fallback_example() {
        const basicPingComponent = new BasicPingComponent();
        const callers = 50;
        let startTime: any; startTime = new Date();
        for(let i = 0; i < callers; i++) {
            console.log(await basicPingComponent.ping()); // For this example, try with a super resilient component (change resiliencyFactor from 11...10...9 and observe effects)
        }
        let endTime: any; endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log('Example with ' + callers + ' callers took: ' + elapsedTime + ' ms');

        // Reference: https://www.npmjs.com/package/cockatiel#policycircuitbreakeropenafter-breaker
    }

    async function circuit_breaker_with_fallback_example() {
        const professionalPingComponent = new ProfessionalPingComponent();
        const callers = 50;
        let startTime: any; startTime = new Date();
        for(let i = 0; i < callers; i++) {
            console.log(await professionalPingComponent.ping());
        }
        let endTime: any; endTime = new Date();
        const elapsedTime = endTime - startTime;
        console.log('Example with ' + callers + ' callers took: ' + elapsedTime + ' ms');
    }
})();