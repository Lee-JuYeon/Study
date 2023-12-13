/**
 * This file contains code that is derived from code copyright (c) Facebook,
 * Inc. and its affiliates; released under the MIT license.
 *
 * The original code can be seen at the following URL, which includes a
 * reference to the original license:
 *
 *   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/subscribe.js
 */
import type { subscribe } from 'graphql';
import { CreateRequestHandlerOptions } from '../../interfaces';
import { PluginHookFn } from '../pluginHook';
/**
 * This method returns a function compatible with the `subscribe` function from
 * GraphQL.js, but with enhancements to support live queries.
 *
 * @internal
 */
export declare function makeLiveSubscribe(params: {
    options: CreateRequestHandlerOptions;
    pluginHook: PluginHookFn;
}): typeof subscribe;
