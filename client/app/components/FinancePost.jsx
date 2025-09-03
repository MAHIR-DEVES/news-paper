// app/components/FinanceSection.jsx

import Image from 'next/image';
import Link from 'next/link';
import { getNews } from '../lib/getNews';

export default async function FinanceSection() {
  const news = await getNews('অর্থনীতি');

  return (
    <section className="my-10">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-bold mr-4">অর্থনীতি </h2>
        <div className="flex flex-col flex-grow gap-[2px] mt-1">
          <div className="border-t border-dotted border-black w-full h-0"></div>
          <div className="border-t border-dotted border-black w-full h-0"></div>
          <div className="border-t border-dotted border-black w-full h-0"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.slice(0, 4).map(post => (
          <Link key={post.id} href={`/news/${post.id}`}>
            <div className="group">
              <Image
                src={
                  post?.image?.startsWith('http')
                    ? post.image
                    : post?.image
                    ? `${process.env.NEXT_PUBLIC_ROOT_URL}${post.image}`
                    : '/fallback.jpg'
                }
                alt={post.title}
                className="w-full h-48 object-cover"
                width={500}
                height={500}
              />

              <h3 className="text-md font-bold mt-3 cursor-pointer transition-colors duration-200">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {post.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                প্রকাশ:{' '}
                {new Date(post.publish).toLocaleDateString('bn-BD', {
                  weekday: 'long', // রোববার
                  year: 'numeric', // ২০২৫
                  month: 'long', // আগস্ট
                  day: 'numeric', // ৩১
                })}
                ,{' '}
                {new Date(post.publish).toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false, // ২৪ ঘন্টার ফরম্যাট
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
