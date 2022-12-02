import React from "react";
import { useRouter } from "next/router";
import { getPosts, getPostDetails } from "../../services";
import {
  Categories,
  PostDetail,
  PostWidget,
  Author,
  Comments,
  CommentsForm,
  Loader,
} from "../../components";
const PostDetails = ({ post }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <Loader></Loader>;
  }
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          <PostDetail post={post}></PostDetail>
          <Author author={post.author}></Author>
          <CommentsForm slug={post.slug}></CommentsForm>
          <Comments slug={post.slug}></Comments>
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <PostWidget
              slug={post.slug}
              categories={post.categories.map((category: any) => category.slug)}
            ></PostWidget>
            <Categories></Categories>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

export async function getStaticProps({ params }: { params: any }) {
  const data = await getPostDetails(params.slug);
  console.log(data);
  return {
    props: { post: data },
  };
}

export async function getStaticPaths() {
  const posts = await getPosts();
  const a = posts.map((post) => ({ params: post.slug }));
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: true,
  };
}
