import { Inject } from '@tsed/di';
import { DataSourceService } from '@tsed/graphql';
import { RESTDataSource } from 'apollo-datasource-rest';
import { IConfig } from 'config';
import { CONFIG } from '../../config.provider';
import { Post } from '../../types/post';

@DataSourceService()
export class PostsDataSource extends RESTDataSource {
    constructor(@Inject(CONFIG) config: IConfig) {
        super();

        this.baseURL = config.get('restService');
    }

    public async getPostById(postId: number): Promise<Post> {
        return this.get(`/posts/${postId}`);
    }

    public async getAllPosts(): Promise<Post[]> {
        return this.get('/posts');
    }

    public async getPostByAuthor(userId: number): Promise<Post[]> {
        return this.get('/posts', { userId });
    }
}
