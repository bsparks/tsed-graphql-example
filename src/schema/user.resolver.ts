import { ResolverService } from '@tsed/graphql';
import { Arg, Ctx, Int, Query } from 'type-graphql';
import { UsersDataSource } from '../services/datasources/users-data-source';
import { User } from './user.schema';

@ResolverService(User)
export class UsersResolver {
    @Query(() => User)
    public async user(
        @Arg('userId', () => Int) userId: number,
        @Ctx('dataSources') dataSources,
    ): Promise<User> {
        const usersDataSource: UsersDataSource = dataSources.usersDataSource;
        return usersDataSource.loadUser(userId);
    }
}
