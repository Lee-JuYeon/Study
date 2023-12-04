"use strict";
/**
 * This file contains code that is derived from code copyright (c) Facebook,
 * Inc. and its affiliates; released under the MIT license.
 *
 * The original code can be seen at the following URL, which includes a
 * reference to the original license:
 *
 *   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/subscribe.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLiveSubscribe = void 0;
/* tslint:disable no-any */
const graphql_1 = require("graphql");
const mapAsyncIterator_1 = require("./mapAsyncIterator");
const iterall_1 = require("iterall");
/**
 * This method returns a function compatible with the `subscribe` function from
 * GraphQL.js, but with enhancements to support live queries.
 *
 * @internal
 */
function makeLiveSubscribe(params) {
    const { pluginHook } = params;
    return function liveSubscribe(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
        /* eslint-enable no-redeclare */
        // Extract arguments from object args if provided.
        return arguments.length === 1
            ? liveSubscribeImpl(argsOrSchema.schema, argsOrSchema.document, argsOrSchema.rootValue, argsOrSchema.contextValue, argsOrSchema.variableValues, argsOrSchema.operationName, argsOrSchema.fieldResolver, argsOrSchema.subscribeFieldResolver)
            : liveSubscribeImpl(argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver);
    };
    function liveSubscribeImpl(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) {
        const sourcePromise = graphql_1.createSourceEventStream(schema, document, rootValue, contextValue, variableValues, operationName, subscribeFieldResolver);
        // For each payload yielded from a subscription, map it over the normal
        // GraphQL `execute` function, with `payload` as the rootValue.
        // This implements the "MapSourceToResponseEvent" algorithm described in
        // the GraphQL specification. The `execute` function provides the
        // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
        // "ExecuteQuery" algorithm, for which `execute` is also used.
        const mapSourceToResponse = async (payload) => {
            /*
             * GRAPHILE FORK
             *
             * We need to tell Graphile Engine when the execution has completed
             * (because we cannot detect this from inside the GraphQL execution) so
             * that it can clean up old listeners; we do this with the `finally` block.
             */
            try {
                const executionResult = graphql_1.execute(schema, document, payload, contextValue, variableValues, operationName, fieldResolver);
                const hookedExecutionResult = pluginHook('postgraphile:liveSubscribe:executionResult', executionResult, {
                    schema,
                    document,
                    rootValue,
                    contextValue,
                    variableValues,
                    operationName,
                    fieldResolver,
                    subscribeFieldResolver,
                });
                return await hookedExecutionResult;
            }
            finally {
                if (payload && typeof payload.release === 'function') {
                    payload.release();
                }
            }
        };
        // Resolve the Source Stream, then map every source value to a
        // ExecutionResult value as described above.
        return sourcePromise.then(resultOrStream => 
        // Note: Flow can't refine isAsyncIterable, so explicit casts are used.
        iterall_1.isAsyncIterable(resultOrStream)
            ? mapAsyncIterator_1.default(resultOrStream, mapSourceToResponse, reportGraphQLError)
            : resultOrStream, reportGraphQLError);
    }
}
exports.makeLiveSubscribe = makeLiveSubscribe;
/**
 * This function checks if the error is a GraphQLError. If it is, report it as
 * an ExecutionResult, containing only errors and no data. Otherwise treat the
 * error as a system-class error and re-throw it.
 */
