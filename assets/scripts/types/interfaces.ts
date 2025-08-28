export interface IEntityFactory<T> {
  create(data: unknown): Promise<T>;
}
