import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';
import { Helmet } from 'react-helmet';
interface Post {
  _id: string;
  author: string;
  authorImg: string;
  authorOccupation?: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Blogpost(): JSX.Element {
  const { id , title} = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlogPost = async () => {
    try {
     
     
      const response = await axiosInstance.get<Post>(`/posts/${id}/${title}`, {
        
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPost();
  }, [id] );

  const generateAnchorText = (url: string): string => {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    switch (domain) {
      case 'youtube.com':
        return 'Watch on YouTube';
      case 'github.com':
        return 'View on GitHub';
      case 'linkedin.com':
        return 'View on LinkedIn';
      case 'twitter.com':
        return 'View on Twitter';
      default:
        return `${domain}`;
    }
  };

  const processTextWithLinks = (text: string): string => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const anchorText = generateAnchorText(url);
      return `<a href="${url}" class="text-blue-500 hover:underline hover:visited" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
    });
  };

  if (loading) {
    return <div className='w-full h-screen flex justify-center items-center'>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
     <Helmet>
        <title>{post.title || 'Blog Post Title'}</title>
        <meta name="description" content={post.description || 'Blog post description'} />
        <meta name="title" content={post.title || 'Blog, Article'} />
        <meta name="author" content={post.author || 'Unknown'} />
        <meta name="publication_date" content={post.createdAt || new Date().toISOString()} />
        <meta property="og:title" content={post.title || 'Blog Post Title'} />
        <meta property="og:description" content={post.description || 'Blog post description'} />
        <meta property="og:image" content={post.imageUrl || ''} />
        <meta property="og:url" content={`https://www.adirayglobal.com/blogpost/${post._id}/${post.title}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title || 'Blog Post Title'} />
        <meta name="twitter:description" content={post.description || 'Blog post description'} />
        <meta name="twitter:image" content={post.imageUrl || ''} />
        <meta name="twitter:site" content="@yourtwitterhandle" />

        {/* Schema Markup */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${post.title}",
              "description": "${post.description}",
              "image": "${post.imageUrl}",
              "author": {
                "@type": "Person",
                "name": "${post.author}"
              },
              "datePublished": "${post.createdAt}",
              "dateModified": "${post.updatedAt}",
            }
          `}
        </script>
      </Helmet>
    <div className="h-auto flex flex-col  items-center justify-center pt-8 pb-12">
      <div className="h-auto flex justify-center mt-32 ">
        <div className="w-[80vw]  max-w-[800px] h-auto flex flex-col justify-start gap-7">
          <div className="flex flex-col gap-5">
            <div className="text-pink-600 text-[13px] font-semibold flex gap-1 items-center">
              <FaArrowLeft />
              <a onClick={() => { navigate('/blog') }} className="decoration-none text-pink-600 hover:text-pink-600 cursor-pointer">All Blogs</a>
            </div>

            <div className="flex justify-start gap-4">
              <img className="w-12 h-12 rounded-full" src={post.authorImg} alt="Author" />
              <div>
                <h3 className="text-md font font-bold">{post.author}</h3>
                {post.authorOccupation && <h5 className="text-sm font-MontBook text-gray-700">{post.authorOccupation}</h5>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="text-gray-900 text-4xl font-Mont font-bold">
              {post.title}
            </div>
            {post.imageUrl && <img className="w-[752px] rounded-3xl" src={post.imageUrl} alt="Blog" />}

            <div className="text-gray-900">
              <div className="text-gray-850 text-xl font-semibold font-Mont leading-[35px]" dangerouslySetInnerHTML={{ __html: processTextWithLinks(post.description) }}></div>
              <br />
              <div className="text-gray-800 text-lg font-Mont leading-[28px]" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
