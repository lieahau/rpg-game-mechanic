export interface IEntityFactory<T> {
  create(data: unknown): T | Promise<T>;
  createMany?(dataArray: unknown[]): T[] | Promise<T[]>;
}
