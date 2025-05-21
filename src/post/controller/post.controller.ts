import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from '../service/post.service';
import { CreatePostRequest, DeletePostRequest, FindPostRequest, UpdatePostRequest } from '../dto/post.request.dto';
import { ApiPaginationResponse } from '../../decorator/pagination.response.decorator';
import { PostListResponse, PostResponse } from '../dto/post.response.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  async createPost(@Body() requestParam: CreatePostRequest) {
    return this.postService.create(requestParam);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() requestParam: UpdatePostRequest,
  ) {
    return this.postService.update(id, requestParam);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  async deletePost(
    @Param('id') id: number,
    @Body() { password }: DeletePostRequest,
  ) {
    return this.postService.delete(id, password);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiOkResponse({ type: PostResponse })
  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.postService.getOne(id);
  }

  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiPaginationResponse(PostListResponse)
  @Get()
  async getPosts(@Query() query: FindPostRequest) {
    return this.postService.findAll(query);
  }
}
