export declare type Action = () => void | Promise<void>;
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
export declare class ShutdownActions {
    private actions;
    private didInvoke;
    /**
     * Register a function to be called when PostGraphile is released.
     */
    add(action: Action): void;
    /**
     * If your action is no longer relevant (for example it has completed, or it
     * was only relevant whilst in a particular mode) then be sure to remove it so
     * it won't be called when PostGraphile is released.
     */
    remove(action: Action): void;
    /**
     * Calls the release actions in reverse order and returns the array of resulting
     * promises/results. Will not throw unless the shutdown actions have already
     * been invoked.
     */
    invoke(): Array<Promise<void> | void>;
    /**
     * Calls all the release actions and resolves when complete (rejecting if an
     * error occurred).
     */
    invokeAll(): Promise<void>;
}
