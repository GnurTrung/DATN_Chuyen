import SettingContainer from "@/containers/setting";
import SettingProvider from "@/containers/setting/context";

const Settings = () => {
  return (
    <SettingProvider>
      <SettingContainer />
    </SettingProvider>
  );
};

export default Settings;
