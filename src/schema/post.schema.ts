import { Field, ID, Int, ObjectType } from 'type-graphql';
import { User } from './user.schema';

@ObjectType()
export class Post {
    @Field(() => ID)
    public id: number;

    @Field(() => Int)
    public userId: number;

    @Field(() => User, { nullable: true })
    public author?: User;

    @Field()
    public title: string;

    @Field()
    public body: string;
}
