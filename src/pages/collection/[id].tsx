import CollectionDetailContainer from "@/containers/collection";
import CollectionDetailProvider from "@/containers/collection/context";

const CollectionDetail = () => {
  return (
    <CollectionDetailProvider>
      <CollectionDetailContainer />;
    </CollectionDetailProvider>
  );
};

export default CollectionDetail;
