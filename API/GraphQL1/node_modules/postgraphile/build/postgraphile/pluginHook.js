"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginHookFromOptions = exports.makePluginHook = void 0;
// @ts-ignore Allow importing JSON
const package_json_1 = require("../../package.json");
const graphql = require("graphql");
const identityHook = (input) => input;
const identityPluginHook = (_hookName, input, _options) => input;
function contextIsSame(context1, context2) {
    // Shortcut if obvious
    if (context1 === context2) {
        return true;
    }
    // Blacklist approach from now on
    const keys1 = Object.keys(context1);
    const keys2 = Object.keys(context2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    // tslint:disable-next-line one-variable-per-declaration
    for (let i = 0, l = keys1.length; i < l; i++) {
        const key = keys1[i];
        if (context1[key] !== context2[key]) {
            return false;
        }
        if (!keys2.includes(key)) {
            return false;
        }
    }
    return true;
}
// Caches the last value of the hook, in case it's called with exactly the same
// arguments again.
function memoizeHook(hook) {
    let lastCall = null;
    return (argument, context) => {
        if (lastCall && lastCall.argument === argument && contextIsSame(lastCall.context, context)) {
            return lastCall.result;
        }
        else {
            const result = hook(argument, context);
            lastCall = {
                argument,
                context,
                result,
            };
            return result;
        }
    };
}
function shouldMemoizeHook(hookName) {
    return hookName === 'withPostGraphileContext';
}
function makeHook(plugins, hookName) {
    const combinedHook = plugins.reduce((previousHook, plugin) => {
        if (typeof plugin[hookName] === 'function') {
            return (argument, context) => {
                return plugin[hookName](previousHook(argument, context), context);
            };
        }
        else {
            return previousHook;
        }
    }, identityHook);
    if (combinedHook === identityHook) {
        return identityHook;
    }
    else if (shouldMemoizeHook(hookName)) {
        return memoizeHook(combinedHook);
    }
    else {
        return combinedHook;
    }
}
function makePluginHook(plugins) {
    const hooks = {};
    const emptyObject = {}; // caching this makes memoization faster when no context is needed
    function rawPluginHook(hookName, argument, context = emptyObject) {
        if (!hooks[hookName]) {
            hooks[hookName] = makeHook(plugins, hookName);
        }
        return hooks[hookName](argument, context);
    }
    const pluginHook = rawPluginHook('pluginHook', rawPluginHook, {});
    // Use this hook to check your hook is compatible with this version of
    // PostGraphile, also to get a reference to shared graphql instance.
    pluginHook('init', null, { version: package_json_1.version, graphql });
    return pluginHook;
}
exports.makePluginHook = makePluginHook;
function pluginHookFromOptions(options) {
    if (typeof options.pluginHook === 'function') {
        return options.pluginHook;
    }
    else {
        return identityPluginHook;
    }
}
exports.pluginHookFromOptions = pluginHookFromOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luSG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvcGx1Z2luSG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxrQ0FBa0M7QUFDbEMscURBQTZDO0FBQzdDLG1DQUFtQztBQTJIbkMsTUFBTSxZQUFZLEdBQUcsQ0FBSSxLQUFRLEVBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztBQUMvQyxNQUFNLGtCQUFrQixHQUFpQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFFL0UsU0FBUyxhQUFhLENBQUMsUUFBNkIsRUFBRSxRQUE2QjtJQUNqRixzQkFBc0I7SUFDdEIsSUFBSSxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxpQ0FBaUM7SUFDakMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2pDLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCx3REFBd0Q7SUFDeEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM1QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENB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