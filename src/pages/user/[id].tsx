import UserContainer from "@/containers/user";
import UserProvider from "@/containers/user/context";

const ProfileUser = () => {
  return (
    <UserProvider>
      <UserContainer />;
    </UserProvider>
  );
};

export default ProfileUser;
