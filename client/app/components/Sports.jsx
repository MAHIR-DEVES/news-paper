import Image from 'next/image';
import { getNews } from '../lib/getNews';
import Link from 'next/link';

const Sports = async () => {
  const sportsNews = await getNews('খেলা');
  const lifestyleNews = await getNews('লাইফস্টাইল');
  const entertainmentNews = await getNews('বিনোদন');

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10">
      <div className="lg:col-span-2">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold mr-4">খেলা</h2>
          <div className="flex flex-col  flex-grow gap-[2px] mt-1">
            <div className="border-t border-dotted border-black w-full h-0"></div>
            <div className="border-t border-dotted border-black w-full h-0"></div>
            <div className="border-t border-dotted border-black w-full h-0"></div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsNews.slice(0, 6).map((item, idx) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <div>
                <Image
                  src={
                    item?.image?.startsWith('http')
                      ? item.image
                      : item?.image
                      ? `${process.env.NEXT_PUBLIC_ROOT_URL}${item.image}`
                      : '/fallback.jpg'
                  }
                  alt={item.title}
                  className="w-full h-40 object-cover "
                  width={500}
                  height={500}
                />

                <h3 className="text-md font-bold mt-3 cursor-pointer transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2 ">
                  {item.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  প্রকাশ:{' '}
                  {new Date(item.publish).toLocaleDateString('bn-BD', {
                    weekday: 'long', // রোববার
                    year: 'numeric', // ২০২৫
                    month: 'long', // আগস্ট
                    day: 'numeric', // ৩১
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold mr-4"> লাইফস্টাইল </h2>
            <div className="flex flex-col  flex-grow gap-[2px] mt-1">
              <div className="border-t border-dotted border-black w-full h-0"></div>
              <div className="border-t border-dotted border-black w-full h-0"></div>
              <div className="border-t border-dotted border-black w-full h-0"></div>
            </div>
          </div>
          <ul className="space-y-3">
            {lifestyleNews?.slice(0, 5).map(item => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <li>
                  <p className="text-md font-bold mt-3  transition-colors duration-200 cursor-pointer">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    প্রকাশ:{' '}
                    {new Date(item.publish).toLocaleDateString('bn-BD', {
                      weekday: 'long', // রোববার
                      year: 'numeric', // ২০২৫
                      month: 'long', // আগস্ট
                      day: 'numeric', // ৩১
                    })}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-bold mr-4">বিনোদন</h2>
            <div className="flex flex-col  flex-grow gap-[2px] mt-1">
              <div className="border-t border-dotted border-black w-full h-0"></div>
              <div className="border-t border-dotted border-black w-full h-0"></div>
              <div className="border-t border-dotted border-black w-full h-0"></div>
            </div>
          </div>
          <ul className="space-y-3">
            {entertainmentNews?.slice(0, 4).map(item => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <li>
                  <p className="text-md font-bold mt-3  transition-colors duration-200 cursor-pointer">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    প্রকাশ:{' '}
                    {new Date(item.publish).toLocaleDateString('bn-BD', {
                      weekday: 'long', // রোববার
                      year: 'numeric', // ২০২৫
                      month: 'long', // আগস্ট
                      day: 'numeric', // ৩১
                    })}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Sports;
