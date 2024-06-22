import VenomToken from "../../../public/images/token/venom.png";
import CustomImage from "../custom-image";
import Link from "next/link";
import { formatBalance } from "@/utils";
import Image from "next/image";

const ProductCard = (props: any) => {
  const { nftId, title, imageUrl, ranking, listingPrice, isListing } = props;

  const renderPrice = () => {
    if (!isListing)
      return (
        <div className="flex items-center space-x-1">
          <Image src={VenomToken} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">Unlisted</span>
        </div>
      );
    return (
      <div className="flex gap-2 leading-[18px]">
        <span className="text-secondary text-xs font-medium">Price:</span>
        <div className="flex items-center space-x-1">
          <Image src={VenomToken} alt="Venom" width={12} height={12} />
          <span className="text-white text-xs font-medium">
            {formatBalance(listingPrice)} STRK
          </span>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Link href={`/nft/${nftId}`}>
        <div className="bg-layer-2 border border-solid rounded-lg p-2 border-stroke cursor-pointer group">
          <div className="flex flex-col space-y-2">
            <div className="aspect-square w-full overflow-hidden relative rounded-lg">
              <CustomImage
                src={imageUrl}
                alt="Nft"
                className="object-cover w-full h-full group-hover:scale-110 !transition !duration-300 !ease-in-out"
                wrapperClassName="w-full h-full"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between space-x-1 w-full truncate">
                <span className="text-white text-base font-medium leading-6 truncate">
                  {title}
                </span>
                {!!ranking && (
                  <div className="rounded-lg bg-primary text-semi-black font-medium text-xs p-1">
                    {`#${ranking}`}
                  </div>
                )}
              </div>
              {renderPrice()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
