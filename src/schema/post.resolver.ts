import { ResolverService } from '@tsed/graphql';
import { Arg, Ctx, FieldResolver, Int, Query, Root } from 'type-graphql';
import { PostsDataSource } from '../services/datasources/posts-data-source';
import { UsersDataSource } from '../services/datasources/users-data-source';
import { Post } from './post.schema';
import { User } from './user.schema';

@ResolverService(Post)
export class PostsResolver {
    @Query(() => Post)
    public async post(
        @Arg('postId', () => Int) postId: number,
        @Ctx('dataSources') dataSources,
    ): Promise<Post> {
        const postsDataSource: PostsDataSource = dataSources.postsDataSource;
        return postsDataSource.getPostById(postId);
    }

    @Query(() => [Post])
    public async posts(
        @Arg('authorId', () => Int, { nullable: true }) authorId: number,
        @Ctx('dataSources') dataSources,
    ): Promise<Post[]> {
        const postsDataSource: PostsDataSource = dataSources.postsDataSource;
        if (authorId) {
            return postsDataSource.getPostByAuthor(authorId);
        }
        return postsDataSource.getAllPosts();
    }

    @FieldResolver(() => User)
    public async author(
        @Root('userId') userId: number,
        @Ctx('dataSources') dataSources,
    ): Promise<User> {
        const usersDataSource: UsersDataSource = dataSources.usersDataSource;
        return usersDataSource.loadUser(userId);
    }
}
