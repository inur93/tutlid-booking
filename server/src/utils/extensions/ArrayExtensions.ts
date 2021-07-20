
export { }
declare global {
    interface Array<T> {
        sum(selector: (item: T) => number): number
    }
}
if (!Array.prototype.sum) {
    Array.prototype.sum = function <T>(selector: (item: T) => number): number {
        return this.reduce((sum: number, item: T) => sum + (selector ? selector(item) : item as unknown as number), 0);
    }

}