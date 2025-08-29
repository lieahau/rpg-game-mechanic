export interface IEntityFactory<T> {
  create(data: unknown): T | Promise<T>;
  createFromMap?(dataMap: { [key: string]: unknown }): T[] | Promise<T[]>;
}
