export interface IEntityFactory<T> {
  create(data: unknown, root?: unknown): T | Promise<T>;
  createBulk?(data: unknown | unknown[], root?: unknown): T[] | Promise<T[]>;
  createFromMap?(dataMap: { [key: string]: unknown }): T[] | Promise<T[]>;
}