function reportGraphQLError(error) {
    if (error instanceof graphql_1.GraphQLError) {
        return { errors: [error] };
    }
    throw error;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZVN1YnNjcmliZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvaHR0cC9saXZlU3Vic2NyaWJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7R0FRRzs7O0FBRUgsMkJBQTJCO0FBQzNCLHFDQVFpQjtBQUVqQix5REFBa0Q7QUFDbEQscUNBQTBDO0FBTTFDOzs7OztHQUtHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsTUFHakM7SUFDQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRTlCLE9BQU8sU0FBUyxhQUFhLENBQzNCLFlBQWlDLEVBQ2pDLFFBQXVCLEVBQ3ZCLFNBQWUsRUFDZixZQUFrQixFQUNsQixjQUF1QyxFQUN2QyxhQUFzQixFQUN0QixhQUE4QyxFQUM5QyxzQkFBdUQ7UUFFdkQsZ0NBQWdDO1FBQ2hDLGtEQUFrRDtRQUNsRCxPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUMzQixDQUFDLENBQUMsaUJBQWlCLENBQ2YsWUFBWSxDQUFDLE1BQU0sRUFDbkIsWUFBWSxDQUFDLFFBQVEsRUFDckIsWUFBWSxDQUFDLFNBQVMsRUFDdEIsWUFBWSxDQUFDLFlBQVksRUFDekIsWUFBWSxDQUFDLGNBQWMsRUFDM0IsWUFBWSxDQUFDLGFBQWEsRUFDMUIsWUFBWSxDQUFDLGFBQWEsRUFDMUIsWUFBWSxDQUFDLHNCQUFzQixDQUNwQztZQUNILENBQUMsQ0FBQyxpQkFBaUIsQ0FDZixZQUFZLEVBQ1osUUFBd0IsRUFDeEIsU0FBUyxFQUNULFlBQVksRUFDWixjQUFjLEVBQ2QsYUFBYSxFQUNiLGFBQWEsRUFDYixzQkFBc0IsQ0FDdkIsQ0FBQztJQUNSLENBQUMsQ0FBQztJQUVGLFNBQVMsaUJBQWlCLENBQ3hCLE1BQXFCLEVBQ3JCLFFBQXNCLEVBQ3RCLFNBQWUsRUFDZixZQUFrQixFQUNsQixjQUF1QyxFQUN2QyxhQUFzQixFQUN0QixhQUE4QyxFQUM5QyxzQkFBdUQ7UUFFdkQsTUFBTSxhQUFhLEdBQUcsaUNBQXVCLENBQzNDLE1BQU0sRUFDTixRQUFRLEVBQ1IsU0FBUyxFQUNULFlBQVksRUFDWixjQUFjLEVBQ2QsYUFBYSxFQUNiLHNCQUFzQixDQUN2QixDQUFDO1FBRUYsdUVBQXVFO1FBQ3ZFLCtEQUErRDtRQUMvRCx3RUFBd0U7UUFDeEUsaUVBQWlFO1FBQ2pFLHlFQUF5RTtRQUN6RSw4REFBOEQ7UUFDOUQsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLEVBQUUsT0FBWSxFQUFFLEVBQUU7WUFDakQ7Ozs7OztlQU1HO1lBQ0gsSUFBSTtnQkFDRixNQUFNLGVBQWUsR0FBRyxpQkFBTyxDQUM3QixNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxZQUFZLEVBQ1osY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLENBQ2QsQ0FBQztnQkFFRixNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FDdEMsNENBQTRDLEVBQzVDLGVBQWUsRUFDZjtvQkFDRSxNQUFNO29CQUNOLFFBQVE7b0JBQ1IsU0FBUztvQkFDVCxZQUFZO29CQUNaLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixhQUFhO29CQUNiLHNCQUFzQjtpQkFDdkIsQ0FDRixDQUFDO2dCQUVGLE9BQU8sTUFBTSxxQkFBcUIsQ0FBQzthQUNwQztvQkFBUztnQkFDUixJQUFJLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO29CQUNwRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ25CO2FBQ0Y7UUFDSCxDQUFDLENBQUM7UUFFRiw4REFBOEQ7UUFDOUQsNENBQTRDO1FBQzVDLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FDdkIsY0FBYyxDQUFDLEVBQUU7UUFDZix1RUFBdUU7UUFDdkUseUJBQWUsQ0FBQyxjQUFjLENBQUM7WUFDN0IsQ0FBQyxDQUFDLDBCQUFnQixDQUNiLGNBQThDLEVBQy9DLG1CQUFtQixFQUNuQixrQkFBa0IsQ0FDbkI7WUFDSCxDQUFDLENBQUcsY0FBMEMsRUFDbEQsa0JBQWtCLENBQ25CLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQTVIRCw4Q0E0SEM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxLQUFVO0lBQ3BDLElBQUksS0FBSyxZQUFZLHNCQUFZLEVBQUU7UUFDakMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7S0FDNUI7SUFDRCxNQUFNLEtBQUssQ0FBQztBQUNkLENBQUMifQ==