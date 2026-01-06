export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.password,
      props.role,
      props.createdAt,
      props.updatedAt,
    );
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toSafeObject(): Omit<User, 'password' | 'toSafeObject'> {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      fullName: this.fullName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
