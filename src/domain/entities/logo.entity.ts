export class Logo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Logo {
    return new Logo(props.id, props.name, props.createdAt, props.updatedAt);
  }
}
