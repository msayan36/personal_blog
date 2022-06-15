import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/ReactMarkdown.module.css";

const Slug = ({ blogData }) => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <Head>
        <title>Sayan Munshi - {slug}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-20 mx-auto w-11/12 lg:w-[58rem]">
        <Image
          src={`http://localhost:1337${blogData[0].attributes.cover.data.attributes.url}`}
          alt="title_img"
          width={958}
          height={459}
          className="mb-4"
        />
        <h1 className="text-xl lg:text-3xl font-extrabold mt-6">
          {blogData[0].attributes.title.toUpperCase()}
        </h1>
        <p className="mt-4 lg:text-base text-sm mb-10">
          {moment(blogData[0].attributes.createdAt).format("MMM DD, YYYY")}
        </p>
        <ReactMarkdown
          className={styles.reactMarkdown}
          children={blogData[0].attributes.blocks[0].body}
          transformImageUri={(uri) =>
            uri.startsWith("http")
              ? uri
              : `${process.env.REACT_APP_IMAGE_BASE_URL}${uri}`
          }
        />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const headers = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };

  let categories;
  let blogData;

  const categoryArrRes = await fetch(
    `http://localhost:1337/api/categories?populate=*`,
    {
      headers: headers,
    }
  );

  const blogDataRes = await fetch(
    `http://localhost:1337/api/articles?populate=*&filters[slug]=${context.query.slug}`,
    {
      headers: headers,
    }
  );

  const categoryArr = await categoryArrRes.json();
  const blogDataArr = await blogDataRes.json();

  categories = categoryArr.data;
  blogData = blogDataArr.data;

  return {
    props: { categories, blogData }, // will be passed to the page component as props
  };
}

export default Slug;
