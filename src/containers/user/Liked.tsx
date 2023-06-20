import { useUserContext } from "./context";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "@/components/NoData";
import SkeletonLoadingGrid from "@/components/product-card/SkeletonLoadingGrid";
import FavoriteProductCard from "@/components/product-card/FavoriteProductCard";

const Liked = () => {
  const { loading, loadMoreNft, pagination, handleLikeNft, favoriteNfts } =
    useUserContext();
  return (
    <div className="w-full pb-20">
      <InfiniteScroll
        dataLength={pagination.limit}
        next={loadMoreNft}
        hasMore={favoriteNfts.nextPage}
        loader={<SkeletonLoadingGrid />}
        className="grid gap-3
              2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
      >
        {!favoriteNfts.data?.length && !loading ? (
          <div className="col-span-full mt-8">
            <NoData />
          </div>
        ) : (
          favoriteNfts.data?.map((item: any) => (
            <FavoriteProductCard
              key={item.id}
              {...item}
              handleLikeNft={handleLikeNft}
            />
          ))
        )}
        {loading && <SkeletonLoadingGrid />}
      </InfiniteScroll>
    </div>
  );
};

export default Liked;
