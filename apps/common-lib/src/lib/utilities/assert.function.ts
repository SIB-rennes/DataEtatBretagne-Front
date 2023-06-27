
/** Établit une assertion.
 * @param condition Condition à considérer.
 * @param message Message en cas d'echec 
 */
export function assert(condition: any, message?: string): asserts condition {
    if (!condition)
        throw new Error(message || "Assertion failed!")
}