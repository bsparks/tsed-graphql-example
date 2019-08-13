import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    public id: number;

    @Field()
    public name: string;

    @Field()
    public username: string;

    @Field()
    public email: string;
}
