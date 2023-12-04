"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShutdownActions = void 0;
/**
 * This class tracks actions that must be taken when PostGraphile is shut down
 * (released) in order to make sure that all the resources it has consumed has
 * been cleaned up.
 *
 * Since PostGraphile is extensible via plugins and plugins may have their own
 * shutdown actions we use this generic system to handle them all. If your
 * plugin sets up something that would keep running after PostGraphile is
 * `.release()`d (such as a timer, interval, network connection, filesystem
 * monitoring, or similar activity) then you should register an action via
 * `shutdownActions` to clean it up.
 *
 * This class currently has "experimental" status, it may have breaking
 * changes in future semver minor releases.
 */
class ShutdownActions {
    constructor() {
        this.actions = [];
        this.didInvoke = false;
    }
    /**
     * Register a function to be called when PostGraphile is released.
     */
    add(action) {
        if (this.didInvoke) {
            console.warn("WARNING: shutdown action added after shutdown actions were invoked; we'll call it now but your program may have already moved on.");
            setImmediate(() => {
                Promise.resolve(action()).catch(e => {
                    console.error('Error occurred calling shutdown action after invoke:');
                    console.error(e);
                });
            });
        }
        else {
            this.actions.push(action);
        }
    }
    /**
     * If your action is no longer relevant (for example it has completed, or it
     * was only relevant whilst in a particular mode) then be sure to remove it so
     * it won't be called when PostGraphile is released.
     */
    remove(action) {
        const index = this.actions.indexOf(action);
        if (index === -1) {
            throw new Error('The specified shutdown action was not found.');
        }
        this.actions.splice(index, 1);
    }
    /**
     * Calls the release actions in reverse order and returns the array of resulting
     * promises/results. Will not throw unless the shutdown actions have already
     * been invoked.
     */
    invoke() {
        if (this.didInvoke) {
            throw new Error('release() has already been called.');
        }
        this.didInvoke = true;
        const actions = this.actions;
        this.actions = [];
        // Invoke in reverse order.
        const result = new Array(actions.length);
        let chain = Promise.resolve();
        for (let i = actions.length - 1; i >= 0; i--) {
            const fn = actions[i];
            // Ensure that all actions are called, even if a previous action throws an
            // error.
            result[i] = chain = chain.then(() => fn(), () => fn());
        }
        return result;
    }
    /**
     * Calls all the release actions and resolves when complete (rejecting if an
     * error occurred).
     */
    async invokeAll() {
        // TODO:v5: This would be better if it used `Promise.allSettled()` but we
        // can't use it yet.
        await Promise.all(this.invoke());
    }
}
exports.ShutdownActions = ShutdownActions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1dGRvd25BY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaGlsZS9zaHV0ZG93bkFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFhLGVBQWU7SUFBNUI7UUFDVSxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBRyxLQUFLLENBQUM7SUF1RTVCLENBQUM7SUFyRUM7O09BRUc7SUFDSCxHQUFHLENBQUMsTUFBYztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsT0FBTyxDQUFDLElBQUksQ0FDVixtSUFBbUksQ0FDcEksQ0FBQztZQUNGLFlBQVksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hCLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztvQkFDdEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE1BQWM7UUFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLDJCQUEyQjtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEIsMEVBQTBFO1lBQzFFLFNBQVM7WUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQzVCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUNWLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUNYLENBQUM7U0FDSDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsU0FBUztRQUNiLHlFQUF5RTtRQUN6RSxvQkFBb0I7UUFDcEIsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQXpFRCwwQ0F5RUMifQ==